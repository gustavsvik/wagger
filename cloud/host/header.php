<?php


include_once("../GetSafe.php");


$MAX_FILES_PER_CHANNEL = 20 ;
$WRITE_IMAGE_FILES = TRUE;
$WRITE_VALUE_FILES = FALSE;

$request_string = NULL;
$return_string = NULL;
$duration = NULL;
$unit = NULL;
$lowest_status = NULL;
$delete_horizon = NULL;
$unique_index = NULL;

$host_hardware_id = NULL;
$host_text_id = NULL;
$host_address = NULL;
$device_hardware_id = NULL;
$device_text_id = NULL;
$device_address = NULL;
$module_hardware_id = NULL;
$module_text_id = NULL;
$module_address = NULL;
$channel_hardware_id = NULL;
$channel_text_id = NULL;
$common_address = NULL;
$common_description = NULL;

$parent_table_label = NULL;


$request_string = strval(GetSafe::post('channelrange', '-1;;'));
$return_string = strval(GetSafe::post('returnstring', ';,,,;'));
$duration = intval(GetSafe::post('duration', 10));
$unit = intval(GetSafe::post('unit', 1));
$lowest_status = intval(GetSafe::post('lowest_status', -1));
$delete_horizon = intval(GetSafe::post('delete_horizon', PHP_INT_MAX));
$unique_index = intval(GetSafe::post('unique_index', 0));

$host_hardware_id = strval(GetSafe::post('host_hardware_id', NULL));
$host_text_id = strval(GetSafe::post('host_text_id', NULL));
$host_address = strval(GetSafe::post('host_address', NULL));
$device_hardware_id = strval(GetSafe::post('device_hardware_id', NULL));
$device_text_id = strval(GetSafe::post('device_text_id', NULL));
$device_address = strval(GetSafe::post('device_address', NULL));
$module_hardware_id = strval(GetSafe::post('module_hardware_id', NULL));
$module_text_id = strval(GetSafe::post('module_text_id', NULL));
$module_address = strval(GetSafe::post('module_address', NULL));
$channel_hardware_id = strval(GetSafe::post('channel_hardware_id', NULL));
$channel_text_id = strval(GetSafe::post('channel_text_id', NULL));
$common_address = strval(GetSafe::post('common_address', NULL));
$common_description = strval(GetSafe::post('common_description', NULL));

$parent_table_label = strval(GetSafe::get('parent_table_label', NULL));

