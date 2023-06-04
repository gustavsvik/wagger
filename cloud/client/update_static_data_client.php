<?php


include_once("../Log.php");
include_once("../Inet.php");
include_once("../StaticRecordsApi.php");
include_once("../StaticRecordsSql.php");

$log = new Log();
$inet = new Inet();
$api = new StaticRecordsApi();
$sql = new StaticRecordsSql();

$api_module_address = $api::get_module_address();
$api_common_description = $api::get_common_description();

if (is_null($api_module_address)) $device_id_string = $inet::generate_client_id_string(["REQUEST_TIME_FLOAT", "REQUEST_TIME", "REMOTE_PORT", "CONTENT_LENGTH", 'HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR']);
else $device_id_string = strval($api_module_address);
if ($device_id_string == '99999') $device_id_string .= ' ' . strval($inet::extract_client_ip());
$device_address = strval($inet::extract_client_ip());
$device_hardware_id = md5($device_id_string) ;
$device_text_id = $api_module_address;

if (is_null($api_module_address)) $module_id_string = $inet::generate_client_id_string(["REQUEST_TIME_FLOAT", "REQUEST_TIME", "REMOTE_PORT", "CONTENT_LENGTH", 'HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR']);
else $module_id_string = strval($api_module_address);
if ($module_id_string == '99999') $module_id_string .= ' ' . strval($inet::extract_client_ip());
$log::debug('$module_id_string: ', $module_id_string);
$module_address = strval($inet::extract_client_ip());
$module_hardware_id = md5($module_id_string);
$log::debug('$module_hardware_id: ', $module_hardware_id);
$module_text_id = $api_module_address;

if (is_null($api_module_address)) $channel_id_string = $inet::generate_client_id_string(["REQUEST_TIME_FLOAT", "REQUEST_TIME", "REMOTE_PORT", "CONTENT_LENGTH"]) . ' ' . $channel_text_id;
else $channel_id_string = strval($api_module_address); //. ' ' . strval($channel_address); //$channel_address;
if ($channel_id_string == '99999') $channel_id_string .= ' ' . strval($inet::extract_client_ip());
$log::debug('$channel_id_string: ', $channel_id_string);
$channel_address = strval($inet::extract_client_ip());
$channel_hardware_id = md5($channel_id_string) ;
$log::debug('$channel_hardware_id: ', $channel_hardware_id);
$channel_text_id = $api_module_address;

$device_unique_index = NULL; // Unspecified index, requires auto-incremented database table
$new_device_index = $sql::update_static_by_index("DEVICE", $device_unique_index, $device_hardware_id, $device_text_id, $device_address, $api_common_description);

$module_unique_index = NULL; // Unspecified index, requires auto-incremented database table
$new_module_index = -1;
$new_module_index = $sql::update_static_by_index("MODULE", $module_unique_index, $module_hardware_id, $module_text_id, $module_address, $api_common_description);
if ($new_module_index > -1) $sql::update_single_by_index("MODULE", $new_module_index, "DEVICE_INDEX", $new_device_index);

$channel_unique_index = NULL; // Unspecified index, requires auto-incremented database table
$new_channel_index = -1;
$new_channel_index = $sql::update_static_by_index("CHANNEL", $channel_unique_index, $channel_hardware_id, $channel_text_id, $channel_address, $api_common_description);
if ($new_channel_index > -1) $sql::update_single_by_index("CHANNEL", $new_channel_index, "MODULE_INDEX", $new_module_index);

$sql::close();

header("Content-type: application/json");
$json_array = array('new_channel_index' => $new_channel_index);
echo json_encode($json_array);

