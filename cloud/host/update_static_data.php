<?php


include("../header.php");
include("../db_ini.php");
include("../utils.php");
include("header.php");

/*
$conn = mysqli_init();
if (!$conn) die('mysqli_init failed');
if (!$conn->options(MYSQLI_OPT_CONNECT_TIMEOUT, 5)) die('Setting MYSQLI_OPT_CONNECT_TIMEOUT failed');
if (!$conn->real_connect($SERVERNAME, $USERNAME, $PASSWORD, $DBNAME)) die('Connect Error (' . mysqli_connect_errno() . ') ' . mysqli_connect_error());
*/

debug_log('$host_hardware_id: ', $host_hardware_id);
debug_log('$host_text_id: ', $host_text_id);
debug_log('$host_address: ', $host_address);
debug_log('$host_description: ', $host_description);
debug_log('$device_hardware_id: ', $device_hardware_id);
debug_log('$device_text_id: ', $device_text_id);
debug_log('$module_text_id: ', $module_text_id);
debug_log('$channel_text_id: ', $channel_text_id);

$conn = db_get_connection($SERVERNAME, $USERNAME, $PASSWORD, $DBNAME);

/*
$existing_host_indices = array();
$sql_get_existing_hosts = "SELECT HO.HOST_UNIQUE_INDEX FROM t_host HO WHERE HO.HOST_HARDWARE_ID='" . $host_hardware_id . "'";
$existing_hosts = $conn->query($sql_get_existing_hosts);
if (is_object($existing_hosts) && $existing_hosts->num_rows > 0)
{
  while ($host_row = $existing_hosts->fetch_array(MYSQLI_NUM))
  {
    if (!is_null($host_row[0])) $existing_host_indices[] = $host_row[0];
  }
}
$host_unique_index = 0;
if (count($existing_host_indices) > 0)
{
  $host_unique_index = $existing_host_indices[0];
  debug_log('$host_unique_index: ', $host_unique_index);
}
*/

$host_unique_index = db_get_index($conn, "t_host", "HOST_HARDWARE_ID", $host_hardware_id);

if ($host_unique_index > 0)
{
  $conn->autocommit(FALSE);
  $conn->begin_transaction();
  $stmt = NULL;
  $stmt_string = "UPDATE t_host SET HOST_HARDWARE_ID=?, HOST_TEXT_ID=?, HOST_ADDRESS=?, HOST_DESCRIPTION=?, HOST_TIME=UNIX_TIMESTAMP(CURRENT_TIMESTAMP()), HOST_UPDATED_TIMESTAMP=CURRENT_TIMESTAMP(), HOST_STATUS=0 WHERE HOST_UNIQUE_INDEX=?";
  debug_log('$stmt_string: ', $stmt_string);
  $stmt = $conn->prepare($stmt_string);
  $stmt->bind_param('sssss', $host_hardware_id, $host_text_id, $host_address, $host_description, $host_unique_index);

  if(!$stmt->execute())
  {
    $conn->rollback();
    die();
  }
  $stmt->close();
  $conn->commit();
}
else
{
/*
  $max_host_index = 0;
  $sql_max_host_index = "SELECT MAX(HO.HOST_UNIQUE_INDEX) FROM t_host HO";
  $max_host_index_array = $conn->query($sql_max_host_index);
  if ($max_host_index_array->num_rows > 0) 
  {
    if ($max_host_index_rows = $max_host_index_array->fetch_array(MYSQLI_NUM)) 
    {
      if (!is_null($max_host_index_rows[0])) $max_host_index = intval($max_host_index_rows[0]);
    }
  } 
  $new_host_index = $max_host_index + 1;
  debug_log('$new_host_index: ', strval($new_host_index));
*/
  $new_host_index = db_get_new_index($conn, "t_host");

  $conn->autocommit(FALSE);
  $conn->begin_transaction();
  $stmt = NULL;
  $stmt_string = "INSERT INTO t_host (HOST_UNIQUE_INDEX, HOST_HARDWARE_ID, HOST_TEXT_ID, HOST_ADDRESS, HOST_DESCRIPTION, HOST_TIME, HOST_STATUS) VALUES (?,?,?,?,?,UNIX_TIMESTAMP(CURRENT_TIMESTAMP()),0) ON DUPLICATE KEY UPDATE HOST_TEXT_ID = VALUES(HOST_TEXT_ID), HOST_ADDRESS = VALUES(HOST_ADDRESS), HOST_DESCRIPTION = VALUES(HOST_DESCRIPTION), HOST_TIME = VALUES(HOST_TIME), HOST_STATUS = VALUES(HOST_STATUS)";
  debug_log('$stmt_string: ', $stmt_string);
  $stmt = $conn->prepare($stmt_string);
  $stmt->bind_param('sssss', $new_host_index, $host_hardware_id, $host_text_id, $host_address, $host_description);
  if(!$stmt->execute())
  {
    $conn->rollback();
    die();
  }
  $stmt->close();
  $conn->commit();
}

$conn->close();


header("Content-type: application/json");
$json_array = array('returnstring' => $return_string);
echo json_encode($json_array);
