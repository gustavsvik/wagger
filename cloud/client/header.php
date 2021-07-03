<?php


$ACCESSIBLE_CHANNELS = array_merge( range(17,32), range(97,112), [140,143,144,145,146,147,160,162,163,180,202], range(600,602), range(61010,61012), [168,169,170,171,148,172,173], [2000,2001,2002,2003] ) ; 
$CLEAR_REQUESTED_CHANNELS = array_merge( range(17,32), range(97,112), [140,160,180], range(600,602), range(2000,2003) ) ; 
$ARMORED_BYTE_STRING_CHANNELS = array_merge( [1], range(144,145), [150,151,162,163,170,171,148,172,173] ) ; 
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
