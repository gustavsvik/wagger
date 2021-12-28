<?php


class GetSafe
{


  public static function by_key($object, $key)
  {
    return !empty($object[$key]) ? $object[$key] : NULL ;
  }


  public static function post($key, $default)
  {
    if ( isset($_POST[$key]) ) return $_POST[$key];
    return $default;
  }


  public static function get($key, $default)
  {
    if ( isset($_GET[$key]) ) return $_GET[$key];
    return $default;
  }


}