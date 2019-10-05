<?php


function getPost($key, $default) 
{
  if (isset($_POST[$key]))
    return $_POST[$key];
  return $default;
}

$request_string = NULL;
$return_string = NULL;
$duration = NULL;
$unit = NULL;

$request_string = strval(getPost('channelrange', '-1;;'));
$return_string = strval(getPost('returnstring', ';,,,;'));
$duration = intval(getPost('duration', 10));
$unit = intval(getPost('unit', 1));


?>
