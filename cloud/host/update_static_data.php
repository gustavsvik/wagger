<?php


include_once("../Log.php");
include_once("../StaticRecordsApi.php");
include_once("../StaticRecordsSql.php");

//$log = new Log();
$sql = new StaticRecordsSql();
$api = new StaticRecordsApi();

$host_hardware_id = $api::get_host_hardware_id();
$host_text_id = $api::get_host_text_id();
$device_hardware_id = $api::get_device_hardware_id();
$device_text_id = $api::get_device_text_id();
$device_address = $api::get_device_address();
$device_status = $api::get_device_status();
$device_time = $api::get_device_time();
$module_hardware_id = $api::get_module_hardware_id();
$module_text_id = $api::get_module_text_id();
$module_address = $api::get_module_address();
$common_address = $api::get_common_address();
$common_description = $api::get_common_description();

Log::debug('$common_description: ', $common_description);
Log::debug('$device_hardware_id: ', $device_hardware_id);
Log::debug('$device_status: ', $device_status);
Log::debug('$device_time: ', $device_time);

$host_unique_index = NULL; // Unspecified index, requires auto-incremented database table
$new_host_index = $sql::update_static_by_index(table_label: "HOST", unique_index: $host_unique_index, hardware_id: $host_hardware_id, text_id: $host_text_id, address: $common_address, description: $common_description);

$device_unique_index = NULL; // Unspecified index, requires auto-incremented database table
$new_device_index = $sql::update_static_by_index(table_label: "DEVICE", unique_index: $device_unique_index, hardware_id: $device_hardware_id, text_id: $device_text_id, address: $device_address, description: $common_description, status: $device_status, time: $device_time);
if ($new_device_index > -1) $sql::update_single_by_index("DEVICE", $new_device_index, "HOST_INDEX", $new_host_index);

$module_unique_index = NULL; // Unspecified index, requires auto-incremented database table
$new_module_index = $sql::update_static_by_index("MODULE", $module_unique_index, $module_hardware_id, $module_text_id, $module_address, $common_description);
if ($new_module_index > -1) $sql::update_single_by_index("MODULE", $new_module_index, "DEVICE_INDEX", $new_device_index);
