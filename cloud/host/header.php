<?php

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
$device_hardware_id = NULL;
$device_text_id = NULL;
$module_hardware_id = NULL;
$module_text_id = NULL;
$channel_hardware_id = NULL;
$channel_text_id = NULL;
$common_address = NULL;
$common_description = NULL;

$request_string = strval(getPost('channelrange', '-1;;'));
$return_string = strval(getPost('returnstring', ';,,,;'));
$duration = intval(getPost('duration', 10));
$unit = intval(getPost('unit', 1));
$lowest_status = intval(getPost('lowest_status', -1));
$delete_horizon = intval(getPost('delete_horizon', PHP_INT_MAX));
$unique_index = intval(getPost('unique_index', 0));

$host_hardware_id = strval(getPost('host_hardware_id', NULL));
$host_text_id = strval(getPost('host_text_id', NULL));
$device_hardware_id = strval(getPost('device_hardware_id', NULL));
$device_text_id = strval(getPost('device_text_id', NULL));
$module_hardware_id = strval(getPost('module_hardware_id', NULL));
$module_text_id = strval(getPost('module_text_id', NULL));
$channel_hardware_id = strval(getPost('channel_hardware_id', NULL));
$channel_text_id = strval(getPost('channel_text_id', NULL));
$common_address = strval(getPost('common_address', NULL));
$common_description = strval(getPost('common_description', NULL));

