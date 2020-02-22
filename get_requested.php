<?php


include("../db_ini.php");
include("../utils.php");
include("header.php");


$channels_list = getListByIDs($request_string);

$return_string = NULL;

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_errno)
{
  printf("Connect failed: %s\n", mysqli_connect_error());
  exit();
}

$sql_request_channels = "SELECT DISTINCT AD.CHANNEL_INDEX FROM " . $acquired_data_table_name . " AD WHERE AD.CHANNEL_INDEX IN (" . $channels_list . ") AND AD.STATUS = -1";
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
