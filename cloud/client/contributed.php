<?php

include("../utils.php");


$basedir = '/srv/wagger/cloud/client/images/';

$files = scandir($basedir);
sort($files);

//echo '<p>Contributed images</p>';

$file_data = [];

//$thumb_names = [];
//$image_names = [];
//$channels = [];
//$timestamps = [];

foreach($files as $file)
{
  $initial_char = mb_substr($file, 0, 1);
  $sixth_char = mb_substr($file, 5, 1);

  if ( in_array($initial_char, ["2","3","4","5","6","7","8"])  && $sixth_char === "_" )
  {
    $image_names[] = $file ;

    $channel_string = NULL;
    $timestamp_file_string = NULL;
    list($channel_string, $timestamp_file_string) = explode("_", $file);
    debug_log( 'channel_string: ', $channel_string );
    $extension = NULL;
    list($timestamp_string, $extension) = explode(".", $timestamp_file_string);
    debug_log( 'timestamp_string: ', $timestamp_string );

    $path_parts = pathinfo($basedir.$file);
    $thumb_path = $path_parts['dirname'] . '/' ;
    $thumb_name = 'thumb_' . $path_parts['basename'];

    try
    {
      $imagick = new Imagick();
      $file_handle = fopen($basedir.$file, 'a+');
      $imagick->readImageFile($file_handle);
      debug_log( '$basedir.$file :', $basedir.$file);
      $imagick->thumbnailImage(100, 0);
      $imagick->setImageFormat($extension);

      if (!file_exists($thumb_path . $thumb_name)) $imagick->writeImage($thumb_path . $thumb_name);

      //if (!is_null($thumb_name)) $thumb_names[] = $thumb_name ;
      //if (!is_null($channel_string)) $channels[] = $channel_string ;
      //if (!is_null($timestamp_string)) $timestamps[] = $timestamp_string ;

      $file_data[] = array('image_name' => $file, 'thumb_name' => $thumb_name, 'channel' => $channel_string, 'timestamp' => $timestamp_string);

      //$thumbnail = $imagick->getImageBlob();
      //echo '<a href="/client/images/' . $file . '">';
      //echo '<img border="20" alt="' . $file . '" src="data:image/jpg;base64,' . base64_encode($thumbnail) . '">';
      //echo '</a>';
      fclose($file_handle);
    }
    catch(Exception $e)
    {
      debug_log( '$e->getMessage(): ', $e->getMessage() );
      $file_data[] = array('image_name' => $file, 'thumb_name' => "thumb_unknown.png", 'channel' => $channel_string, 'timestamp' => $timestamp_string);
    }

  }
}

$timestamp_column = array_column($file_data, 'timestamp');
array_multisort($timestamp_column, SORT_DESC, $file_data);

header("Content-type: application/json");
$json_array = array('file_data' => $file_data) ;
echo json_encode($json_array);
