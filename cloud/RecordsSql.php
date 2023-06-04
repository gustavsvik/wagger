<?php declare(strict_types=1);


include_once("Log.php");
include_once("Status.php");
include_once("Sql.php");


class RecordsSql extends Sql
{
  //protected static Status $STATUS = Status::REQUESTED ;


  public function __construct (string|null $server_name = NULL, string|null $user_name = NULL, string|null $password = NULL, string|null $db_name = NULL)
  {
    parent::__construct($server_name, $user_name, $password, $db_name);
  }


  public static function get_indices($table_label, $column_label, $select_value)
  {
    $table_name = "t_" . strtolower($table_label);
    $column_name = strtoupper($table_label)  . "_" . strtoupper($column_label);

    $sql_get_existing_rows = "SELECT T." . $table_label . "_UNIQUE_INDEX FROM " . $table_name . " T WHERE T." . $column_name . "='" . $select_value . "' ORDER BY " . $table_label . "_UNIQUE_INDEX DESC";
    $existing_indices = array();
    $existing_rows = static::$connection->query($sql_get_existing_rows);
    if (is_object($existing_rows) && $existing_rows->num_rows > 0)
    {
      while ($row = $existing_rows->fetch_array(MYSQLI_NUM))
      {
        if (!is_null($row[0])) $existing_indices[] = $row[0];
      }
    }
    return $existing_indices;
  }


  public static function get_by_indices($table_label, $column_label, $select_indices)
  {
    return NULL;
  }


  public static function get_index($table_label, $column_label, $select_value)
  {
    $existing_indices = static::get_indices($table_label, $column_label, $select_value);

    $unique_index = -1;
    if (count($existing_indices) > 0) $unique_index = $existing_indices[0];

    return $unique_index;
  }


  public static function get_max_value($table_name, $column_name)
  {
    $max_value = NULL;
    $sql_max_value = "SELECT MAX(T." . $column_name . ") FROM " . $table_name . " T";
    $max_value_rows = static::$connection->query($sql_max_value);
    if (is_object($max_value_rows) && $max_value_rows->num_rows > 0)
    {
      while ($row = $max_value_rows->fetch_array(MYSQLI_NUM))
      {
        if (!is_null($row[0])) $max_value = intval($row[0]);
      }
    }
    return $max_value;
  }


  public static function get_new_index($table_name)
  {
    $table_label = mb_substr(strtoupper($table_name), 2);
    $column_name = $table_label . "_UNIQUE_INDEX";
    $max_index = static::get_max_value($table_name, $column_name);
    $new_index = NULL;
    if (!is_null($max_index)) $new_index = $max_index + 1;
    return $new_index;
  }

  /*
  function reserve_new_index($connection, $table_label)
  {
    $table_name_string = "t_" . strtolower(strval($table_label)) ;
    $column_name_string = strtoupper(strval($table_label)) . "_UNIQUE_INDEX";

    $new_index = db_get_new_index($connection, $table_name_string);

    $connection->autocommit(FALSE);
    $connection->begin_transaction();
    $stmt = NULL;
    $stmt_string = "INSERT INTO " . $table_name_string . " (" . $column_name_string . ", " . $column_label_string . "_HARDWARE_ID, " . $column_label_string . "_TEXT_ID, " . $column_label_string . "_ADDRESS, " . $column_label_string . "_DESCRIPTION, " . $column_label_string . "_TIME, " . $column_label_string . "_STATUS) VALUES (?,?,?,?,?,UNIX_TIMESTAMP(CURRENT_TIMESTAMP()),0)
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
  */

  public static function get_full_rows($table_name, $index_array) //db_get_all_data_by_index_list
  {
    $table_label = mb_substr(strtoupper($table_name), 2);
    $sql_get_full_rows = "SELECT * FROM " . $table_name;

    if (is_array($index_array) && count($index_array) > 0)
    {
      $sql_get_full_rows .= " T WHERE T." . $table_label . "_UNIQUE_INDEX IN (" . get_separated_value_range_string($index_array, ",") . ")";
    }
    $full_rows = static::$connection->query($sql_get_full_rows);

    if ($full_rows->num_rows > 0)
    {
      while ($row = $full_rows->fetch_assoc())
      {
        $rows[] = $row;
      }
    }
    return rows;
  }


  public static function update_single_by_index($table_label, $unique_index, $column_name, $column_value)
  {
    $table_name_string = "t_" . strtolower(strval($table_label)) ;

    if ($unique_index > -1)
    {
      static::$connection->autocommit(FALSE);
      static::$connection->begin_transaction();
      $stmt = NULL;
      $stmt_string = "UPDATE " . $table_name_string . " SET " . $column_name . "=? WHERE " . $table_label . "_UNIQUE_INDEX=?";

      $stmt = static::$connection->prepare($stmt_string);
      $stmt->bind_param('ss', $column_value, $unique_index);

      if(!$stmt->execute())
      {
        static::$connection->rollback();
        die();
      }
      $stmt->close();
      static::$connection->commit();
    }
  }


}