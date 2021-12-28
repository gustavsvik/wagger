<?php


include("header.php");


//$screen_layout_file= NULL;
//$screen_layout_file = strval(getGet('screen_layout_file', 'screens.json'));

$str = file_get_contents(__DIR__ . '/' . $screen_layout_file);

header('Content-type: application/json');

echo $str;
