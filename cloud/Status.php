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
      static::REQUESTED => strval(static::REQUESTED->value),
      static::FULFILLED => strval(static::FULFILLED->value),
      static::STORED => strval(static::STORED->value),
      static::ARCHIVED => strval(static::ARCHIVED->value)
    };
  }


  public function int(): int
  {
    return match ($this)
    {
      static::REQUESTED => intval(static::REQUESTED->value),
      static::FULFILLED => intval(static::FULFILLED->value),
      static::STORED => intval(static::STORED->value),
      static::ARCHIVED => intval(static::ARCHIVED->value)
    };
  }


}
