<?php


include("../db_ini.php");
include("header.php");

$data_start = 0;
$data_end = strlen($request_string);
$channel_start = $data_start;
$channels_list = "(";
while ($channel_start < $data_end)
{
  if ($channel_start>0) $channels_list .= ",";
  $channel_end = strpos($request_string, ';', $channel_start);
  $channel_string = mb_substr($request_string, $channel_start, $channel_end-$channel_start);
  $channel = intval($channel_string);
  $points_start = $channel_end+1;
  $points_end = strpos($request_string, ';', $points_start);
  $points_string = mb_substr($request_string, $points_start, $points_end-$points_start);
  while ($points_start < $points_end)
  {
    $timestamp_start = $points_start;
    $timestamp_end = strpos($request_string, ",", $timestamp_start);
    $timestamp_string = mb_substr($request_string, $timestamp_start, $timestamp_end-$timestamp_start);
    $timestamp = intval($timestamp_string);
    $value_start = $timestamp_end+1;
    $value_end = strpos($request_string, ",", $value_start);
    $value_string = mb_substr($request_string, $value_start, $value_end-$value_start);
    $value = doubleval($value_string);
    $subsamples_start = $value_end+1;
    $subsamples_end = strpos($request_string, ",", $subsamples_start);
    $subsamples_string = mb_substr($request_string, $subsamples_start, $subsamples_end-$subsamples_start);
    $base64_start = $subsamples_end+1;
    $base64_end = strpos($request_string, ",", $base64_start);
    $base64_string = mb_substr($request_string, $base64_start, $base64_end-$base64_start);
    $points_start = $base64_end+1;
  }
  $channel_start = $points_end+1;
  $channels_list .= $channel_string;
}
$channels_list .= ")";

$return_string = NULL;

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_errno)
{
  printf("Connect failed: %s\n", mysqli_connect_error());
  exit();
}


$sql_request_channels = "SELECT DISTINCT AD.CHANNEL_INDEX FROM " . $acquired_data_table_name . " AD WHERE AD.CHANNEL_INDEX IN " . $channels_list . " AND AD.STATUS = -1";
$channels_requested = $conn->query($sql_request_channels);
if ($channels_requested->num_rows > 0) 
{
  while ($channel_row = $channels_requested->fetch_assoc()) 
  {
    $sql_get_channel_points = "SELECT DISTINCT ACQUIRED_TIME FROM " . $acquired_data_table_name . " AD WHERE AD.STATUS = -1 AND AD.CHANNEL_INDEX = " . $channel_row["CHANNEL_INDEX"] . " AND AD.ACQUIRED_TIME>" . strval(time()-$duration*$unit) . " ORDER BY ACQUIRED_TIME DESC";
    $channel_points = $conn->query($sql_get_channel_points);
    if ($channel_points->num_rows > 0) 
    {
      $return_string .= $channel_row["CHANNEL_INDEX"] . ";";
      while ($point_row = $channel_points->fetch_assoc()) 
      {
        $return_string .= $point_row["ACQUIRED_TIME"] . ",";
      }
      $return_string .= ";";
    } 
    else 
    {
    }
  }
}
else 
{
}

$conn->close();


header("Content-type: application/json");
$json_array = array('returnstring' => $return_string);
echo json_encode($json_array);


?>
