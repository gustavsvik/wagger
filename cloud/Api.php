<?php declare(strict_types=1);


class Api
{
    protected static string|null $web_api_table_label ;
  
    public function __construct()
    {  
      static::$web_api_table_label = strval(GetSafe::get('web_api_table_label', NULL));
    }

    
    public static function get_web_api_table_label() : string|null {return static::$web_api_table_label;}
}
