<?php


include_once("../header.php");
include_once("../db_ini.php");
include_once("../GetSafe.php");
include_once("../utils.php");
include_once("../database.php");
include_once("header.php");


$table_label = "DEVICE";
$parent_table_label = "HOST";
$hardware_id = "265280000-VDM";
$text_id = "";

debug_log('$table_label: ', $table_label );
debug_log('$parent_table_label: ', $parent_table_label );
debug_log('$hardware_id: ', $hardware_id );
debug_log('$text_id: ', $text_id );

$conn = db_get_connection($SERVERNAME, $USERNAME, $PASSWORD, $DBNAME);

$return_data_array = NULL;

if (!is_null($conn))
{
  $return_data_array = db_get_static_by_id($conn, $table_label, $hardware_id, $text_id, NULL, $parent_table_label);
  debug_log('$return_data_array: ', $return_data_array);
  $conn->close();
}

$unique_index = GetSafe::by_key($return_data_array, 'unique_index');

$hardware_id = GetSafe::by_key($return_data_array, 'hardware_id');
$text_id = GetSafe::by_key($return_data_array, 'text_id');
$address = GetSafe::by_key($return_data_array, 'address');
$description = GetSafe::by_key($return_data_array, 'description');
$time = GetSafe::by_key($return_data_array, 'time');
$parent_index = GetSafe::by_key($return_data_array, 'parent_index');

header("Content-type: application/json");
$json_array = array('unique_index' => $unique_index, 'hardware_id' => $hardware_id, 'text_id' => $module_text_id, 'address' => $address, 'description' => $description, 'time' => $time, 'parent_index' => $parent_index);
echo json_encode($json_array);

