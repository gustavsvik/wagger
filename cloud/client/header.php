<?php


$ACCESSIBLE_CHANNELS = array_merge( range(17,32), range(97,112), [140,143,144,145,146,147,160,162,163,180,202], range(600,602), range(61010,61012), [168,169,170,171,148,172,173,152], [2000,2001,2002,2003], [99999] ) ; 
$ACCESSIBLE_CHANNELS_FROM = 20000;
$CLEAR_REQUESTED_CHANNELS = array_merge( range(17,32), range(97,112), [140,160,180], range(600,602), range(2000,2003) ) ; 
$ARMORED_BYTE_STRING_CHANNELS = array_merge( [1], range(144,145), [150,151,162,163,170,171,148,172,173,152], [99999] ) ; 
$MAX_FILES_PER_CHANNEL = 20 ;
$WRITE_IMAGE_FILES = FALSE;
$WRITE_VALUE_FILES = FALSE;


$channels= NULL;
$start_time = NULL;
$end_time = NULL;
$duration = NULL;
$unit = NULL;
$value = NULL;
$delete_horizon = NULL;
$lowest_status = NULL;

$latest_point_time = NULL;
$points_range = NULL;
$points_range_string = NULL;

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

$channels = strval(getPost('channels', ";"));
$start_time = intval(getPost('start_time', -9999));
$end_time = intval(getPost('end_time', -9999));
$duration = intval(getPost('duration', 10));
$unit = intval(getPost('unit', 1));
$value = floatval(getPost('value', -9999.0));
$delete_horizon = intval(getPost('delete_horizon', 360000));
$lowest_status = intval(getPost('lowest_status', -1));

$web_api_channel = intval(getGet('web_api_channel', 0));
$web_api_table_label = strval(getGet('web_api_table_label', 'device'));

$channel_start = 0;
$data_end = strlen($channels);

$host_hardware_id = strval(getPost('host_hardware_id', NULL));
$host_text_id = strval(getPost('host_text_id', NULL));
$device_hardware_id = strval(getPost('device_hardware_id', NULL));
$device_text_id = strval(getPost('device_text_id', NULL));
$module_hardware_id = strval(getPost('module_hardware_id', NULL));
$module_text_id = strval(getPost('module_text_id', NULL));
$module_address = strval(getPost('module_address', NULL));
$channel_hardware_id = strval(getPost('channel_hardware_id', NULL));
$channel_text_id = strval(getPost('channel_text_id', NULL));
$common_address = strval(getPost('common_address', NULL));
$common_description = strval(getPost('common_description', NULL));

