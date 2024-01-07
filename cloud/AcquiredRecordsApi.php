<?php declare(strict_types=1);

include_once("Log.php");
include_once("GetSafe.php");
include_once("Transform.php");
include_once("RecordsApi.php") ;

class AcquiredRecordsApi extends RecordsApi
{

  protected static int|null $MAX_FILES_PER_CHANNEL ;
  protected static bool|null $WRITE_IMAGE_FILES ;
  protected static bool|null $WRITE_VALUE_FILES ;

  protected static string|null $channels ;
  protected static float|null $value ;
  protected static int|null $delete_horizon ;


  public function __construct()
  {
    parent::__construct();

    static::$MAX_FILES_PER_CHANNEL = 20 ;
    static::$WRITE_IMAGE_FILES = FALSE ;
    static::$WRITE_VALUE_FILES = FALSE ;

    static::$channels = strval(GetSafe::post('channels', ";"));
    static::$value = floatval(GetSafe::post('value', -9999.0));
    static::$delete_horizon = intval(GetSafe::post('delete_horizon', 360000));
  }


  public static function get_channel_array() : array|null
  {
    $channel_array = Transform::array_from_channel_string(static::$channels);
    return $channel_array;
  }

  public static function get_channels() : string|null {return static::$channels;}

}
