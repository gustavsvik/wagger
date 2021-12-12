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
//debug_log('$module_hardware_id: ', $module_hardware_id);
//debug_log('$module_text_id: ', $module_text_id);
debug_log('$module_address: ', $module_address);
//debug_log('$channel_hardware_id: ', $channel_hardware_id);
//debug_log('$channel_text_id: ', $channel_text_id);
//debug_log('$common_address: ', $common_address);
debug_log('$common_description: ', $common_description);

$channel_text_id = 'JSON';
$channel_address = http_get_client_ip();


if (is_null($module_address)) $module_id_string = http_get_client_id_string(["REQUEST_TIME_FLOAT", "REQUEST_TIME", "REMOTE_PORT", "CONTENT_LENGTH", 'HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR']);
else $module_id_string = strval($module_address);
debug_log('$module_id_string: ', $module_id_string);

if (is_null($module_address)) $channel_id_string = http_get_client_id_string(["REQUEST_TIME_FLOAT", "REQUEST_TIME", "REMOTE_PORT", "CONTENT_LENGTH"]) . ' ' . $channel_text_id;
else $channel_id_string = strval($module_address) . ' ' . $channel_address;
debug_log('$channel_id_string: ', $channel_id_string);
$channel_hardware_id = md5($channel_id_string) ;
debug_log('$channel_hardware_id: ', $channel_hardware_id);
//$channel_text_id = $channel_hardware_id;

$conn = db_get_connection($SERVERNAME, $USERNAME, $PASSWORD, $DBNAME);

$new_channel_index = -1;

if (!is_null($conn))
{
  //$host_unique_index = db_get_index($conn, "HOST", "HARDWARE_ID", $host_hardware_id);
  //db_update_static_by_index($conn, "HOST", $host_unique_index, $host_hardware_id, $host_text_id, $common_address, $common_description);
  //$device_unique_index = db_get_index($conn, "DEVICE", "HARDWARE_ID", $device_hardware_id);
  $module_unique_index = NULL; // Auto-incremented table
  $module_hardware_id = md5($module_id_string);
  debug_log('$module_hardware_id: ', $module_hardware_id);
  $module_text_id = 'WEB'; //$module_hardware_id;
  $new_module_index = db_update_static_by_index($conn, "MODULE", $module_unique_index, $module_hardware_id, $module_text_id, $module_address, $common_description);
  //$device_unique_index = db_get_index($conn, "MODULE", "HARDWARE_ID", $module_hardware_id);
  //db_update_static_by_index($conn, "MODULE", $module_unique_index, $module_hardware_id, $module_text_id, $common_address, $common_description);
  //$channel_unique_index = db_get_index($conn, "CHANNEL", "HARDWARE_ID", $channel_hardware_id);
  $channel_unique_index = NULL; // Auto-incremented table
  $new_channel_index = db_update_static_by_index($conn, "CHANNEL", $channel_unique_index, $channel_hardware_id, $channel_text_id, $channel_address, $common_description);
  if ($new_channel_index > -1) db_update_single_by_index($conn, "CHANNEL", $new_channel_index, "MODULE_INDEX", $new_module_index);
  $conn->close();
}

header("Content-type: application/json");
$json_array = array('new_channel_index' => $new_channel_index);
echo json_encode($json_array);

