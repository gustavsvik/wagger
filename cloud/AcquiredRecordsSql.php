<?php declare(strict_types=1);


include_once("Log.php");
include_once("Status.php");
include_once("GetSafe.php");
include_once("RecordsSql.php");



class AcquiredRecordsSql extends RecordsSql
{
  protected const ACQUIRED_DATA_TABLE_NAME = "t_acquired_data";
  protected const IMAGE_DIR = '/srv/wagger/cloud/client/images';


  public function __construct (string|null $server_name = NULL, string|null $user_name = NULL, string|null $password = NULL, string|null $db_name = NULL)
  {
    parent::__construct($server_name, $user_name, $password, $db_name);
  }


  public static function get_data_by_time_interval_status(array|null $channels = [], int|null $start_time = -9999, int|null $duration = -9999, int|null $unit = 1, int|null $end_time = -9999, Status|null $lowest_status = Status::FULFILLED, Status|null $highest_status = Status::STORED)
  {
  }


  public static function get_latest_channel_update_time(array|null $channel_array = [], Status|null $lowest_status = Status::FULFILLED) : int|null
  {
    $latest_update_time = 0 ;//time();

    foreach ($channel_array as $channel)
    {
      $channel_string = strval($channel);
      $sql_latest_available = "SELECT MAX(AD.ACQUIRED_TIME) FROM " . self::ACQUIRED_DATA_TABLE_NAME . " AD WHERE AD.CHANNEL_INDEX = " . $channel_string;
      $sql_latest_available .= " AND AD.STATUS>=" . $lowest_status->str();
      Log::debug('$sql_latest_available: ' . $sql_latest_available);
      $latest_available = static::$connection->query($sql_latest_available);
      if (is_object($latest_available) && $latest_available->num_rows > 0)
      {
        if ($latest_row = $latest_available->fetch_array(MYSQLI_NUM))
        {
          $latest_channel_update_time = intval( GetSafe::by_key($latest_row, 0) );
          if ($latest_channel_update_time > $latest_update_time) $latest_update_time = $latest_channel_update_time;
        }
      }
    }

    return $latest_update_time;
  }


  public static function get_by_channels_time_range_status_range(array|null $column_names = [], array|null $channel_array = [], int|null $start_time = -9999, int|null $end_time = -9999, Status|null $lowest_status = Status::FULFILLED, Status|null $highest_status = Status::STORED, bool|null $select_all = FALSE) : array|null
  {
    $ais_message_json_array = [];

    foreach ($channel_array as $channel)
    {
      $channel_string = strval($channel);

      $sql_get_all_available_records = "SELECT ";
      foreach ($column_names as $column_name)
      {
        $sql_get_all_available_records .= 'T.' . $column_name . ',';
      }
      $sql_get_all_available_records = substr($sql_get_all_available_records, 0, -1);
      $sql_get_all_available_records .= " FROM " . self::ACQUIRED_DATA_TABLE_NAME . " T WHERE T.CHANNEL_INDEX=" . $channel_string ;
      //$sql_get_all_available_records = "SELECT T.ACQUIRED_TIME,T.ACQUIRED_BYTES FROM t_acquired_data T";
      $sql_get_available_records = $sql_get_all_available_records;
      //$sql_get_available_records = $sql_get_all_available_records . " WHERE ";
      if (!$select_all) $sql_get_available_records .= " AND T.ACQUIRED_TIME BETWEEN " . strval($start_time) . " AND " . strval($end_time);
      //if (!$select_all) $sql_get_available_records .= "T.CHANNEL_INDEX=" . $channel_string . " AND T.ACQUIRED_TIME BETWEEN " . strval($start_time) . " AND " . strval($end_time) . " AND ";
      $sql_get_available_records .= " AND T.STATUS >= " . $lowest_status->str() . " AND T.STATUS < " . $highest_status->str() . " AND T.STATUS < " . Status::STORED->str() . " ORDER BY T.ACQUIRED_TIME DESC";
      Log::debug('$sql_get_available_records: ', $sql_get_available_records);
      $available_records = static::$connection->query($sql_get_available_records);

      if (is_object($available_records) && $available_records->num_rows <= 0)
      {
        $sql_get_stored_archived_records = $sql_get_all_available_records . " AND T.STATUS >= " . Status::STORED->str() . " ORDER BY T.ACQUIRED_TIME DESC";
        //debug_log('$sql_get_stored_archived_records: ', $sql_get_stored_archived_records);
        $available_records = static::$connection->query($sql_get_stored_archived_records);
      }

      if (is_object($available_records) && $available_records->num_rows > 0)
      {
        $channel_data_array = [];
        $channel_data_array[] = $channel_string;

        $data_array = [];
        while ($record_row = $available_records->fetch_array(MYSQLI_ASSOC)) //MYSQLI_NUM)
        {
          $data_array[] = $record_row;
          /*
          $time_string = "";
          if (!is_null($record_row[0])) $time_string = strval($record_row[0]);
          if (!is_null($record_row[1])) $bytes_string_json = strval($record_row[1]);
          $bytes_string_json_array = json_decode($bytes_string_json, true);
          if ( CheckIf::is_iterable($bytes_string_json_array) ) //(is_array($bytes_string_json_array) || $bytes_string_json_array instanceof Traversable)
          {
            foreach ($bytes_string_json_array as $bytes_string_json)
            {
              $ais_message_json = $bytes_string_json[3];
              $ais_message_json_array[] = $ais_message_json;
            }
		  }
          */
        }
        $channel_data_array[] = $data_array;
        $ais_message_json_array[] = $channel_data_array;
      }

    }

    Log::debug('$ais_message_json_array: ', $ais_message_json_array);
    return $ais_message_json_array;
  }


}