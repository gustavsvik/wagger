<?php declare(strict_types=1);


class Task
{

  public static function static_function($val)
  {
  }

  public function __construct (string|null $constructor_val = NULL)
  {
    self::$constructor_val = $constructor_val ?? self::$constructor_val;
  }

}
