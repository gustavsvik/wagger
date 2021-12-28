<?php

/*
class Check
{

  public static function image_mime_type($imagedata)
  {
    $imagemimetypes = array(
      "jpg" => "FFD8",
      "png" => "89504E470D0A1A0A",
      "gif" => "474946",
      "bmp" => "424D",
      "tiff" => "4949",
      "tiff" => "4D4D",
      "mp4" => "6674797069736F6D",
      "3gp" => "000000186674797033677034"
    );

    foreach ($imagemimetypes as $mime => $hexbytes)
    {
      $bytes = get_bytes_from_hex_string($hexbytes);
      if (substr($imagedata, 0, strlen($bytes)) == $bytes)
        return $mime;
    }

    return NULL;

  }


}
*/
/*
class CheckIf
{

  public static function is_stringy($val)
  {
    return (is_string($val) || is_numeric($val) || (is_object($val) && method_exists($val, '__toString')));
  }


  public static function is_iterable($var)
  {
    return (is_array($var) || $var instanceof Traversable);
  }

}
*/
/*
function safe_get($object, $key)
{
  return !empty($object[$key]) ? $object[$key] : NULL ;
}
*/
/*
function is_stringy($val)
{
  return (is_string($val) || is_numeric($val) || (is_object($val) && method_exists($val, '__toString')));
}


function is_iterable($var)
{
  return (is_array($var) || $var instanceof Traversable);
}
*/

function debug_log($log_label, $log_var = "")
{
  $logged_scripts = [];  // 'partition_database.php', 'get_own_pos_records.php', 'get_requested.php', 'send_request.php', 'set_requested.php', 'database.php', 'get_static_data.php', 'get_static_records_string.php', 'get_ais_data_records.php', 'update_static_data.php', 'update_devices.php', 'get_uploaded.php', 'get_host_data.php', 'server_time.php', 'network_time.php', 'update_static_data_client.php', 'contributed.php'
  if (count($logged_scripts) > 0)
  {
    $logfile = '/srv/wagger/cloud/client/images/debug.log';
    $trace = debug_backtrace();
    $caller = array_shift($trace);
    foreach($logged_scripts as $script_name)
    {
      $log_var_str = "";
      if (is_array($log_var)) $log_var_str = json_encode($log_var);
      elseif (CheckIf::is_stringy($log_var)) $log_var_str = strval($log_var);
      $log_str = strval( (is_null($log_var_str)) ? "NULL" : $log_var_str );
      if (strpos($caller['file'], $script_name) !== FALSE) error_log(gmdate('YmdHis') . ' ' . $caller['file'] . ', line ' . $caller['line'] . ': ' . $log_label . $log_str . PHP_EOL, 3, $logfile) ;
    }
  }
}

/*
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
*/

function get_separated_value_range_string($range_array, $separator)
{
  $range_string = "";
  foreach ($range_array as $point)
  {
    $range_string .= strval($point) . strval($separator);
  }
  return rtrim($range_string, $separator);
}


function get_separated_string_range_string($range_array, $separator)
{
  $range_string = "";
  foreach ($range_array as $point)
  {
    $range_string .= "'" . strval($point) . "'" . strval($separator);
  }
  return rtrim($range_string, $separator);
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


function get_sql_list_from_channel_request_string($channel_string)
{
  $channel_array = [];
  $channel_string_array = explode(";", $channel_string);
  foreach($channel_string_array as $channel_string)
  {
      if (is_numeric($channel_string)) $channel_array[] = intval($channel_string);
  }
  return implode(',', $channel_array);
}

/*
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
*/

function getStringBetween($string, $start, $end)
{
	$string = " ".$string;
	$ini = strpos($string,$start);
	if ($ini == 0) return "";
	$ini += strlen($start);
	$len = strpos($string,$end,$ini) - $ini;
	return substr($string,$ini,$len);
}


function ais_armor_string($ais_string)
{
  $ais_string = str_replace(",", "|", $ais_string) ;
  $ais_string = str_replace(";", "~", $ais_string) ;

  return $ais_string;
}


function http_get_client_id_string($exclude_keys)
{
  $exclude_keys_array = [];
  if (!is_null($exclude_keys)) $exclude_keys_array = $exclude_keys ;
  $client_id_string = "";
  foreach ($_SERVER as $server_key => $server_value)
  {
    if ( !( in_array($server_key, $exclude_keys_array) ) ) $client_id_string .= $server_key . ' ' . $server_value . ' ';
  }
  return $client_id_string;
}


function http_get_client_ip()
{
  $ip = NULL;
  if (!empty($_SERVER['HTTP_CLIENT_IP']))
  {
    $ip = $_SERVER['HTTP_CLIENT_IP'];
  }
  elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))
  {
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
  }
  else
  {
    $ip = $_SERVER['REMOTE_ADDR'];
  }
  return $ip;
}


function get_bytes_from_hex_string($hexdata)
{
  for ($count = 0; $count < strlen($hexdata); $count += 2) $bytes[] = chr(hexdec(substr($hexdata, $count, 2)));
  return implode($bytes);
}

/*
function get_image_mime_type($imagedata)
{
  $imagemimetypes = array(
    "jpg" => "FFD8",
    "png" => "89504E470D0A1A0A",
    "gif" => "474946",
    "bmp" => "424D",
    "tiff" => "4949",
    "tiff" => "4D4D",
    "mp4" => "6674797069736F6D",
    "3gp" => "000000186674797033677034"
  );

  foreach ($imagemimetypes as $mime => $hexbytes)
  {
    $bytes = get_bytes_from_hex_string($hexbytes);
    if (substr($imagedata, 0, strlen($bytes)) == $bytes)
      return $mime;
  }

  return NULL;
}
*/
