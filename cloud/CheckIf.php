<?php declare(strict_types=1);


class CheckIf
{

  public static function is_stringy($val)
  {
    return (is_string($val) || is_numeric($val) || (is_object($val) && method_exists($val, '__toString')));
  }


  public static function is_iterable($var)
  {
    return (is_array($var) || $var instanceof Traversable);
  }

}
