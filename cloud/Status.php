<?php declare(strict_types=1);

enum Status: int
{

  case REQUESTED = -1;
  case FULFILLED = 0;
  case STORED = 1;
  case ARCHIVED = 2;

  public function str(): string
  {
    return match ($this)
    {
      self::REQUESTED => strval(self::REQUESTED->value),
      self::FULFILLED => strval(self::FULFILLED->value),
      self::STORED => strval(self::STORED->value),
      self::ARCHIVED => strval(self::ARCHIVED->value)
    };
  }

}
