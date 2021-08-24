<?php


include("../header.php");
include("../db_ini.php");
include("../utils.php");
include("../database.php");
include("header.php");

/*
$conn = mysqli_init();
if (!$conn) die('mysqli_init failed');
if (!$conn->options(MYSQLI_OPT_CONNECT_TIMEOUT, 5)) die('Setting MYSQLI_OPT_CONNECT_TIMEOUT failed');
if (!$conn->real_connect($SERVERNAME, $USERNAME, $PASSWORD, $DBNAME)) die('Connect Error (' . mysqli_connect_errno() . ') ' . mysqli_connect_error());
*/
$conn = db_get_connection($SERVERNAME, $USERNAME, $PASSWORD, $DBNAME);

debug_log('$return_string: ' . mb_substr($return_string, 0, 100));

$conn->autocommit(FALSE);

$file_channels = [] ;

$conn->begin_transaction();

$data_start = 0;
$data_end = strlen($return_string);
$channel_start = $data_start;

$channel_end = strpos($return_string, ';', $channel_start);
$channel_string = mb_substr($return_string, $channel_start, $channel_end-$channel_start);
$valid_channel_data = FALSE;
if (is_numeric($channel_string)) $valid_channel_data = TRUE;

while ($valid_channel_data && $channel_start < $data_end)
{
  $channel_end = strpos($return_string, ';', $channel_start);
  debug_log( '$channel_start: ' . strval($channel_start) . ' $channel_end: ' . strval($channel_end));
  $channel_string = mb_substr($return_string, $channel_start, $channel_end-$channel_start);
  $channel = intval($channel_string);

  $points_start = $channel_end+1;
  $points_end = strpos($return_string, ';', $points_start);
  $points_string = mb_substr($return_string, $points_start, $points_end-$points_start);

  while ($points_start < $points_end)
  {
    $timestamp_start = $points_start;
    $timestamp_end = strpos($return_string, ",", $timestamp_start);
    $timestamp_string = mb_substr($return_string, $timestamp_start, $timestamp_end-$timestamp_start);
    $timestamp = intval($timestamp_string);
    $value_start = $timestamp_end+1;
    $value_end = strpos($return_string, ",", $value_start);
    $value_string = mb_substr($return_string, $value_start, $value_end-$value_start);
    $value = doubleval($value_string);
    $subsamples_start = $value_end+1;
    $subsamples_end = strpos($return_string, ",", $subsamples_start);
    $subsamples_string = mb_substr($return_string, $subsamples_start, $subsamples_end-$subsamples_start);
    $base64_start = $subsamples_end+1;
    $base64_end = strpos($return_string, ",", $base64_start);
    $base64_string = mb_substr($return_string, $base64_start, $base64_end-$base64_start);
    if (strlen($base64_string) > 0)
    {
      $base64_string = str_replace("|", ",", $base64_string) ;
      $base64_string = str_replace("~", ";", $base64_string) ;
    }

    if (strlen($base64_string) > 0)
    {
      if ($WRITE_IMAGE_FILES == TRUE)
      {
        $top_base64_bytes = mb_substr($base64_string, 0, 100);
        debug_log('$top_base64_bytes: ' . $top_base64_bytes);
        $image_bytes = base64_decode($base64_string);
        $image_filetype = get_image_mime_type($image_bytes);
        if (!is_null($image_filetype))
        {
        if(!in_array($channel, $file_channels)) $file_channels[] = $channel ;
        $image_filename = $IMAGE_DIR . "/" . $channel_string . "_" . $timestamp_string . '.' . $image_filetype;
        debug_log('$image_filename: ' . $image_filename);
        $ifp = fopen($image_filename, 'wb'); 
        fwrite($ifp, $image_bytes );
        fclose($ifp);
        copy($image_filename, $IMAGE_DIR . "/" . $channel_string . '.' . $image_filetype);
        }
      }
    }
    if ($value_string !== "-9999")
    {
      if ($WRITE_VALUE_FILES == TRUE)
      {
        if(!in_array($channel, $file_channels)) $file_channels[] = $channel ;
        $text_filename = $IMAGE_DIR . "/" . $channel_string . "_" . $timestamp_string . ".txt";
        $ifp = fopen($text_filename, 'wb'); 
        fwrite($ifp, $return_string );
        fclose($ifp);
        copy($text_filename, $IMAGE_DIR . "/" . $channel_string . ".txt");
      }
    }
    debug_log('$timestamp: ' . strval($timestamp) . ' $channel: ' . strval($channel) . ' $base64_string: ' . mb_substr($base64_string, 0, 100));
    $stmt = $conn->prepare("UPDATE " . $ACQUIRED_DATA_TABLE_NAME . " SET ACQUIRED_VALUE = ?, ACQUIRED_TEXT = ?, ACQUIRED_BYTES = ?, STATUS = " . strval($STATUS_FULFILLED) . " WHERE CHANNEL_INDEX = ? AND ACQUIRED_TIME = ? AND STATUS = " . strval($STATUS_REQUESTED));
    $stmt->bind_param('sssss', $value, $subsamples_string, $base64_string, $channel, $timestamp);
    if(!$stmt->execute())
    {
      $conn->rollback();
      die();
    }
    $stmt->close();
    $points_start = $base64_end+1;
  }

  $channel_start = $points_end+1;
}

$conn->commit();


foreach ($file_channels as $file_channel)
{
  $file_channel_string = strval($file_channel) ;
  $sql_get_all_available_values = "SELECT DISTINCT AD.ACQUIRED_TIME FROM " . $ACQUIRED_DATA_TABLE_NAME . " AD WHERE AD.CHANNEL_INDEX =" . $file_channel_string ;
  $sql_get_stored_archived_values = $sql_get_all_available_values . " AND AD.STATUS >= " . strval($STATUS_STORED) ;

  $stored_archived_values = $conn->query($sql_get_stored_archived_values) ;

  $stored_archived_timestamps = [] ;
  if ($stored_archived_values->num_rows > 0) 
  {
    while ($value_row = $stored_archived_values->fetch_array(MYSQLI_NUM)) 
    {
      if (!is_null($value_row[0])) $stored_archived_timestamps[] = strval($value_row[0]) ;
    }
  }

  $file_pattern = $IMAGE_DIR . "/" . $channel_string . "_*" ;
  $files = glob($file_pattern) ;
  $num_files = count($files) ;
  foreach($files as $complete_filename)
  {
    $filename = basename($complete_filename) ;
    $file_timestamp_string = getStringBetween($filename, "_", ".") ;
    if ( is_file($complete_filename) && $num_files > $MAX_FILES_PER_CHANNEL && !in_array($file_timestamp_string, $stored_archived_timestamps) ) 
    {
      unlink($complete_filename) ;
      --$num_files ;
    }
  }
}


$conn->close();
