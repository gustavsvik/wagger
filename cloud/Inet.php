<?php declare(strict_types=1);


class Inet
{

    public static function extract_client_ip()
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

    public static function generate_client_id_string($exclude_keys)
    {
      $exclude_keys_array = [];
      if (!is_null($exclude_keys)) $exclude_keys_array = $exclude_keys ;
      $client_id_string = "";
      foreach ($_SERVER as $server_key => $server_value)
      {
        if ( !( in_array($server_key, $exclude_keys_array) ) ) $client_id_string .= $server_key . ' ' . $server_value . ' ';
      }
      return $client_id_string;
    }


}
