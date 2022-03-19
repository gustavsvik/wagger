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
$latest_stored_update_time = $sql->get_latest_channel_update_time($channel_array, $lowest_status); // time(); //db_get_max_value($conn, $table_name_string, $column_name_string);

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
        $type = GetSafe::by_key( $message_json, "type", 1 );
        $mmsi = GetSafe::by_key( $message_json, "mmsi", $bytes_string_json[2] );
        $lon = number_format( (float)GetSafe::by_key($message_json, "lon"), 5, '.', '' );
        $lat = number_format( (float)GetSafe::by_key($message_json, "lat"), 5, '.', '' );
        $speed = number_format( (float)GetSafe::by_key($message_json, "speed"), 1, '.', '' );
        $heading = number_format( (float)GetSafe::by_key($message_json, "heading"), 1, '.', '' );

        $reduced_json_string = "";
        if ( is_numeric($lon) && is_numeric($lat) )
        {
          $reduced_json_string = json_encode( array( "type" => $type, "mmsi" => $mmsi, "lon" => $lon, "lat" => $lat, "speed" => $speed, "heading" => $heading  ) );
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
