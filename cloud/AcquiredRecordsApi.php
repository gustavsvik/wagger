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
    self::$channels = strval(GetSafe::post('channels', ";"));
    self::$start_time = intval(GetSafe::post('start_time', -9999));
    self::$end_time = intval(GetSafe::post('end_time', -9999));
    self::$duration = intval(GetSafe::post('duration', 10));
    self::$unit = intval(GetSafe::post('unit', 1));
    self::$value = floatval(GetSafe::post('value', -9999.0));
    self::$delete_horizon = intval(GetSafe::post('delete_horizon', 360000));
    self::$lowest_status = intval(GetSafe::post('lowest_status', -1));
  }


  public static function update_time_horizon(int|null $latest_time, bool|null $select_all = FALSE)
  {
    if (self::$duration === -9999) $select_all = TRUE;

    if (self::$start_time === -9999)
    {
      if (self::$end_time === -9999)
      {
        $latest_point_time = $latest_time;
        if (!is_null($latest_point_time)) self::$end_time = $latest_point_time;
      }
      self::$start_time = self::$end_time ;
      if (!$select_all) self::$start_time -= self::$duration * self::$unit;
    }
    Log::debug('self::$start_time: ', self::$start_time);
    Log::debug('self::$end_time: ', self::$end_time);
  }


  public static function get_channel_array() : array|null
  {
    $channel_array = Transform::array_from_channel_string(self::$channels);
    return $channel_array;
  }
  public static function get_start_time() : int|null {return self::$start_time;}
  public static function get_end_time() : int|null {return self::$end_time;}

  //public static function set_duration(int $duration) {self::$duration = $duration;}

}
