<?php declare(strict_types=1);

include_once("Log.php");
include_once("GetSafe.php");
include_once("Transform.php");
include_once("RecordsApi.php") ;

class AcquiredRecordsApi extends RecordsApi
{

  protected static int|null $MAX_FILES_PER_CHANNEL = 20 ;
  protected static bool|null $WRITE_IMAGE_FILES = FALSE;
  protected static bool|null $WRITE_VALUE_FILES = FALSE;

  protected static string|null $channels ;
  protected static int|null $start_time ;
  protected static int|null $end_time ;
  protected static int|null $duration ;
  protected static int|null $unit ;
  protected static float|null $value ;
  protected static int|null $delete_horizon ;
  protected static int|null $lowest_status ;


  public function __construct()
  {
    static::$channels = strval(GetSafe::post('channels', ";"));
    static::$start_time = intval(GetSafe::post('start_time', -9999));
    static::$end_time = intval(GetSafe::post('end_time', -9999));
    static::$duration = intval(GetSafe::post('duration', 10));
    static::$unit = intval(GetSafe::post('unit', 1));
    static::$value = floatval(GetSafe::post('value', -9999.0));
    static::$delete_horizon = intval(GetSafe::post('delete_horizon', 360000));
    static::$lowest_status = intval(GetSafe::post('lowest_status', -1));
  }


  public static function update_time_horizon(int|null $latest_time, bool|null $select_all = FALSE)
  {
    if (static::$duration === -9999) $select_all = TRUE;

    if (static::$start_time === -9999)
    {
      if (static::$end_time === -9999)
      {
        $latest_point_time = $latest_time;
        if (!is_null($latest_point_time)) static::$end_time = $latest_point_time;
      }
      static::$start_time = static::$end_time ;
      if (!$select_all) static::$start_time -= static::$duration * static::$unit;
    }
    Log::debug('static::$start_time: ', static::$start_time);
    Log::debug('static::$end_time: ', static::$end_time);
  }


  public static function get_channel_array() : array|null
  {
    $channel_array = Transform::array_from_channel_string(static::$channels);
    return $channel_array;
  }
  public static function get_start_time() : int|null {return static::$start_time;}
  public static function get_end_time() : int|null {return static::$end_time;}

  //public static function set_duration(int $duration) {static::$duration = $duration;}

}
