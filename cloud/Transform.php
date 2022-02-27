<?php


include_once("CheckIf.php");



class Transform
{

  public static function to_string($value, $default = "")
  {
    $out_string = $default;
    if ( CheckIf::is_stringy($value) )
    {
      try
      {
        $out_string = strval($value);
      }
      catch (Exception $e)
      {
      }
      return $out_string;
    }
  }


  public static function csv_to_armored_string($string_to_armor)
  {
    $string_to_armor = str_replace(",", "|", $string_to_armor) ;
    $string_to_armor = str_replace(";", "~", $string_to_armor) ;

    return $string_to_armor;
  }


}
