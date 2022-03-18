<?php


//include_once("../header.php");
//include_once("../db_ini.php");
include_once("../Log.php");
include_once("../CheckIf.php");
include_once("../GetSafe.php");
include_once("../Transform.php");
//include_once("../utils.php");
//include_once("../database.php");
include_once("../AcquiredRecordsSql.php");
include_once("../ClientAcquiredRecordsApi.php");

//include_once("header.php");

//$channels = "148;";

$api = new ClientAcquiredRecordsApi();

$channel_array = $api::get_channel_array();

$api::set_duration(900);
$lowest_status = 0 ;

//$duration = 900 ;
//$unit = 1 ;

/*
$channel_array = array();
$channel_temp_array = explode(";", $channels);
foreach ($channel_temp_array as $channel)
{
  if (is_numeric($channel)) $channel_array[] = $channel ;
}
*/

$sql = new AcquiredRecordsSql();
$latest_stored_update_time = $sql->get_latest_channel_update_time($channel_array, $lowest_status); // time(); //db_get_max_value($conn, $table_name_string, $column_name_string);

$api::update_time_horizon($latest_stored_update_time);

$start_time = $api::get_start_time();
$end_time = $api::get_end_time();


/*
$select_all = FALSE;
if ($duration === -9999) $select_all = TRUE;

if ($start_time === -9999)
{
  if ($end_time === -9999)
  {
    $latest_point_time = $latest_channel_update_time; // time(); //db_get_max_value($conn, $table_name_string, $column_name_string);
    if (!is_null($latest_point_time)) $end_time = $latest_point_time;
  }
  $start_time = $end_time ;
  if (!$select_all) $start_time -= $duration*$unit;
}
*/

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
    Log::debug('json_last_error_msg(): ', json_last_error_msg());
    if (CheckIf::is_iterable($bytes_string_json_array)) //(is_array($bytes_string_json_array) || $bytes_string_json_array instanceof Traversable)
    {
      foreach ($bytes_string_json_array as $bytes_string_json)
      {
        $message_json = $bytes_string_json[3];
        $reduced_json_string = "";
        if ( is_numeric(GetSafe::by_key($message_json, "lon")) && is_numeric(GetSafe::by_key($message_json, "lat")) )
        {
          $reduced_json_string = json_encode( array( "type" => GetSafe::by_key($message_json, "type"), "mmsi" => GetSafe::by_key($message_json, "mmsi"), "lon" => GetSafe::by_key($message_json, "lon"), "lat" => GetSafe::by_key($message_json, "lat")) );
        }
        if (strlen($reduced_json_string) > 0) $all_bytes_string .= $reduced_json_string . ',' ;
      }
      $acquired_string .= Transform::armored_from_separated_string( substr( $all_bytes_string, 0, -1 ) . "]" );
    }
    $acquired_string .= "," ;
  }
  $acquired_string .= ";";
}

$sql->close();

/*
$conn = db_get_connection($SERVERNAME, $USERNAME, $PASSWORD, $DBNAME);
$conn->autocommit(FALSE);
$return_string = "";
foreach ($channel_array as $channel)
{
  debug_log('$channel: ', $channel);
  $channel_string = strval($channel);
  $return_string .= $channel_string . ";";
  $sql_get_all_available_values = "SELECT T.ACQUIRED_TIME,T.ACQUIRED_BYTES FROM t_acquired_data T";
  $sql_get_available_values = $sql_get_all_available_values . " WHERE ";
  if (!$select_all) $sql_get_available_values .= "T.CHANNEL_INDEX=" . $channel_string . " AND T.ACQUIRED_TIME BETWEEN " . strval($start_time) . " AND ". strval($end_time) . " AND ";
  $sql_get_available_values .= "T.STATUS >= " . strval($lowest_status) . " AND T.STATUS < " . strval($STATUS_STORED) . " ORDER BY T.ACQUIRED_TIME DESC";
  debug_log('$sql_get_available_values: ', $sql_get_available_values);
  $available_values = $conn->query($sql_get_available_values);
  if (is_object($available_values) && $available_values->num_rows <= 0)
  {
    $sql_get_stored_archived_values = $sql_get_all_available_values . " WHERE T.STATUS >= " . strval($STATUS_STORED) . " ORDER BY T.ACQUIRED_TIME DESC";
    debug_log('$sql_get_stored_archived_values: ', $sql_get_stored_archived_values);
    $available_values = $conn->query($sql_get_stored_archived_values);
  }
  if (is_object($available_values) && $available_values->num_rows > 0)
  {
      while ($value_row = $available_values->fetch_array(MYSQLI_NUM))
      {
        debug_log('$value_row: ', $value_row);
        $time_string = "";
        if (!is_null($value_row[0])) $time_string = strval($value_row[0]);
        $return_string .= $time_string . ",,," ;
        $all_bytes_string = "[";
        $bytes_string_json = "";
        if (!is_null($value_row[1])) $bytes_string_json = strval($value_row[1]);
        debug_log('$bytes_string_json: ', $bytes_string_json);
        $bytes_string_json_array = json_decode($bytes_string_json, true);
        debug_log('json_last_error_msg(): ', json_last_error_msg());
        if (CheckIf::is_iterable($bytes_string_json_array)) //(is_array($bytes_string_json_array) || $bytes_string_json_array instanceof Traversable)
        {
          foreach ($bytes_string_json_array as $bytes_string_json)
          {
            $ais_message_json = $bytes_string_json[3];
            $lon = GetSafe::by_key($ais_message_json, "lon");
            $lat = GetSafe::by_key($ais_message_json, "lat");
            $bytes_string = "";
            if ( is_numeric($lon) && is_numeric($lat) )
            {
              $bytes_string = json_encode( array( "type" => GetSafe::by_key($ais_message_json, "type"), "mmsi" => GetSafe::by_key($ais_message_json, "mmsi"), "lon" => $lon, "lat" => $lat) );
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
*/

header("Content-type: application/json");
$json_array = array('returnstring' => $acquired_string) ; //, 'receivetime' => $receive_timestamp, 'transmittime' => $transmit_timestamp);
echo json_encode($json_array);
