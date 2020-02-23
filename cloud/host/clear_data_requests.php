<?php


include("../db_ini.php");
include("../utils.php");
include("header.php");


$channels_list = getListByIDs($request_string);

$conn = mysqli_init();
if (!$conn) 
{
  die('mysqli_init failed');
}
if (!$conn->options(MYSQLI_OPT_CONNECT_TIMEOUT, 5)) 
{
  die('Setting MYSQLI_OPT_CONNECT_TIMEOUT failed');
}
if (!$conn->real_connect($servername, $username, $password, $dbname)) 
{
  die('Connect Error (' . mysqli_connect_errno() . ') ' . mysqli_connect_error());
}

$conn->autocommit(FALSE);
$conn->begin_transaction();
$stmt=$conn->prepare("DELETE FROM " . $acquired_data_table_name . " WHERE CHANNEL_INDEX IN (" . $channels_list . ") AND STATUS = -1");
if(!$stmt->execute())
{
  $conn->rollback();
}
$stmt=$conn->prepare("OPTIMIZE TABLE " . $acquired_data_table_name);
if(!$stmt->execute())
{
  $conn->rollback();
}

$stmt->close();
$conn->commit();
$conn->close();

$return_string = "";
$return_string = $channels_list;


header("Content-type: application/json");
$json_array = array('returnstring' => $return_string);
echo json_encode($json_array);


?>

