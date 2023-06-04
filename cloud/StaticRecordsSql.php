<?php declare(strict_types=1);


include_once("Log.php");
include_once("Status.php");
include_once("RecordsSql.php");


class StaticRecordsSql extends RecordsSql
{


  public function __construct (string|null $server_name = NULL, string|null $user_name = NULL, string|null $password = NULL, string|null $db_name = NULL)
  {
    parent::__construct($server_name, $user_name, $password, $db_name);
  }
  
  
  public static function get_static_by_id($table_label, $hardware_id = NULL, $text_id = NULL, $unique_index = NULL, $parent_table_label = NULL )
  {
    //Log::debug(' $table_label:' . $table_label . ' $hardware_id:' . $hardware_id . ' $text_id:' . $text_id . ' $unique_index:' . strval($unique_index) . ' $parent_table_label:' . $parent_table_label);
  
    $table_name_string = "t_" . strtolower(strval($table_label)) ;
    $column_label_string = strtoupper(strval($table_label));
    $parent_column_label_string = NULL;
    if ( !is_null($parent_table_label) ) $parent_column_label_string = strtoupper(strval($parent_table_label));

    $unique_indices = array();
    $hardware_ids = array();
    $text_ids = array();
    $addresses = array();
    $descriptions = array();
    $times = array();
    $parent_indices = array();
  
    $sql_get_records = "SELECT T." . $column_label_string . "_UNIQUE_INDEX, T." . $column_label_string . "_HARDWARE_ID, T." . $column_label_string . "_TEXT_ID, T." . $column_label_string . "_ADDRESS, T." . $column_label_string . "_DESCRIPTION, T." . $column_label_string . "_TIME ";
    if ( !is_null($parent_column_label_string) ) $sql_get_records .= ", T." . $parent_column_label_string . "_INDEX ";
    $sql_get_records .= "FROM " . $table_name_string . " T WHERE T." . $column_label_string ;
    //Log::debug('sql_get_records: ', $sql_get_records);
    $records = NULL;
    if (!is_null($hardware_id))
    {
      $sql_get_records_by_hardware_id = $sql_get_records . "_HARDWARE_ID='" . $hardware_id . "'";
      //Log::debug('$sql_get_records_by_hardware_id: ', $sql_get_records_by_hardware_id);
      $records = static::$connection->query( $sql_get_records_by_hardware_id );
      //Log::debug('$records: ', $records);
    }
    if (!is_null($text_id) && ( !is_object($records) || $records->num_rows <= 0 ) )
    {
      $sql_get_records_by_text_id = $sql_get_records . "_TEXT_ID='" . $text_id . "'";
      //Log::debug('$sql_get_records_by_text_id: ', $sql_get_records_by_text_id);
      $records = static::$connection->query( $sql_get_records_by_text_id );
    }
    if (!is_null($unique_index) && ( !is_object($records) || $records->num_rows <= 0 ) )
    {
      $sql_get_records_by_unique_index = $sql_get_records . "_UNIQUE_INDEX=" . strval($unique_index);
      //Log::debug('$sql_get_records_by_unique_index: ', $sql_get_records_by_unique_index);
      $records = static::$connection->query( $sql_get_records_by_unique_index );
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
        if (!is_null($parent_table_label) && !is_null($record[6])) $parent_indices[] = $record[6];
      }
    }

    $unique_index = 0;
    $hardware_id = "";
    $text_id = "";
    $address = "";
    $description = "";
    $time = 0;
    $parent_index = 0;

    if (count($unique_indices) > 0) $unique_index = intval($unique_indices[0]);
    if (count($hardware_ids) > 0) $hardware_id = strval($hardware_ids[0]);
    if (count($text_ids) > 0) $text_id = strval($text_ids[0]);
    if (count($addresses) > 0) $address = strval($addresses[0]);
    if (count($descriptions) > 0) $description = strval($descriptions[0]);
    if (count($times) > 0) $time = intval($times[0]);
    if (count($parent_indices) > 0) $parent_index = intval($parent_indices[0]);

    return array("unique_index" => $unique_index, "hardware_id" => $hardware_id, "text_id" => $text_id, "address" => $address, "description" => $description, "time" => $time, "parent_index" => $parent_index);
  }
  
  
  public static function get_parent_index_by_id($table_label, $hardware_id, $text_id = NULL, $parent_table_label = NULL )
  {
    $return_data_array = NULL;
  
    if (!is_null(static::$connection))
    {
      Log::debug(' $table_label:' . $table_label . ' $hardware_id:' . $hardware_id . ' $text_id:' . $text_id . ' $parent_table_label:' . $parent_table_label);
      $return_data_array = static::get_static_by_id($table_label, $hardware_id, $text_id, NULL, $parent_table_label);
      Log::debug('$return_data_array: ', $return_data_array);
    }

    $parent_index = intval( GetSafe::by_key($return_data_array, 'parent_index') );
    //Log::debug('$parent_index: ', $parent_index);

    //$json_array = array('parent_index' => $parent_index);

    return $parent_index;
  }


  public static function update_static_by_index($table_label, $unique_index, $hardware_id, $text_id, $address, $description) : int|null
  {
    //Log::debug('$unique_index: ', $unique_index, '$hardware_id: ', $hardware_id, '$text_id: ', $text_id, '$address: ', $address, '$description: ', $description );
    $table_name_string = "t_" . strtolower(strval($table_label)) ;
    $column_label_string = strtoupper(strval($table_label));

    $new_index = -1;

    if (!is_null($unique_index) && $unique_index > -1)
    {
      static::$connection->autocommit(FALSE);
      static::$connection->begin_transaction();
      $stmt = NULL;
      $stmt_string = "UPDATE " . $table_name_string . " SET " . $column_label_string . "_HARDWARE_ID" . " = ?, " . $column_label_string . "_TEXT_ID = ?, " . $column_label_string . "_ADDRESS = ?," . $column_label_string . "_DESCRIPTION = ?, " . $column_label_string . "_TIME = UNIX_TIMESTAMP(CURRENT_TIMESTAMP()), " . $column_label_string . "_UPDATED_TIMESTAMP = CURRENT_TIMESTAMP(), " . $column_label_string . "_STATUS = " . STATUS::FULFILLED->str() . " WHERE " . $column_label_string . "_UNIQUE_INDEX=?";
      Log::debug('$stmt_string: ', $stmt_string);
      $stmt = static::$connection->prepare($stmt_string);
      $stmt->bind_param('sssss', $hardware_id, $text_id, $address, $description, $unique_index);
  
      if(!$stmt->execute())
      {
        static::$connection->rollback();
        die();
      }
      $stmt->close();
      static::$connection->commit();
    }
    else
    {
      $stmt_string = "INSERT INTO " . $table_name_string . " (";
      if (!is_null($unique_index)) $stmt_string .= $column_label_string . "_UNIQUE_INDEX, ";
      $stmt_string .= $column_label_string . "_HARDWARE_ID, " . $column_label_string . "_TEXT_ID, " . $column_label_string . "_ADDRESS, " . $column_label_string . "_DESCRIPTION, " . $column_label_string . "_TIME, " . $column_label_string . "_STATUS) ";
      if (!is_null($unique_index)) $stmt_string .= "VALUES (?,?,?,?,?,UNIX_TIMESTAMP(CURRENT_TIMESTAMP()),0) ";
      else $stmt_string .= "VALUES (?,?,?,?,UNIX_TIMESTAMP(CURRENT_TIMESTAMP()),0) ";
      $stmt_string .= "ON DUPLICATE KEY UPDATE " . $column_label_string . "_TEXT_ID = VALUES(" . $column_label_string . "_TEXT_ID), " . $column_label_string . "_ADDRESS = VALUES(" . $column_label_string . "_ADDRESS), " . $column_label_string . "_DESCRIPTION = VALUES(" . $column_label_string . "_DESCRIPTION), " . $column_label_string . "_TIME = VALUES(" . $column_label_string . "_TIME), " . $column_label_string . "_STATUS = VALUES(" . $column_label_string . "_STATUS)";
      Log::debug('$stmt_string: ', $stmt_string);
  
      $new_index = NULL;
      if (!is_null($unique_index)) $new_index = static::get_new_index($table_name_string);
  
      static::$connection->autocommit(FALSE);
      static::$connection->begin_transaction();
      $stmt = NULL;
      $stmt = static::$connection->prepare($stmt_string);
  
      if (!is_null($new_index) && $new_index > -1) $stmt->bind_param('sssss', $new_index, $hardware_id, $text_id, $address, $description);
      else $stmt->bind_param('ssss', $hardware_id, $text_id, $address, $description);

      if(!$stmt->execute())
      {
        static::$connection->rollback();
        die();
      }
      if (static::$connection->insert_id > 0) $new_index = static::$connection->insert_id;
      $stmt->close();
      static::$connection->commit();
    }
    return $new_index;
  }
  
  
  public static function get_static_by_time_interval_status(string $table_label, int $start_time = -9999, int $duration = -9999, int $unit = 1, int $end_time = -9999, Status $lowest_status = Status::FULFILLED, Status $highest_status = Status::STORED)
  {
    //Log::debug('$start_time: ', $start_time);
    //Log::debug('$duration: ', $duration);
    //Log::debug('$unit: ', $unit);
    //Log::debug('$end_time: ', $end_time);
  
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
  
    //Log::debug('$start_time: ', $start_time);
    //Log::debug('$end_time: ', $end_time);
  
    $dummy_channel_string = "1";
    $dummy_channel = intval($dummy_channel_string);
  
    $sql_get_all_available_values = "SELECT T." . $column_label_string . "_UNIQUE_INDEX, T." . $column_label_string . "_HARDWARE_ID, T." . $column_label_string . "_TEXT_ID, T." . $column_label_string . "_ADDRESS, T." . $column_label_string . "_DESCRIPTION, T." . $column_label_string . "_TIME FROM " . $table_name_string . " T";
    $sql_get_records = $sql_get_all_available_values ;
    if (!$select_all) $sql_get_records .= " WHERE T." . $column_label_string . "_TIME BETWEEN " . strval($start_time) . " AND ". strval($end_time);
    $sql_get_records .= " AND T." . $column_label_string . "_STATUS >= " . $lowest_status->str() . " AND T." . $column_label_string . "_STATUS < " . $highest_status->str() . " ORDER BY T." . $column_label_string . "_TIME DESC";
    Log::debug('$sql_get_records: ', $sql_get_records);
    $records = static::$connection->query($sql_get_records);
    Log::debug('$records->num_rows: ', $records->num_rows);
    if (!is_object($records) || $records->num_rows <= 0)
    {
      $sql_get_stored_archived_values = $sql_get_all_available_values . " WHERE T." . $column_label_string . "_STATUS >= " . $highest_status->str() . " ORDER BY T." . $column_label_string . "_TIME DESC";
      Log::debug('$sql_get_stored_archived_values: ', $sql_get_stored_archived_values);
      $records = static::$connection->query($sql_get_stored_archived_values);
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


}