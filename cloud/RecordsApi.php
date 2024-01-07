<?php declare(strict_types=1);

include_once("Log.php");
include_once("GetSafe.php");
include_once("Api.php") ;

class RecordsApi extends Api
{

  protected static int|null $start_time ;
  protected static int|null $end_time ;
  protected static int|null $duration ;
  protected static int|null $unit ;
  protected static int|null $lowest_status ;

  public function __construct()
  {
    parent::__construct();

    static::$start_time = intval(GetSafe::post('start_time', -9999));
    static::$end_time = intval(GetSafe::post('end_time', -9999));
    static::$duration = intval(GetSafe::post('duration', 10));
    static::$unit = intval(GetSafe::post('unit', 1));
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

  public static function get_start_time() : int {return static::$start_time;}
  public static function get_end_time() : int {return static::$end_time;}
  public static function get_duration() : int {return static::$duration;}
  public static function get_unit() : int {return static::$unit;}
  public static function get_lowest_status() : int {return static::$lowest_status;}

  public static function set_start_time(int $start_time) {static::$start_time = $start_time;}
  public static function set_end_time(int $end_time) {static::$end_time = $end_time;}
  public static function set_duration(int $duration) {static::$duration = $duration;}
  public static function set_unit(int $unit) {static::$unit = $unit;}

}
