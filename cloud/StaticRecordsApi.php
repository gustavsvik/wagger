<?php declare(strict_types=1);

include_once("GetSafe.php");
include_once("RecordsApi.php") ;

class StaticRecordsApi extends RecordsApi
{

  protected static string|null $host_hardware_id ;
  protected static string|null $host_text_id ;
  protected static string|null $device_hardware_id ;
  protected static string|null $device_text_id ;
  protected static string|null $device_address ;
  protected static string|null $module_hardware_id ;
  protected static string|null $module_text_id ;
  protected static string|null $module_address ;
  protected static string|null $channel_hardware_id ;
  protected static string|null $channel_text_id ;
  protected static string|null $channel_address ;
  protected static string|null $common_address ;
  protected static string|null $common_description ;


  public function __construct()
  {
    parent::__construct();

    static::$host_hardware_id = strval(GetSafe::post('host_hardware_id', NULL));
    static::$host_text_id = strval(GetSafe::post('host_text_id', NULL));
    static::$device_hardware_id = strval(GetSafe::post('device_hardware_id', NULL));
    static::$device_text_id = strval(GetSafe::post('device_text_id', NULL));
    static::$device_address = strval(GetSafe::post('device_address', NULL));
    static::$module_hardware_id = strval(GetSafe::post('module_hardware_id', NULL));
    static::$module_text_id = strval(GetSafe::post('module_text_id', NULL));
    static::$module_address = strval(GetSafe::post('module_address', NULL));
    static::$channel_hardware_id = strval(GetSafe::post('channel_hardware_id', NULL));
    static::$channel_text_id = strval(GetSafe::post('channel_text_id', NULL));
    static::$channel_address = strval(GetSafe::post('channel_address', NULL));
    static::$common_address = strval(GetSafe::post('common_address', NULL));
    static::$common_description = strval(GetSafe::post('common_description', NULL));
  }

  public static function get_host_hardware_id() : string|null {return static::$host_hardware_id;}
  public static function get_host_text_id() : string|null {return static::$host_text_id;}
  public static function get_device_hardware_id() : string|null {return static::$device_hardware_id;}
  public static function get_device_text_id() : string|null {return static::$device_text_id;}
  public static function get_device_address() : string|null {return static::$device_address;}
  public static function get_module_hardware_id() : string|null {return static::$module_hardware_id;}
  public static function get_module_text_id() : string|null {return static::$module_text_id;}
  public static function get_module_address() : string|null {return static::$module_address;}
  public static function get_channel_hardware_id() : string|null {return static::$channel_hardware_id;}
  public static function get_channel_text_id() : string|null {return static::$channel_text_id;}
  public static function get_channel_address() : string|null {return static::$channel_address;}
  public static function get_common_address() : string|null {return static::$common_address;}
  public static function get_common_description() : string|null {return static::$common_description;}
}
