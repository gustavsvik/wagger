<?php declare(strict_types=1);


include_once("CheckIf.php");



class Transform
{

  public static function to_string($value, string $default = "") : string
  {
    $check_if = new CheckIf();

    $out_string = $default;
    if ( $check_if::is_stringy($value) )
    {
      try
      {
        $out_string = strval($value);
      }
      catch (Exception $e)
      {
        //deliberately ignore any (hopefully not) remaining exceptions in string conversion
      }
    }
    return $out_string;
  }


  public static function armored_from_separated_string(string $separated_string) : string
  {
    $separated_string = str_replace(",", "|", $separated_string) ;
    $separated_string = str_replace(";", "~", $separated_string) ;

    return $separated_string;
  }


  public static function array_from_channel_string(string $channel_string) : array
  {
    $channel_array = [];
    $channel_string_array = explode(";", $channel_string);
    foreach($channel_string_array as $channel_string)
    {
      if (is_numeric($channel_string)) $channel_array[] = intval($channel_string);
    }
    return $channel_array;
  }


  public static function sql_list_from_channel_string(string $channel_string) : string
  {
    return implode(',', array_from_channel_string($channel_string));
  }

}
