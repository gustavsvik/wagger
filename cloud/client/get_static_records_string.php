<?php 


include_once("../Status.php");

include_once("../Log.php");
include_once("../CheckIf.php");
include_once("../GetSafe.php");
include_once("../StaticRecordsApi.php");
include_once("../StaticRecordsSql.php");


//$log = new Log();
$check_if = new CheckIf();
$get_safe = new GetSafe();
$tr = new Transform();
$api = new StaticRecordsApi();
$sql = new StaticRecordsSql();


$web_api_table_label = 'device'; //$api::get_web_api_table_label();
//$web_api_table_name = strtolower(strval($web_api_table_label));
//$web_api_table_name_string = "t_" . $web_api_table_label ;
//$web_api_column_label_string = strtoupper(strval($web_api_table_label));

//$browser_client_table_label = 'module';
//$browser_client_table_name = strtolower(strval($browser_client_table_label));
//$browser_client_table_name_string = "t_" . $browser_client_table_label ;
//$browser_client_column_label_string = strtoupper(strval($browser_client_table_label));

$start_time = -9999 ;
$end_time = -9999 ;
$duration = 1200 ;
$unit = 1 ;

//$api::set_start_time($start_time) ;
//$api::set_end_time($end_time) ;
//$api::set_duration($duration) ;
//$api::set_unit($unit) ;

$lowest_status = Status::FULFILLED ;
$highest_status = Status::STORED ;
$persistent_status = Status::STORED ;

$return_string = "";

$return_data_array = $sql::get_static_by_time_interval_status($web_api_table_label, $start_time, $duration, $unit, $end_time, $lowest_status, $highest_status, $persistent_status );
//Log::debug('$return_data_array: ', $return_data_array);

$dummy_channel_string = "0";
$dummy_channel = intval($dummy_channel_string);
$return_string .= $dummy_channel_string . ";";

$times = $get_safe::by_key($return_data_array, 'times');
//Log::debug('$times: ', $times);
$descriptions = $get_safe::by_key($return_data_array, 'descriptions');
//Log::debug('$descriptions: ', $descriptions);
$statuses = $get_safe::by_key($return_data_array, 'statuses');
//Log::debug('$statuses: ', $statuses);

if ( $check_if::is_iterable($times) && $check_if::is_iterable($descriptions)) // ( (is_array($times) || $times instanceof Traversable) && (is_array($descriptions) || $descriptions instanceof Traversable) )
{
  foreach ( range( 0, count($times) - 1 ) as $index )
  {
    $time = $times[$index];
    $time_string = "";
    if (!is_null($time)) $time_string = strval($time);
    if (strlen($time_string) > 0) $return_string .= $time_string ;
    $return_string .= ",,,";
    Log::debug('$descriptions[$index]', $descriptions[$index]);
    $description_string = "";
    if ($descriptions[$index])
    {
      $description_json = json_decode(preg_replace('.Infinity.', '"Infinity"', $descriptions[$index]), true);
      if ($description_json)
      {
        $status_key = $web_api_table_label . "_status";
        if (array_is_list($description_json)) $description_json[0][3][$status_key] = $statuses[$index];
        else $description_json[$status_key] = $statuses[$index];
        $description = json_encode($description_json);
        $description_string = preg_replace('."Infinity".', 'Infinity', $description);
      }
    }
    Log::debug('$description_string', $description_string);
    if (strlen($description_string) > 0) $return_string .= $tr::armored_from_separated_string($description_string) ;

    $return_string .= ",";
  }
}
$return_string .= ";";

Log::debug('$return_string: ', $return_string);

header("Content-type: application/json");
$json_array = array('returnstring' => $return_string) ; //, 'receivetime' => $receive_timestamp, 'transmittime' => $transmit_timestamp);
echo json_encode($json_array);
