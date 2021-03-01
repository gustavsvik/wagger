<?php


function debug_log($log_str)
{
  $logged_scripts = []; // 'get_uploaded.php', 'server_time.php', 'network_time.php'
  $logfile = 'images/debug.log';
  $trace = debug_backtrace();
  $caller = array_shift($trace);
  foreach($logged_scripts as $script_name) 
  {
    if (strpos($caller['file'], $script_name) !== FALSE) error_log(gmdate('YmdHis') . ' ' . $caller['file'] . ', line ' . $caller['line'] . ': ' . $log_str . PHP_EOL, 3, $logfile) ;
  }
}


function getPost($key, $default)
{
  if (isset($_POST[$key]))
    return $_POST[$key];
  return $default;
}


function getGet($key, $default)
{
  if (isset($_GET[$key]))
    return $_GET[$key];
  return $default;
}


function csvstr(array $fields) : string
{
  $f = fopen('php://memory', 'r+');
  if (fputcsv($f, $fields) === false) 
  {
      return false;
  }
  rewind($f);
  $csv_line = stream_get_contents($f);
  return rtrim($csv_line);
}


function getListByIDs($request_string)
{
  $data_start = 0;
  $data_end = strlen($request_string);
  $channel_start = $data_start;
  $channels_list = "";
  while ($channel_start < $data_end)
  {
    if ($channel_start>0) $channels_list .= ",";
    $channel_end = strpos($request_string, ';', $channel_start);
    $channel_string = mb_substr($request_string, $channel_start, $channel_end-$channel_start);
    $channel = intval($channel_string);
    $points_start = $channel_end+1;
    $points_end = strpos($request_string, ';', $points_start);
    $points_string = mb_substr($request_string, $points_start, $points_end-$points_start);
    while ($points_start < $points_end)
    {
      $timestamp_start = $points_start;
      $timestamp_end = strpos($request_string, ",", $timestamp_start);
      $timestamp_string = mb_substr($request_string, $timestamp_start, $timestamp_end-$timestamp_start);
      $timestamp = intval($timestamp_string);
      $value_start = $timestamp_end+1;
      $value_end = strpos($request_string, ",", $value_start);
      $value_string = mb_substr($request_string, $value_start, $value_end-$value_start);
      $value = doubleval($value_string);
      $subsamples_start = $value_end+1;
      $subsamples_end = strpos($request_string, ",", $subsamples_start);
      $subsamples_string = mb_substr($request_string, $subsamples_start, $subsamples_end-$subsamples_start);
      $base64_start = $subsamples_end+1;
      $base64_end = strpos($request_string, ",", $base64_start);
      $base64_string = mb_substr($request_string, $base64_start, $base64_end-$base64_start);
      $points_start = $base64_end+1;
    }
    $channel_start = $points_end+1;
    $channels_list .= $channel_string;
  }
  
  return $channels_list;
}


function getStringBetween($string, $start, $end)
{
	$string = " ".$string;
	$ini = strpos($string,$start);
	if ($ini == 0) return "";
	$ini += strlen($start);   
	$len = strpos($string,$end,$ini) - $ini;
	return substr($string,$ini,$len);
}
