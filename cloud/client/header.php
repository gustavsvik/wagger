<?php


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
$delete_horizon = intval(getPost('delete_horizon', 3600));
$lowest_status = intval(getPost('lowest_status', -1));

$channel_start = 0;
$data_end = strlen($channels);


?>
