<?php


include("../db_ini.php");
include("../utils.php");
include("header.php");


$channels_list = getListByIDs($request_string);

$return_string = NULL;

$conn = new mysqli($SERVERNAME, $USERNAME, $PASSWORD, $DBNAME);
if (mysqli_connect_errno())
{
  printf("Connect failed: %s\n", mysqli_connect_error());
  exit();
}

$sql_request_channels = "SELECT DISTINCT AD.CHANNEL_INDEX FROM " . $ACQUIRED_DATA_TABLE_NAME . " AD WHERE AD.CHANNEL_INDEX IN (" . $channels_list . ") AND AD.STATUS = -1";
$channels_requested = $conn->query($sql_request_channels);
if ($channels_requested->num_rows > 0) 
{
  while ($channel_row = $channels_requested->fetch_assoc()) 
  {
    $return_string .= $channel_row["CHANNEL_INDEX"] . ";";
    $sql_get_channel_points = "SELECT ACQUIRED_TIME,ACQUIRED_VALUE FROM " . $ACQUIRED_DATA_TABLE_NAME . " AD WHERE AD.STATUS = -1 AND AD.CHANNEL_INDEX = " . $channel_row["CHANNEL_INDEX"] . " LIMIT 1000";
    $channel_points = $conn->query($sql_get_channel_points);
    if ($channel_points->num_rows > 0) 
    {
      while ($point_row = $channel_points->fetch_assoc()) 
      {
        $return_string .= $point_row["ACQUIRED_TIME"] . ",";
        $return_string .= $point_row["ACQUIRED_VALUE"] . ",";
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
