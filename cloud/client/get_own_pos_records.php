<?php


include_once("../Log.php");
include_once("../CheckIf.php");
include_once("../GetSafe.php");
include_once("../Transform.php");
include_once("../AcquiredRecordsSql.php");
include_once("../ClientAcquiredRecordsApi.php");

$api = new ClientAcquiredRecordsApi();

$channel_array = $api::get_channel_array();

$lowest_status = 0 ;

$sql = new AcquiredRecordsSql();
$latest_stored_update_time = time(); //$sql->get_latest_channel_update_time($channel_array, $lowest_status); // time(); //db_get_max_value($conn, $table_name_string, $column_name_string);

$api::update_time_horizon($latest_stored_update_time);

$start_time = $api::get_start_time();
$end_time = $api::get_end_time();

$acquired_records = $sql->get_by_channels_time_range_status_range(['ACQUIRED_TIME','ACQUIRED_BYTES'], $channel_array, $start_time, $end_time, $lowest_status);

Log::debug('$acquired_records: ', $acquired_records);
$acquired_string = "";
foreach ($acquired_records as $channel_data_array)
{
  $channel_string = Transform::to_string( ( GetSafe::by_key($channel_data_array, 0) ) );
  $acquired_string .= $channel_string . ";";
  $data_array = GetSafe::by_key($channel_data_array, 1);
  foreach ($data_array as $record_row)
  {
    $time_string = Transform::to_string( ( GetSafe::by_key($record_row, 'ACQUIRED_TIME') ) );
    $bytes_string = Transform::to_string( ( GetSafe::by_key($record_row, 'ACQUIRED_BYTES') ) );
    $acquired_string .= $time_string . ",,," ;
    $all_bytes_string = "[";
    $bytes_string_json_array = json_decode($bytes_string, true);
    if (CheckIf::is_iterable($bytes_string_json_array)) //(is_array($bytes_string_json_array) || $bytes_string_json_array instanceof Traversable)
    {
      foreach ($bytes_string_json_array as $bytes_string_json)
      {
        $message_json = $bytes_string_json[3];
        $lon = number_format( (float)GetSafe::by_key($message_json, "lon"), 5, '.', '' );
        $lat = number_format( (float)GetSafe::by_key($message_json, "lat"), 5, '.', '' );
        $speed = number_format( (float)GetSafe::by_key($message_json, "speed"), 1, '.', '' );
        $heading = number_format( (float)GetSafe::by_key($message_json, "heading"), 1, '.', '' );
        $mmsi = $bytes_string_json[2];

        $reduced_json_string = "";
        if ( is_numeric($lon) && is_numeric($lat) )
        {
          $reduced_json_string = json_encode( array( "type" => 1, "mmsi" => $mmsi, "lon" => $lon, "lat" => $lat, "speed" => $speed, "heading" => $heading  ) );
        }
        if (strlen($reduced_json_string) > 0) $all_bytes_string .= $reduced_json_string . ',' ;
      }
      $acquired_string .= Transform::armored_from_separated_string( substr( $all_bytes_string, 0, -1 ) . "]" );
    }
    $acquired_string .= "," ;
  }
  $acquired_string .= ";";
}
Log::debug('$acquired_string: ', $acquired_string);

$sql->close();

header("Content-type: application/json");
$json_array = array('returnstring' => $acquired_string) ; //, 'receivetime' => $receive_timestamp, 'transmittime' => $transmit_timestamp);
echo json_encode($json_array);


/*
include_once("../header.php");
include_once("../db_ini.php");
include_once("../CheckIf.php");
include_once("../GetSafe.php");
include_once("../utils.php");
include_once("../database.php");
include_once("header.php");

//$channels = "99999;";
debug_log('$channels: ', $channels);
debug_log('$device_hardware_id: ', $device_hardware_id);
debug_log('$duration: ', $duration);
debug_log('$sql_like_condition: ', $sql_like_condition);

$start_time = -9999 ;
$end_time = -9999 ;
//$duration = 300 ;
$unit = 1 ;
$lowest_status = 0 ;

$select_all_in_channel = FALSE;
if ($duration === -9999) $select_all_in_channel = TRUE;

$conn = db_get_connection($SERVERNAME, $USERNAME, $PASSWORD, $DBNAME);
//$conn->autocommit(FALSE);

$return_string = "";

if ($start_time === -9999)
{
  if ($end_time === -9999)
  {
    //$table_name_string = "t_acquired_data";
    //$column_name_string = "ACQUIRED_TIME";
    $latest_point_time = time(); //db_get_max_value($conn, $table_name_string, $column_name_string);
    if (!is_null($latest_point_time)) $end_time = $latest_point_time;
  }
  $start_time = $end_time ;
  if (!$select_all_in_channel) $start_time -= $duration*$unit;
}

$channel_array = array();
$channel_temp_array = explode(";", $channels);
foreach ($channel_temp_array as $channel)
{
  if (is_numeric($channel)) $channel_array[] = $channel ;
}

foreach ($channel_array as $channel)
{
  //$channel_string = "1";
  //$channel = intval($channel_string);
  $channel_string = strval($channel);
  $return_string .= $channel_string . ";";

  $sql_get_all_available_values = "SELECT T.ACQUIRED_TIME,T.ACQUIRED_BYTES FROM t_acquired_data T";
  $sql_get_all_available_values .= " WHERE T.CHANNEL_INDEX=" . $channel_string ;
  $sql_get_available_values = $sql_get_all_available_values . " AND ";
  if (!$select_all_in_channel) $sql_get_available_values .= "T.ACQUIRED_TIME BETWEEN " . strval($start_time) . " AND ". strval($end_time) . " AND ";
  $sql_get_available_values .= "T.STATUS >= " . strval($lowest_status) . " AND T.STATUS < " . strval($STATUS_ARCHIVED) . " ORDER BY T.ACQUIRED_TIME DESC";
  debug_log('$sql_get_available_values: ', $sql_get_available_values);
  $available_values = $conn->query($sql_get_available_values);

    if (is_object($available_values) && $available_values->num_rows <= 0)
    {
      $sql_get_stored_archived_values = $sql_get_all_available_values . " AND T.STATUS >= " . strval($STATUS_ARCHIVED) . " ORDER BY T.ACQUIRED_TIME DESC";
      debug_log('$sql_get_stored_archived_values: ', $sql_get_stored_archived_values);
      $available_values = $conn->query($sql_get_stored_archived_values);
    }
    if (is_object($available_values) && $available_values->num_rows > 0)
    {
      while ($value_row = $available_values->fetch_array(MYSQLI_NUM))
      {
        $time_string = "";
        if (!is_null($value_row[0])) $time_string = strval($value_row[0]);
        $return_string .= $time_string . ",,," ;
        $all_bytes_string = "[";
        if (!is_null($value_row[1])) $bytes_string_json = strval($value_row[1]);
        $bytes_string_json_array = json_decode($bytes_string_json, true);
        if ( CheckIf::is_iterable($bytes_string_json_array) ) //(is_array($bytes_string_json_array) || $bytes_string_json_array instanceof Traversable)
        {
          foreach ($bytes_string_json_array as $bytes_string_json)
          {
            $ais_message_json = $bytes_string_json[3];
            $lon = number_format((float)GetSafe::by_key($ais_message_json, "lon"), 5, '.', '');
            $lat = number_format((float)GetSafe::by_key($ais_message_json, "lat"), 5, '.', '');
            $speed = number_format((float)GetSafe::by_key($ais_message_json, "speed"), 1, '.', '');
            $heading = number_format((float)GetSafe::by_key($ais_message_json, "heading"), 1, '.', '');
            $mmsi = $bytes_string_json[2];
            $bytes_string = "";
            if ( is_numeric($lon) && is_numeric($lat) )
            {
                $bytes_string = json_encode( array( "type" => 1, "mmsi" => $mmsi, "lon" => $lon, "lat" => $lat, "speed" => $speed, "heading" => $heading) );
            }
            if (strlen($bytes_string) > 0) $all_bytes_string .= $bytes_string . ',' ;
          }
          $last_comma_pos = strrpos($all_bytes_string, ',');
          $return_string .= ais_armor_string( substr( $all_bytes_string, 0, $last_comma_pos ) . "]" );
        }
        $return_string .= "," ;
      }
    }
    else
    {
    }

    $return_string .= ";";

  }

$conn->close();

debug_log('$return_string: ', $return_string);
header("Content-type: application/json");
$json_array = array('returnstring' => $return_string) ; //, 'receivetime' => $receive_timestamp, 'transmittime' => $transmit_timestamp);
echo json_encode($json_array);
*/
