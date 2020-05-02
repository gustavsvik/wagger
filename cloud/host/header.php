<?php


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


?>
