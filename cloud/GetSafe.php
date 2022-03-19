<?php declare(strict_types=1);


class GetSafe
{


  public static function by_key($object, $key, $default = NULL)
  {
    return !empty($object[$key]) ? $object[$key] : $default ;
  }


  public static function post($key, $default = NULL)
  {
    if ( isset($_POST[$key]) ) return $_POST[$key];
    return $default;
  }


  public static function get($key, $default = NULL)
  {
    if ( isset($_GET[$key]) ) return $_GET[$key];
    return $default;
  }


}