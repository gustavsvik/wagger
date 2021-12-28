<?php


include_once("../header.php");
include_once("../db_ini.php");
include_once("../GetSafe.php");
include_once("../utils.php");
include_once("../database.php");
include_once("header.php");


//debug_log('$host_hardware_id: ', $host_hardware_id );
//debug_log('$host_text_id: ', $host_text_id );

$conn = db_get_connection($SERVERNAME, $USERNAME, $PASSWORD, $DBNAME);

$return_data_array = NULL;
if (!is_null($conn))
{
  $return_data_array = db_get_static_by_id($conn, "HOST", $host_hardware_id, $host_text_id);
  //debug_log('$return_data_array: ', $return_data_array);

/*
$host_unique_indices = array();
$host_hardware_ids = array();
$host_text_ids = array();
$host_addresses = array();
$host_descriptions = array();

$sql_get_hosts = "SELECT HO.HOST_UNIQUE_INDEX, HO.HOST_HARDWARE_ID, HO.HOST_TEXT_ID, HO.HOST_ADDRESS, HO.HOST_DESCRIPTION FROM t_host HO WHERE HO.HOST_HARDWARE_ID='" . $host_hardware_id . "'";
$hosts = $conn->query($sql_get_hosts);
if (!is_object($hosts) || $hosts->num_rows <= 0)
{
  $sql_get_hosts = "SELECT HO.HOST_UNIQUE_INDEX, HO.HOST_HARDWARE_ID, HO.HOST_TEXT_ID, HO.HOST_ADDRESS, HO.HOST_DESCRIPTION FROM t_host HO WHERE HO.HOST_TEXT_ID='" . $host_text_id . "'";
  $hosts = $conn->query($sql_get_hosts);
}
if (is_object($hosts) && $hosts->num_rows > 0)
{
  while ($host_row = $hosts->fetch_array(MYSQLI_NUM))
  {
    if (!is_null($host_row[0])) $host_unique_indices[] = $host_row[0];
    if (!is_null($host_row[1])) $host_hardware_ids[] = $host_row[1];
    if (!is_null($host_row[2])) $host_text_ids[] = $host_row[2];
    if (!is_null($host_row[3])) $host_addresses[] = $host_row[3];
    if (!is_null($host_row[4])) $host_descriptions[] = $host_row[4];
  }
}


$host_unique_index = 0;
$host_hardware_id = "";
$host_text_id = "";
$host_address = "";
$host_description = "";

if (count($host_unique_indices) > 0) $host_unique_index = intval($host_unique_indices[0]);
debug_log('$host_unique_index: ', $host_unique_index);
if (count($host_hardware_ids) > 0) $host_hardware_id = strval($host_hardware_ids[0]);
debug_log('host_hardware_id: ', $host_hardware_id);
if (count($host_text_ids) > 0) $host_text_id = strval($host_text_ids[0]);
debug_log('host_text_id: ', $host_text_id);
if (count($host_addresses) > 0) $host_address = strval($host_addresses[0]);
debug_log('host_address: ', $host_address);
if (count($host_descriptions) > 0) $host_description = strval($host_descriptions[0]);
debug_log('host_description: ', $host_description);
*/

$host_hardware_id = GetSafe::by_key($return_data_array, 'hardware_id');

if ( !is_null($host_hardware_id) )
{
  $device_parent_index = NULL;

  $host_unique_index = GetSafe::by_key($return_data_array, 'unique_index');
  $host_text_id = GetSafe::by_key($return_data_array, 'text_id');
  $host_address = GetSafe::by_key($return_data_array, 'address');
  $common_description = GetSafe::by_key($return_data_array, 'description');
}
else
{
  $device_parent_index = db_get_parent_index_by_id($conn, "DEVICE", $host_text_id . '-VDM', NULL, "HOST" );
  //debug_log('$device_parent_index: ', $device_parent_index);
  $return_data_array = db_get_static_by_id($conn, "HOST", NULL, NULL, $device_parent_index);
  debug_log('$return_data_array: ', $return_data_array);
  $host_unique_index = GetSafe::by_key($return_data_array, 'unique_index');
  $host_hardware_id = GetSafe::by_key($return_data_array, 'hardware_id');
  $host_text_id = GetSafe::by_key($return_data_array, 'text_id');
  $host_address = GetSafe::by_key($return_data_array, 'address');
  $common_description = GetSafe::by_key($return_data_array, 'description');
}

  $conn->close();
}

header("Content-type: application/json");
$json_array = array('host_unique_index' => $host_unique_index, 'host_hardware_id' => $host_hardware_id, 'host_text_id' => $host_text_id, 'host_address' => $host_address, 'common_description' => $common_description);
debug_log('$json_array: ', $json_array);
echo json_encode($json_array);

