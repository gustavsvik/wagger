<?php


include("../db_ini.php");
include("../utils.php");
include("header.php");

$conn = mysqli_init();
if (!$conn) die('mysqli_init failed');
if (!$conn->options(MYSQLI_OPT_CONNECT_TIMEOUT, 5)) die('Setting MYSQLI_OPT_CONNECT_TIMEOUT failed');
if (!$conn->real_connect($SERVERNAME, $USERNAME, $PASSWORD, $DBNAME)) die('Connect Error (' . mysqli_connect_errno() . ') ' . mysqli_connect_error());

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

    $stmt=$conn->prepare("UPDATE " . $ACQUIRED_DATA_TABLE_NAME . " SET ACQUIRED_VALUE=?,ACQUIRED_SUBSAMPLES=?,ACQUIRED_BASE64=?,STATUS=0 WHERE CHANNEL_INDEX=? AND ACQUIRED_TIME=? AND STATUS=-1");
    $stmt->bind_param('sssss',$value,$subsamples_string,$base64_string,$channel,$timestamp);
    if(!$stmt->execute())
    {
      $conn->rollback();
      exit();
    }
    $stmt->close();
    $points_start = $base64_end+1;
  }

  $channel_start = $points_end+1;
}

$conn->commit();
$conn->close();
