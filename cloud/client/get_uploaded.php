<?php


include("../header.php");
include("../db_ini.php");
include("../utils.php");
include("../database.php");
include("header.php");
include_once("../Log.php");
include_once("../ClientAcquiredRecordsApi.php");


Log::debug('$DBNAME: ', $DBNAME);


$api = new ClientAcquiredRecordsApi();

$channel_array = $api::get_channel_array();
//if ($web_api_channel > 0) $channels = strval($web_api_channel) . ';' ;


$select_all = FALSE;
if ($duration <= -9999) $select_all = TRUE;


if ($data_end > 0)
{
/*
  $conn = mysqli_init();
  if (!$conn) die('mysqli_init failed');
  if (!$conn->options(MYSQLI_OPT_CONNECT_TIMEOUT, 5)) die('Setting MYSQLI_OPT_CONNECT_TIMEOUT failed');
  if (!$conn->real_connect($SERVERNAME, $USERNAME, $PASSWORD, $DBNAME)) die('Connect Error (' . mysqli_connect_errno() . ') ' . mysqli_connect_error());
*/
  $conn = db_get_connection($SERVERNAME, $USERNAME, $PASSWORD, $DBNAME);

  $conn->autocommit(FALSE);

  $return_string = "";
  $base64_string = "";

  Log::debug('$channels: ' . $channels);

  $channel_end = strpos($channels, ';', $channel_start);
  Log::debug('$channel_end: ' . $channel_end);
  $channel_string = mb_substr($channels, $channel_start, $channel_end-$channel_start);

  //$valid_channel_data = is_numeric($channel_string);

  while ($channel_start < $data_end)
  {
    $channel_end = strpos($channels, ';', $channel_start);
    Log::debug('$channel_end: ' . $channel_end);
    $channel_string = mb_substr($channels, $channel_start, $channel_end-$channel_start);
    //$valid_channel_data = is_numeric($channel_string);
    $channel = intval($channel_string);
    Log::debug('$channel_string: ' . $channel_string);
    $found_archived_records = FALSE ;
    $archived_record_files = [] ;
    Log::debug('$start_time: ' . $start_time);
    Log::debug('$end_time: ' . $end_time);

    if ($start_time <= -9999)
    {
      if ($end_time <= -9999)
      {
        $sql_latest_available = "SELECT MAX(AD.ACQUIRED_TIME) FROM " . $ACQUIRED_DATA_TABLE_NAME . " AD WHERE AD.CHANNEL_INDEX = " . $channel_string;
        $sql_latest_available .= " AND AD.STATUS>=" . strval($lowest_status);
        Log::debug('$sql_latest_available: ' . $sql_latest_available);
        $latest_available = $conn->query($sql_latest_available);
        if (!is_null($latest_available) && $latest_available->num_rows > 0)
        {
          if ($latest_row = $latest_available->fetch_array(MYSQLI_NUM))
          {
            if (!is_null($latest_row[0])) $latest_point_time = intval($latest_row[0]);
          }
        }
        else
        {
        }
        Log::debug('$end_time: ' . $end_time);
        Log::debug('gettype($latest_point_time): ' . gettype($latest_point_time));
        if (!is_null($latest_point_time)) $end_time = $latest_point_time;
        Log::debug('$end_time: ' . $end_time);
      }
      $start_time = $end_time ;
      if (!$select_all) $start_time -= $duration*$unit;
    }
    $points_range = range($start_time, $end_time, $unit);

    $points_range_string = "(" . get_separated_string_range_string($points_range, ",") . ")";

    //foreach ($points_range as $point)
    //{
    //  $points_range_string .= "'" . strval($point) . "'";
    //  if ($point < $end_time) $points_range_string .= ",";
    //}
    //$points_range_string .= ")";

    $return_string .= $channel_string . ";";

    $sql_get_all_available_values = "SELECT AD.ACQUIRED_TIME,AD.ACQUIRED_VALUE,AD.ACQUIRED_TEXT,AD.ACQUIRED_BYTES FROM " . $ACQUIRED_DATA_TABLE_NAME . " AD WHERE AD.CHANNEL_INDEX=" . $channel_string ;
    $sql_get_available_values = $sql_get_all_available_values ;
    if (!$select_all) $sql_get_available_values .= " AND AD.ACQUIRED_TIME IN " . $points_range_string ;
    $sql_get_available_values .= " AND AD.STATUS >= " . strval($lowest_status) . " AND AD.STATUS < " . strval($STATUS_STORED) ;
    Log::debug('$sql_get_available_values: ' . $sql_get_available_values);
    $available_values = $conn->query($sql_get_available_values);

	if ($available_values)
	{
      if ($available_values->num_rows <= 0)
      {
        $sql_get_stored_archived_values = $sql_get_all_available_values . " AND AD.STATUS >= " . strval($STATUS_STORED) ;
        $available_values = $conn->query($sql_get_stored_archived_values);
        if ($available_values->num_rows > 0) $found_archived_records = TRUE ;
      }
      if ($available_values->num_rows > 0)
      {
        while ($value_row = $available_values->fetch_array(MYSQLI_NUM))
        {
          $time_string = "";
          if (!is_null($value_row[0])) $time_string = strval($value_row[0]);
          $value_string = "";
          if (!is_null($value_row[1])) $value_string = strval($value_row[1]);
          $subsample_string = "";
          if (!is_null($value_row[2])) $subsample_string = strval($value_row[2]);
          $base64_string = "";
          if (!is_null($value_row[3])) $base64_string = strval($value_row[3]);
          $return_string .= $time_string . "," . $value_string . "," . $subsample_string . "," ;
          if (strlen($base64_string) > 0)
          {
            if (in_array($channel, $ARMORED_BYTE_STRING_CHANNELS, TRUE))
            {
              $base64_string = str_replace(",", "|", $base64_string) ;
              $base64_string = str_replace(";", "~", $base64_string) ;
              $return_string .= $base64_string ;
            }
          }

          $return_string .= "," ;

          if (strlen($base64_string) > 0)
          {
            $image_filename = $IMAGE_DIR . "/" . $channel_string . "_" . $time_string . ".jpg";
            if ($found_archived_records) $archived_record_files[] = $image_filename ;
            if ($WRITE_IMAGE_FILES == TRUE)
            {
              $ifp = fopen($image_filename, 'wb');
              fwrite($ifp, base64_decode($base64_string) );
              fclose($ifp);
              copy($image_filename, $IMAGE_DIR . "/" . $channel_string . ".jpg");
            }
          }
          if ($value_string !== "-9999")
          {
            $text_filename = $IMAGE_DIR . "/" . $channel_string . "_" . $time_string . ".txt";
            if ($found_archived_records) $archived_record_files[] = $text_filename ;
            if ($WRITE_VALUE_FILES == TRUE)
            {
              $ifp = fopen($text_filename, 'wb');
              fwrite($ifp, $return_string );
              fclose($ifp);
              copy($text_filename, $IMAGE_DIR . "/" . $channel_string . ".txt");
            }
          }
        }
      }
    }
    else
    {
    }

    $return_string .= ";";
    Log::debug('$return_string: ' . mb_substr($return_string, 0, 100));

    $channel_start = $channel_end+1;

    $file_pattern = $IMAGE_DIR . "/" . $channel_string . "_*";
    $files = glob($file_pattern);
    $num_files = count($files);
    foreach($files as $file)
    {
      $complete_filename = $file ;
      if ( is_file($complete_filename) && $num_files > $MAX_FILES_PER_CHANNEL && $channel < $UNRESTRICTED_CHANNELS_FROM && !in_array($complete_filename, $archived_record_files) )
      {
        unlink($complete_filename);
        --$num_files;
      }
    }
  }

  $conn->close();

}


header("Content-type: application/json");
$json_array = array('returnstring' => $return_string) ; //, 'receivetime' => $receive_timestamp, 'transmittime' => $transmit_timestamp);
echo json_encode($json_array);

Log::debug('$return_string' . $return_string);

