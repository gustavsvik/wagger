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
  $channel = 9999;
  $channel_end = strpos($return_string, ';', $channel_start);
  $channel_string = mb_substr($return_string, $channel_start, $channel_end-$channel_start);
  $channel = intval($channel_string);
  echo "channel";  
  echo $channel;

  $points_start = $channel_end+1;
  $points_end = strpos($return_string, ';', $points_start);
  $points_string = mb_substr($return_string, $points_start, $points_end-$points_start);
  echo "points_start";  
  echo $points_start;
  echo "points_end";  
  echo $points_end;
  echo "points_string";  
  echo $points_string;

/*
  while ($points_start < $points_end)
  {
    $timestamp = -9999;
    $timestamp_start = $points_start;
    $timestamp_end = strpos($return_string, ",", $timestamp_start);
    $timestamp_string = mb_substr($return_string, $timestamp_start, $timestamp_end-$timestamp_start);
    $timestamp = intval($timestamp_string);
    if ($timestamp <= 0) $timestamp = intval(time());
    echo "timestamp";  
    echo $timestamp;
    $value = -9999.0;
    $value_start = $timestamp_end+1;
    $value_end = strpos($return_string, ",", $value_start);
    $value_string = mb_substr($return_string, $value_start, $value_end-$value_start);
    $value = doubleval($value_string);
    echo "value";
    echo $value;
    $subsamples_string = "-9999";
    $subsamples_start = $value_end+1;
    $subsamples_end = strpos($return_string, ",", $subsamples_start);
    $subsamples_string = mb_substr($return_string, $subsamples_start, $subsamples_end-$subsamples_start);
    echo "subsamples_string";
    echo $subsamples_string;
    $base64_string = "-9999";
    $base64_start = $subsamples_end+1;
    $base64_end = strpos($return_string, ",", $base64_start);
    $base64_string = mb_substr($return_string, $base64_start, $base64_end-$base64_start);
    echo "base64_string";
    echo $base64_string;

    $existing_points_array = array();
    $sql_get_existing_points = "SELECT DISTINCT AD.ACQUIRED_TIME FROM T_ACQUIRED_DATA AD WHERE AD.CHANNEL_INDEX=" . strval($channel) . " AND AD.ACQUIRED_TIME =" . strval($timestamp);
    echo $sql_get_existing_points;
    
    $existing_points = $conn->query($sql_get_existing_points);
    if ($existing_points->num_rows > 0) 
    {
      while ($point_row = $existing_points->fetch_array(MYSQLI_NUM)) 
      {
        if (!is_null($point_row[0])) $existing_points_array[] = $point_row[0];
      }
    }

    if (in_array($timestamp, $existing_points_array))
    {
    }
    else
    {
      $stmt=$conn->prepare("INSERT INTO T_ACQUIRED_DATA (CHANNEL_INDEX,ACQUIRED_TIME,ACQUIRED_VALUE,ACQUIRED_SUBSAMPLES,ACQUIRED_BASE64,STATUS) VALUES (?,?,?,?,?,0)");
      $stmt->bind_param('iidss',$channel,$timestamp,$value,$subsamples_string,$base64_string);
      if (!$stmt->execute())
      {
        $conn->rollback();
        exit();
      }
      $stmt->close();
    }
    
    $points_start = $base64_end+1;
  }
*/
  $channel_start = $points_end+1;
}

$conn->commit();
$conn->close();


?>
