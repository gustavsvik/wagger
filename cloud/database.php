<?php


function db_get_connection($server_name, $user_name, $password, $db_name)
{
  $connection = mysqli_init();

  if (!$connection) die('mysqli_init failed');
  if (!$connection->options(MYSQLI_OPT_CONNECT_TIMEOUT, 5)) die('Setting MYSQLI_OPT_CONNECT_TIMEOUT failed');
  if (!$connection->real_connect($server_name, $user_name, $password, $db_name)) die('Connect Error (' . mysqli_connect_errno() . ') ' . mysqli_connect_error());
  
  return $connection;
}


function db_get_index($connection, $table_label, $column_label, $select_value)
{
  //$table_label = mb_substr(strtoupper($table_name), 2);
  $table_name = "t_" . strtolower($table_label);
  $column_name = strtoupper($table_label)  . "_" . strtoupper($column_label);

  $sql_get_existing_rows = "SELECT T." . $table_label . "_UNIQUE_INDEX FROM " . $table_name . " T WHERE T." . $column_name . "='" . $select_value . "' ORDER BY " . $table_label . "_UNIQUE_INDEX DESC";
  $existing_indices = array();
  $existing_rows = $connection->query($sql_get_existing_rows);
  if (is_object($existing_rows) && $existing_rows->num_rows > 0)
  {
    while ($row = $existing_rows->fetch_array(MYSQLI_NUM))
    {
      if (!is_null($row[0])) $existing_indices[] = $row[0];
    }
  }
  $unique_index = 0;
  if (count($existing_indices) > 0)
  {
    $unique_index = $existing_indices[0];
    //debug_log('$unique_index: ', $unique_index);
  }
  return $unique_index;
}


function db_get_max_value($connection, $table_name, $column_name)
{
  $max_value = NULL;
  $sql_max_value = "SELECT MAX(T." . $column_name . ") FROM " . $table_name . " T";
  $max_value_rows = $connection->query($sql_max_value);
  if (is_object($max_value_rows) && $max_value_rows->num_rows > 0) 
  {
    while ($row = $max_value_rows->fetch_array(MYSQLI_NUM)) 
    {
      if (!is_null($row[0])) $max_value = intval($row[0]);
    }
  }
  return $max_value;
}


function db_get_new_index($connection, $table_name)
{
  $table_label = mb_substr(strtoupper($table_name), 2);
  $column_name = $table_label . "_UNIQUE_INDEX";
  $max_index = db_get_max_value($connection, $table_name, $column_name);
  $new_index = $max_index + 1;
  //debug_log('$new_index: ', strval($new_index));
  return $new_index;
}


function db_get_full_rows($connection, $table_name, $index_array) //db_get_all_data_by_index_list
{
  $table_label = mb_substr(strtoupper($table_name), 2);
  $sql_get_full_rows = "SELECT * FROM " . $table_name;

  if (is_array($index_array) && count($index_array) > 0)
  {
    $sql_get_full_rows .= " T WHERE T." . $table_label . "_UNIQUE_INDEX IN (" . get_separated_value_range_string($index_array, ",") . ")";
  }
  $full_rows = $connection->query($sql_get_full_rows);
  
  if ($full_rows->num_rows > 0) 
  {
    while ($row = $full_rows->fetch_assoc()) 
    {
      $rows[] = $row;
    }
  }
  return rows; 
}


function db_get_static_by_id($connection, $table_label, $hardware_id, $text_id)
{
  //debug_log('hardware_id: ', $hardware_id);
  //debug_log('text_id: ', $text_id);

  $table_name_string = "t_" . strtolower(strval($table_label)) ;
  $column_label_string = strtoupper(strval($table_label));

  $unique_indices = array();
  $hardware_ids = array();
  $text_ids = array();
  $addresses = array();
  $descriptions = array();
  $times = array();

  $sql_get_records = "SELECT T." . $column_label_string . "_UNIQUE_INDEX, T." . $column_label_string . "_HARDWARE_ID, T." . $column_label_string . "_TEXT_ID, T." . $column_label_string . "_ADDRESS, T." . $column_label_string . "_DESCRIPTION, T." . $column_label_string . "_TIME FROM " . $table_name_string . " T WHERE T." . $column_label_string ;
  //debug_log('sql_get_records: ', $sql_get_records);
  $records = $connection->query( $sql_get_records . "_HARDWARE_ID='" . $hardware_id . "'" );
  if (!is_object($records) || $records->num_rows <= 0)
  {
    $records = $connection->query($sql_get_records . "_TEXT_ID='" . $text_id . "'");
  }
  if (is_object($records) && $records->num_rows > 0)
  {
    while ($record = $records->fetch_array(MYSQLI_NUM))
    {
      if (!is_null($record[0])) $unique_indices[] = $record[0];
      if (!is_null($record[1])) $hardware_ids[] = $record[1];
      if (!is_null($record[2])) $text_ids[] = $record[2];
      if (!is_null($record[3])) $addresses[] = $record[3];
      if (!is_null($record[4])) $descriptions[] = $record[4];
      if (!is_null($record[5])) $times[] = $record[5];
    }
  }

  $unique_index = 0;
  $hardware_id = "";
  $text_id = "";
  $address = "";
  $description = "";
  $time = 0;

  if (count($unique_indices) > 0) $unique_index = intval($unique_indices[0]);
  if (count($hardware_ids) > 0) $hardware_id = strval($hardware_ids[0]);
  if (count($text_ids) > 0) $text_id = strval($text_ids[0]);
  if (count($addresses) > 0) $address = strval($addresses[0]);
  if (count($descriptions) > 0) $description = strval($descriptions[0]);
  if (count($times) > 0) $time = strval($times[0]);

  return array("unique_index" => $unique_index, "hardware_id" => $hardware_id, "text_id" => $text_id, "address" => $address, "description" => $description, "time" => $time);

}


function db_update_static_by_index($connection, $table_label, $unique_index, $hardware_id, $text_id, $address, $description)
{
  $table_name_string = "t_" . strtolower(strval($table_label)) ;
  $column_label_string = strtoupper(strval($table_label));

  if ($unique_index > 0)
  {
    $connection->autocommit(FALSE);
    $connection->begin_transaction();
    $stmt = NULL;
    $stmt_string = "UPDATE " . $table_name_string . " SET " . $column_label_string . "_HARDWARE_ID" . "=?, " . $column_label_string . "_TEXT_ID=?, " . $column_label_string . "_ADDRESS=?," . $column_label_string . "_DESCRIPTION=?, " . $column_label_string . "_TIME=UNIX_TIMESTAMP(CURRENT_TIMESTAMP()), " . $column_label_string . "_UPDATED_TIMESTAMP=CURRENT_TIMESTAMP(), " . $column_label_string . "_STATUS=0 WHERE " . $column_label_string . "_UNIQUE_INDEX=?";
    //debug_log('$stmt_string: ', $stmt_string);
    $stmt = $connection->prepare($stmt_string);
    $stmt->bind_param('sssss', $hardware_id, $text_id, $address, $description, $unique_index);

    if(!$stmt->execute())
    {
      $connection->rollback();
      die();
    }
    $stmt->close();
    $connection->commit();
  }
  else
  {
    $new_index = db_get_new_index($connection, $table_name_string);

    $connection->autocommit(FALSE);
    $connection->begin_transaction();
    $stmt = NULL;
    $stmt_string = "INSERT INTO " . $table_name_string . " (" . $column_label_string . "_UNIQUE_INDEX, " . $column_label_string . "_HARDWARE_ID, " . $column_label_string . "_TEXT_ID, " . $column_label_string . "_ADDRESS, " . $column_label_string . "_DESCRIPTION, " . $column_label_string . "_TIME, " . $column_label_string . "_STATUS) VALUES (?,?,?,?,?,UNIX_TIMESTAMP(CURRENT_TIMESTAMP()),0) ON DUPLICATE KEY UPDATE " . $column_label_string . "_TEXT_ID = VALUES(" . $column_label_string . "_TEXT_ID), " . $column_label_string . "_ADDRESS = VALUES(" . $column_label_string . "_ADDRESS), " . $column_label_string . "_DESCRIPTION = VALUES(" . $column_label_string . "_DESCRIPTION), " . $column_label_string . "_TIME = VALUES(" . $column_label_string . "_TIME), " . $column_label_string . "_STATUS = VALUES(" . $column_label_string . "_STATUS)";
    //debug_log('$stmt_string: ', $stmt_string);
    $stmt = $connection->prepare($stmt_string);
    $stmt->bind_param('sssss', $new_index, $hardware_id, $text_id, $address, $description);
    if(!$stmt->execute())
    {
      $connection->rollback();
      die();
    }
    $stmt->close();
    $connection->commit();
  }
}


function db_get_static_by_time_interval_status($connection, $table_label, $start_time = -9999, $duration = -9999, $unit = 1, $end_time = -9999, $lowest_status = 0, $highest_status = 1)
{
  debug_log('$start_time: ', $start_time);
  debug_log('$duration: ', $duration);
  debug_log('$unit: ', $unit);
  debug_log('$end_time: ', $end_time);

  $table_name_string = "t_" . strtolower(strval($table_label)) ;
  $column_label_string = strtoupper(strval($table_label));

  $unique_indices = array();
  $hardware_ids = array();
  $text_ids = array();
  $addresses = array();
  $descriptions = array();
  $times = array();

  $select_all = FALSE;
  if ($duration === -9999) $select_all = TRUE;

  //$return_string = "";

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
  debug_log('$start_time: ', $start_time);
  debug_log('$end_time: ', $end_time);

  $dummy_channel_string = "1";
  $dummy_channel = intval($dummy_channel_string);

  $sql_get_all_available_values = "SELECT T." . $column_label_string . "_UNIQUE_INDEX, T." . $column_label_string . "_HARDWARE_ID, T." . $column_label_string . "_TEXT_ID, T." . $column_label_string . "_ADDRESS, T." . $column_label_string . "_DESCRIPTION, T." . $column_label_string . "_TIME FROM " . $table_name_string . " T";
  $sql_get_records = $sql_get_all_available_values ;
  if (!$select_all) $sql_get_records .= " WHERE T." . $column_label_string . "_TIME BETWEEN " . strval($start_time) . " AND ". strval($end_time);
  $sql_get_records .= " AND T." . $column_label_string . "_STATUS >= " . strval($lowest_status) . " AND T." . $column_label_string . "_STATUS < " . strval($highest_status) . " ORDER BY T." . $column_label_string . "_TIME DESC";
  debug_log('$sql_get_records: ', $sql_get_records);
  $records = $connection->query($sql_get_records);
  debug_log('$records->num_rows: ', $records->num_rows);
  if (!is_object($records) || $records->num_rows <= 0)
  {
    $sql_get_stored_archived_values = $sql_get_all_available_values . " AND T." . $column_label_string . "_STATUS >= " . strval($highest_status) . " ORDER BY T." . $column_label_string . "_TIME DESC";
    $records = $connection->query($sql_get_stored_archived_values);
  }
  if (is_object($records) && $records->num_rows > 0)
  {
    while ($record = $records->fetch_array(MYSQLI_NUM))
    {
      if (!is_null($record[0])) $unique_indices[] = $record[0];
      if (!is_null($record[1])) $hardware_ids[] = $record[1];
      if (!is_null($record[2])) $text_ids[] = $record[2];
      if (!is_null($record[3])) $addresses[] = $record[3];
      if (!is_null($record[4])) $descriptions[] = $record[4];
      if (!is_null($record[5])) $times[] = $record[5];
    }
  }
  return array("unique_indices" => $unique_indices, "hardware_ids" => $hardware_ids, "text_ids" => $text_ids, "addresses" => $addresses, "descriptions" => $descriptions, "times" => $times);
}


function db_get_data_by_time_interval_status($connection, $channels = [], $start_time = -9999, $duration = -9999, $unit = 1, $end_time = -9999, $lowest_status = 0, $highest_status = 1)
{
}
