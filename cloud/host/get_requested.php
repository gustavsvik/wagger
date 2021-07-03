<?php


include("../header.php");
include("../db_ini.php");
include("../utils.php");
include("../database.php");
include("header.php");

/*
$conn = mysqli_init();
if (!$conn) die('mysqli_init failed');
if (!$conn->options(MYSQLI_OPT_CONNECT_TIMEOUT, 5)) die('Setting MYSQLI_OPT_CONNECT_TIMEOUT failed');
if (!$conn->real_connect($SERVERNAME, $USERNAME, $PASSWORD, $DBNAME)) die('Connect Error (' . mysqli_connect_errno() . ') ' . mysqli_connect_error());
*/
$conn = db_get_connection($SERVERNAME, $USERNAME, $PASSWORD, $DBNAME);

$conn->autocommit(TRUE);

$channels_list = getListByIDs($request_string);
$return_string = NULL;

$sql_request_channels = "SELECT DISTINCT AD.CHANNEL_INDEX FROM " . $ACQUIRED_DATA_TABLE_NAME . " AD WHERE AD.CHANNEL_INDEX IN (" . $channels_list . ") AND AD.STATUS = " . strval($STATUS_REQUESTED);
$channels_requested = $conn->query($sql_request_channels);

if ($channels_requested && $channels_requested->num_rows > 0) 
{
  while ($channel_row = $channels_requested->fetch_assoc()) 
  {
    $sql_get_channel_points = "SELECT DISTINCT ACQUIRED_TIME FROM " . $ACQUIRED_DATA_TABLE_NAME . " AD WHERE AD.STATUS = " . strval($STATUS_REQUESTED) . " AND AD.CHANNEL_INDEX = " . $channel_row["CHANNEL_INDEX"] . " AND AD.ACQUIRED_TIME>" . strval(time()-$duration*$unit) . " ORDER BY ACQUIRED_TIME DESC";
    $channel_points = $conn->query($sql_get_channel_points);
    if ($channel_points && $channel_points->num_rows > 0) 
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
