<?php declare(strict_types=1);


class Inet
{

    public static function http_get_client_ip()
    {
      $ip = NULL;
      if (!empty($_SERVER['HTTP_CLIENT_IP']))
      {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
      }
      elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))
      {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
      }
      else
      {
        $ip = $_SERVER['REMOTE_ADDR'];
      }
      return $ip;
    }

}
