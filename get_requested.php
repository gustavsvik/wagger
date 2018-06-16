<?php


$data_string = NULL;
$data_string = strval(getPost('channelrange', '-1;;'));

$data_start = 0;
$data_end = strlen($data_string);
$channel_start = $data_start;
$channels_list = "(";
while ($channel_start < $data_end)
{
  if ($channel_start>0) $channels_list .= ",";
  $channel_end = strpos($data_string, ';', $channel_start);
  $channel_string = mb_substr($data_string, $channel_start, $channel_end-$channel_start);
  $channel = intval($channel_string);
  $points_start = $channel_end+1;
  $points_end = strpos($data_string, ';', $points_start);
  $points_string = mb_substr($data_string, $points_start, $points_end-$points_start);
  while ($points_start < $points_end)
  {
    $timestamp_start = $points_start;
    $timestamp_end = strpos($data_string, ",", $timestamp_start);
    $timestamp_string = mb_substr($data_string, $timestamp_start, $timestamp_end-$timestamp_start);
    $timestamp = intval($timestamp_string);
    $value_start = $timestamp_end+1;
    $value_end = strpos($data_string, ",", $value_start);
    $value_string = mb_substr($data_string, $value_start, $value_end-$value_start);
    $value = doubleval($value_string);
    $subsamples_start = $value_end+1;
    $subsamples_end = strpos($data_string, ",", $subsamples_start);
    $subsamples_string = mb_substr($data_string, $subsamples_start, $subsamples_end-$subsamples_start);
    $base64_start = $subsamples_end+1;
    $base64_end = strpos($data_string, ",", $base64_start);
    $base64_string = mb_substr($data_string, $base64_start, $base64_end-$base64_start);
    $points_start = $base64_end+1;
  }
  $channel_start = $points_end+1;
  $channels_list .= $channel_string;
}
$channels_list .= ")";

$return_string = NULL;

$servername = "mydb6.surf-town.net";
$username = "dannil1_daq";
$password = "2k8Y8!16";
$dbname = "dannil1_data_logging_db";

$conn = new mysqli($servername, $username, $password, $dbname);
if (mysqli_connect_errno())
{
  printf("Connect failed: %s\n", mysqli_connect_error());
  exit();
}

$sql_request_channels = "SELECT DISTINCT AD.CHANNEL_INDEX FROM T_ACQUIRED_DATA AD WHERE AD.CHANNEL_INDEX IN " . $channels_list . " AND AD.STATUS = -1";
$channels_requested = $conn->query($sql_request_channels);
if ($channels_requested->num_rows > 0) 
{
  while ($channel_row = $channels_requested->fetch_assoc()) 
  {
    $return_string .= $channel_row["CHANNEL_INDEX"] . ";";
    $sql_get_channel_points = "SELECT DISTINCT ACQUIRED_TIME FROM T_ACQUIRED_DATA AD WHERE AD.STATUS = -1 AND AD.CHANNEL_INDEX = " . $channel_row["CHANNEL_INDEX"] . " LIMIT 1000";
    $channel_points = $conn->query($sql_get_channel_points);
    if ($channel_points->num_rows > 0) 
    {
      while ($point_row = $channel_points->fetch_assoc()) 
      {
        $return_string .= $point_row["ACQUIRED_TIME"] . ",";
      }
    } 
    else 
    {
    }
    $return_string .= ";";
  }
}
else 
{
}

$conn->close();

header("Content-type: application/json");
$json_array = array('returnstring' => $return_string);
echo json_encode($json_array);


function getPost($key, $default) 
{
  if (isset($_POST[$key]))
    return $_POST[$key];
  return $default;
}


?>
