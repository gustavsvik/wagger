<?php


include("../header.php");
include("../db_ini.php");
include("../utils.php");
include("../database.php");
include("header.php");


//debug_log('$host_hardware_id: ', $host_hardware_id);
//debug_log('$host_text_id: ', $host_text_id);
//debug_log('$device_hardware_id: ', $device_hardware_id);
//debug_log('$device_text_id: ', $device_text_id);
//debug_log('$device_address: ', $device_address);
//debug_log('$module_hardware_id: ', $module_hardware_id);
//debug_log('$module_text_id: ', $module_text_id);
//debug_log('$channel_hardware_id: ', $channel_hardware_id);
//debug_log('$channel_text_id: ', $channel_text_id);
//debug_log('$common_address: ', $common_address);
debug_log('$common_description: ', $common_description);

$conn = db_get_connection($SERVERNAME, $USERNAME, $PASSWORD, $DBNAME);

if (!is_null($conn))
{
  //$host_unique_index = db_get_index($conn, "HOST", "HARDWARE_ID", $host_hardware_id);
  $host_unique_index = NULL; // Auto-incremented table
  $new_host_index = db_update_static_by_index($conn, "HOST", $host_unique_index, $host_hardware_id, $host_text_id, $common_address, $common_description);
  //$device_unique_index = db_get_index($conn, "DEVICE", "HARDWARE_ID", $device_hardware_id);
  $device_unique_index = NULL; // Auto-incremented table
  $new_device_index = db_update_static_by_index($conn, "DEVICE", $device_unique_index, $device_hardware_id, $device_text_id, $device_address, $common_description);
  if ($new_device_index > -1) db_update_single_by_index($conn, "DEVICE", $new_device_index, "HOST_INDEX", $new_host_index);
  //$device_unique_index = db_get_index($conn, "MODULE", "HARDWARE_ID", $module_hardware_id);
  $module_unique_index = NULL; // Auto-incremented table
  $new_module_index = db_update_static_by_index($conn, "MODULE", $module_unique_index, $module_hardware_id, $module_text_id, $module_address, $common_description);
  if ($new_module_index > -1) db_update_single_by_index($conn, "MODULE", $new_module_index, "DEVICE_INDEX", $new_device_index);

  $conn->close();
}

/*
header("Content-type: application/json");
$json_array = array('returnstring' => $return_string);
echo json_encode($json_array);
*/
