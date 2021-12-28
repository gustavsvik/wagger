<?php


include_once("../GetSafe.php");


$ACCESSIBLE_CHANNELS = array_merge( range(17,32), range(97,112), [140,143,144,145,146,147,160,162,163,180,200,202,220], range(600,603), range(61010,61012), [168,169,170,171,148,172,173,152,153], [2000,2001,2002,2003], [99999] ) ;
$UNRESTRICTED_CHANNELS_FROM = 20000;
$CLEAR_REQUESTED_CHANNELS = array_merge( range(17,32), range(97,112), [140,160,180,200,220], range(600,603), range(2000,2003) ) ;
$ARMORED_BYTE_STRING_CHANNELS = array_merge( [1], range(144,145), [150,151,162,163,170,171,148,172,173,152,153], [99999] ) ;
$MAX_FILES_PER_CHANNEL = 20 ;
$WRITE_IMAGE_FILES = FALSE;
$WRITE_VALUE_FILES = FALSE;


$latest_point_time = NULL;
$points_range = NULL;
$points_range_string = NULL;

$channels= NULL;
$start_time = NULL;
$end_time = NULL;
$duration = NULL;
$unit = NULL;
$value = NULL;
$delete_horizon = NULL;
$lowest_status = NULL;

$sql_like_condition = NULL;

$host_hardware_id = NULL;
$host_text_id = NULL;
$device_hardware_id = NULL;
$device_text_id = NULL;
$module_hardware_id = NULL;
$module_text_id = NULL;
$module_address = NULL;
$channel_hardware_id = NULL;
$channel_text_id = NULL;
$common_address = NULL;
$common_description = NULL;

$screen_layout_file= NULL;


$channels = strval(GetSafe::post('channels', ";"));
$start_time = intval(GetSafe::post('start_time', -9999));
$end_time = intval(GetSafe::post('end_time', -9999));
$duration = intval(GetSafe::post('duration', 10));
$unit = intval(GetSafe::post('unit', 1));
$value = floatval(GetSafe::post('value', -9999.0));
$delete_horizon = intval(GetSafe::post('delete_horizon', 360000));
$lowest_status = intval(GetSafe::post('lowest_status', -1));

$web_api_channel = intval(GetSafe::get('web_api_channel', 0));
$web_api_table_label = strval(GetSafe::get('web_api_table_label', 'device'));

$channel_start = 0;
$data_end = strlen($channels);

$sql_like_condition = strval(GetSafe::post('sql_like_condition', NULL));

$host_hardware_id = strval(GetSafe::post('host_hardware_id', NULL));
$host_text_id = strval(GetSafe::post('host_text_id', NULL));
$device_hardware_id = strval(GetSafe::post('device_hardware_id', NULL));
$device_text_id = strval(GetSafe::post('device_text_id', NULL));
$module_hardware_id = strval(GetSafe::post('module_hardware_id', NULL));
$module_text_id = strval(GetSafe::post('module_text_id', NULL));
$module_address = strval(GetSafe::post('module_address', NULL));
$channel_hardware_id = strval(GetSafe::post('channel_hardware_id', NULL));
$channel_text_id = strval(GetSafe::post('channel_text_id', NULL));
$common_address = strval(GetSafe::post('common_address', NULL));
$common_description = strval(GetSafe::post('common_description', NULL));

$screen_layout_file = strval(GetSafe::get('screen_layout_file', 'screens.json'));

