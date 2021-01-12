<?php

$MAX_FILES_PER_CHANNEL = 20 ;
$WRITE_IMAGE_FILES = TRUE;
$WRITE_VALUE_FILES = FALSE;

$request_string = NULL;
$return_string = NULL;
$duration = NULL;
$unit = NULL;
$lowest_status = NULL;

$request_string = strval(getPost('channelrange', '-1;;'));
$return_string = strval(getPost('returnstring', ';,,,;'));
$duration = intval(getPost('duration', 10));
$unit = intval(getPost('unit', 1));
$lowest_status = intval(getPost('lowest_status', -1));
$delete_horizon = intval(getPost('delete_horizon', PHP_INT_MAX));
