<?php


include("../db_ini.php");
include("../utils.php");
include("header.php");

$request_string = "20;;97;;";

$channels_list = getChannelsList($request_string);

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_errno)
{
  printf("Connect failed: %s\n", mysqli_connect_error());
  exit();
}

//$return_string = "";

$sql_request_channels = "SELECT * FROM " . $channels_table_name . " C WHERE C.CHANNEL_UNIQUE_INDEX IN (" . $channels_list . ")";
$channels_requested = $conn->query($sql_request_channels); 

if ($channels_requested->num_rows > 0) 
{
  while ($channel_row = $channels_requested->fetch_assoc()) 
  {
    $rows[] = $channel_row;
  }
}
else 
{
}

$conn->close();


header("Content-type: application/json");
$json_array = array('returnstring' => $rows);
echo json_encode($json_array);


?>
