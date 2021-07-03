<?php


include("../header.php");
include("../db_ini.php");
include("../utils.php");
include("../database.php");
include("header.php");


$channels_list = getListByIDs($request_string);

/*
$conn = mysqli_init();
if (!$conn) 
{
  die('mysqli_init failed');
}
if (!$conn->options(MYSQLI_OPT_CONNECT_TIMEOUT, 5)) 
{
  die('Setting MYSQLI_OPT_CONNECT_TIMEOUT failed');
}
if (!$conn->real_connect($SERVERNAME, $USERNAME, $PASSWORD, $DBNAME)) 
{
  die('Connect Error (' . mysqli_connect_errno() . ') ' . mysqli_connect_error());
}
*/
$conn = db_get_connection($SERVERNAME, $USERNAME, $PASSWORD, $DBNAME);

if ($conn)
{
  $conn->autocommit(FALSE);
  $conn->begin_transaction();
  $sql_delete = "DELETE FROM " . $ACQUIRED_DATA_TABLE_NAME ;
  $sql_delete .= " WHERE CHANNEL_INDEX IN (" . $channels_list . ")" ;
  $sql_delete .= " AND TIMEDIFF(SYSDATE(), ADDED_TIMESTAMP)>" . strval($delete_horizon) ;
  $sql_delete .= " AND AD.STATUS >= " . strval($lowest_status) ;
  $sql_delete .= " AND AD.STATUS < " . strval($STATUS_STORED) ;
    
  $stmt=$conn->prepare($sql_delete);
  if ($stmt)
  {
    if(!$stmt->execute())
    {
      $conn->rollback();
      die();
    }
    $sql_optimize = "OPTIMIZE TABLE " . $ACQUIRED_DATA_TABLE_NAME;
    $stmt=$conn->prepare($sql_optimize);
    if(!$stmt->execute())
    {
      $conn->rollback();
      die();
    }
    $stmt->close();
  }
  $conn->commit();
  $conn->close();
}

$return_string = "";
$return_string = $channels_list;


header("Content-type: application/json");
$json_array = array('returnstring' => $return_string);
echo json_encode($json_array);
