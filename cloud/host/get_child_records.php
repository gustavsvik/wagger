<?php


include("../header.php");
include("../db_ini.php");
include("../utils.php");
include("../database.php");
include("header.php");


$table_label = "DEVICE";
$child_table_label = "MODULE";
$hardware_id = "";
$text_id = "";

debug_log('$table_label: ', $table_label );
debug_log('$child_table_label: ', $child_table_label );
debug_log('$hardware_id: ', $hardware_id );
debug_log('$text_id: ', $text_id );

$conn = db_get_connection($SERVERNAME, $USERNAME, $PASSWORD, $DBNAME);

$return_data_array = NULL;
if (!is_null($conn))
{
  $return_data_array = db_get_static_by_id($conn, $table_label, $hardware_id, $text_id);
  debug_log('$return_data_array: ', $return_data_array);
  $conn->close();
}

$unique_index = safe_get($return_data_array, 'unique_index');

$module_hardware_id = safe_get($return_data_array, 'hardware_id');
$module_text_id = safe_get($return_data_array, 'text_id');
$common_address = safe_get($return_data_array, 'address');
$common_description = safe_get($return_data_array, 'description');

header("Content-type: application/json");
$json_array = array('module_unique_index' => $module_unique_index, 'module_hardware_id' => $module_hardware_id, 'module_text_id' => $module_text_id, 'common_address' => $common_address, 'common_description' => $common_description);
echo json_encode($json_array);

