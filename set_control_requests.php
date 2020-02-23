<?php


include("../db_ini.php");
include("../utils.php");
include("header.php");

$conn = new mysqli($servername, $username, $password, $dbname);
if (mysqli_connect_errno())
{
  printf("Connect failed: %s\n", mysqli_connect_error());
  exit();
}
$conn->autocommit(FALSE);
$conn->begin_transaction();

$data_start = 0;
$data_end = strlen($return_string);
$channel_start = $data_start;

while ($channel_start < $data_end)
{
  $channel_end = strpos($return_string, ';', $channel_start);
  $channel_string = mb_substr($return_string, $channel_start, $channel_end-$channel_start);
  $channel = intval($channel_string);

  $points_start = $channel_end+1;
  $points_end = strpos($return_string, ';', $points_start);
  $points_string = mb_substr($return_string, $points_start, $points_end-$points_start);

  while ($points_start < $points_end)
  {
    $timestamp_start = $points_start;
    $timestamp_end = strpos($return_string, ",", $timestamp_start);
    $timestamp_string = mb_substr($return_string, $timestamp_start, $timestamp_end-$timestamp_start);
    $timestamp = intval($timestamp_string);
    $value_start = $timestamp_end+1;
    $value_end = strpos($return_string, ",", $value_start);
    $value_string = mb_substr($return_string, $value_start, $value_end-$value_start);
    $value = doubleval($value_string);
    $subsamples_start = $value_end+1;
    $subsamples_end = strpos($return_string, ",", $subsamples_start);
    $subsamples_string = mb_substr($return_string, $subsamples_start, $subsamples_end-$subsamples_start);
    $base64_start = $subsamples_end+1;
    $base64_end = strpos($return_string, ",", $base64_start);
    $base64_string = mb_substr($return_string, $base64_start, $base64_end-$base64_start);

    $stmt=$conn->prepare("UPDATE " . $acquired_data_table_name . " SET ACQUIRED_VALUE=?,ACQUIRED_SUBSAMPLES=?,ACQUIRED_BASE64=?,STATUS=0 WHERE CHANNEL_INDEX=? AND ACQUIRED_TIME=? AND STATUS=-1");
    $stmt->bind_param('sssss',$value,$subsamples_string,$base64_string,$channel,$timestamp);
    if(!$stmt->execute())
    {
      $conn->rollback();
      exit();
    }

    $points_start = $base64_end+1;
  }

  $channel_start = $points_end+1;
}

$stmt->close();
$conn->commit();
$conn->close();


?>
