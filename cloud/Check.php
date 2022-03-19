<?php declare(strict_types=1);


class Check
{


  public static function image_mime_type($imagedata)
  {
    $imagemimetypes = array(
      "jpg" => "FFD8",
      "png" => "89504E470D0A1A0A",
      "gif" => "474946",
      "bmp" => "424D",
      "tiff" => "4949",
      "tiff" => "4D4D",
      "mp4" => "6674797069736F6D",
      "3gp" => "000000186674797033677034"
    );

    foreach ($imagemimetypes as $mime => $hexbytes)
    {
      $bytes = get_bytes_from_hex_string($hexbytes);
      if (substr($imagedata, 0, strlen($bytes)) == $bytes) return $mime;
    }

    return NULL;

  }


}
