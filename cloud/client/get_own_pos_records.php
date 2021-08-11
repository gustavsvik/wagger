<?php


include("../header.php");
include("../db_ini.php");
include("../utils.php");
include("../database.php");
include("header.php");

//$channels = "99999;";
debug_log('$channels: ', $channels);
debug_log('$device_hardware_id: ', $device_hardware_id);
$start_time = -9999 ;
$end_time = -9999 ;
$duration = 300 ;
$unit = 1 ;
$lowest_status = 0 ;

$select_all = FALSE;
if ($duration === -9999) $select_all = TRUE;

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
  if (!$select_all) $start_time -= $duration*$unit; 
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
  $sql_get_available_values = $sql_get_all_available_values ;
  if (!$select_all) $sql_get_available_values .= " WHERE T.CHANNEL_INDEX=" . $channel_string . " AND T.ACQUIRED_TIME BETWEEN " . strval($start_time) . " AND ". strval($end_time);
  $sql_get_available_values .= " AND T.STATUS >= " . strval($lowest_status) . " AND T.STATUS < " . strval($STATUS_STORED) . " ORDER BY T.ACQUIRED_TIME DESC";
  debug_log('$sql_get_available_values: ', $sql_get_available_values);
  $available_values = $conn->query($sql_get_available_values);

  if (is_object($available_values))
  {
    if ($available_values->num_rows <= 0) 
    {
      $sql_get_stored_archived_values = $sql_get_all_available_values . " AND T.STATUS >= " . strval($STATUS_STORED) . " ORDER BY T.ACQUIRED_TIME DESC";
      debug_log('$sql_get_stored_archived_values: ', $sql_get_stored_archived_values);
      $available_values = $conn->query($sql_get_stored_archived_values);
    }
    if ($available_values->num_rows > 0) 
    {
      while ($value_row = $available_values->fetch_array(MYSQLI_NUM)) 
      {
        $time_string = "";
        if (!is_null($value_row[0])) $time_string = strval($value_row[0]);
        $return_string .= $time_string . ",,," ; 
        $all_bytes_string = "[";
        if (!is_null($value_row[1])) $bytes_string_json = strval($value_row[1]);
        $bytes_string_json_array = json_decode($bytes_string_json, true);
        if (is_iterable($bytes_string_json_array))
        {
          foreach ($bytes_string_json_array as $bytes_string_json)
          {
            $ais_message_json = $bytes_string_json[3];
            $lon = safe_get($ais_message_json, "lon");
            $lat = safe_get($ais_message_json, "lat");
            $mmsi = $bytes_string_json[2];
            $bytes_string = "";
            if ( is_numeric($lon) && is_numeric($lat) )
            {
              $bytes_string = json_encode( array( "type" => 1, "mmsi" => $mmsi, "lon" => $lon, "lat" => $lat) );
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
}

$conn->close();

debug_log('$return_string: ', $return_string);
header("Content-type: application/json");
$json_array = array('returnstring' => $return_string) ; //, 'receivetime' => $receive_timestamp, 'transmittime' => $transmit_timestamp);
echo json_encode($json_array);
