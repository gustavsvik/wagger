<?php


include("../header.php");
include("../db_ini.php");
include("../utils.php");
include("../database.php");
include("header.php");


//$client_id = http_get_client_id_string();
//debug_log('md5($client_id): ', md5($client_id));

$api_table_label = strtolower(strval($web_api_table_label));
$table_name_string = "t_" . $api_table_label ;
$column_label_string = strtoupper(strval($web_api_table_label));

if (strlen($api_table_label) > 0)
{
  $start_time = -9999 ;
  $end_time = -9999 ;
  $duration = 1200 ;
  $unit = 1 ;
  $lowest_status = 0 ;
}

$return_string = "";

$conn = db_get_connection($SERVERNAME, $USERNAME, $PASSWORD, $DBNAME);

if (!is_null($conn))
{
  //$conn->autocommit(FALSE);
  $return_data_array = db_get_static_by_time_interval_status($conn, $web_api_table_label, $start_time, $duration, $unit, $end_time, $lowest_status, $STATUS_STORED);
  //debug_log('$return_data_array: ', $return_data_array);

/*
$select_all = FALSE;
if ($duration === -9999) $select_all = TRUE;

$return_string = "";

if ($start_time === -9999)
{
  if ($end_time === -9999)
  {
    $latest_point_time = time(); //db_get_max_value($conn, $table_name_string, $column_label_string . "_TIME");
    if (!is_null($latest_point_time)) $end_time = $latest_point_time;
  }
  $start_time = $end_time ;
  if (!$select_all) $start_time -= $duration*$unit;
}

$dummy_channel_string = "1";
$dummy_channel = intval($dummy_channel_string);
$return_string .= $dummy_channel_string . ";";

$sql_get_all_available_values = "SELECT T." . $column_label_string . "_TIME,T." . $column_label_string . "_DESCRIPTION FROM " . $table_name_string . " T";
$sql_get_available_values = $sql_get_all_available_values ;
if (!$select_all) $sql_get_available_values .= " WHERE T." . $column_label_string . "_TIME BETWEEN " . strval($start_time) . " AND ". strval($end_time);
$sql_get_available_values .= " AND T." . $column_label_string . "_STATUS >= " . strval($lowest_status) . " AND T." . $column_label_string . "_STATUS < " . strval($STATUS_STORED) . " ORDER BY T." . $column_label_string . "_TIME DESC";
debug_log('$sql_get_available_values: ', $sql_get_available_values);
$available_values = $conn->query($sql_get_available_values);

if ($available_values)
{
  if ($available_values->num_rows <= 0)
  {
    $sql_get_stored_archived_values = $sql_get_all_available_values . " AND T." . $column_label_string . "_STATUS >= " . strval($STATUS_STORED) . " ORDER BY T." . $column_label_string . "_TIME DESC";
    $available_values = $conn->query($sql_get_stored_archived_values);
  }
  if ($available_values->num_rows > 0)
  {
    while ($value_row = $available_values->fetch_array(MYSQLI_NUM))
    {
      $time_string = "";
      if (!is_null($value_row[0])) $time_string = strval($value_row[0]);
      $description_string = "";
      if (!is_null($value_row[1])) $description_string = strval($value_row[1]);
      $return_string .= $time_string . ",,," ;
      if (strlen($description_string) > 0) $return_string .= ais_armor_string($description_string) ;
      //{
      //  if (in_array($dummy_channel, $ARMORED_BYTE_STRING_CHANNELS, TRUE))
      //  {
      //    $description_string = str_replace(",", "|", $description_string) ;
      //    $description_string = str_replace(";", "~", $description_string) ;
      //    $return_string .= $description_string ;
      //  }
      //}
      $return_string .= "," ;
    }
  }
  else
  {
  }

  $return_string .= ";";
*/

  $conn->close();

  $dummy_channel_string = "1";
  $dummy_channel = intval($dummy_channel_string);
  $return_string .= $dummy_channel_string . ";";

  $times = safe_get($return_data_array, 'times');
  //debug_log('$count($times): ', count($times));
  $descriptions = safe_get($return_data_array, 'descriptions');
  //debug_log('$count($descriptions): ', count($descriptions));

  if ( CheckIf::is_iterable($times) && CheckIf::is_iterable($descriptions)) // ( (is_array($times) || $times instanceof Traversable) && (is_array($descriptions) || $descriptions instanceof Traversable) )
  {
    foreach ( range( 0, count($times) - 1 ) as $index )
    {
      $time_string = "";
      $time = $times[$index];
      if (!is_null($time)) $time_string = strval($time);
      if (strlen($time_string) > 0) $return_string .= $time_string ;
      $return_string .= ",,,";

      $description_string = "";
      $description = $descriptions[$index];
      if (!is_null($description)) $description_string = strval($description);
      if (strlen($description_string) > 0) $return_string .= ais_armor_string($description_string) ;

      $return_string .= "," ;
    }

    $return_string .= ";";
  }

}

//debug_log('$return_string: ', $return_string);

header("Content-type: application/json");
$json_array = array('returnstring' => $return_string) ; //, 'receivetime' => $receive_timestamp, 'transmittime' => $transmit_timestamp);
echo json_encode($json_array);
