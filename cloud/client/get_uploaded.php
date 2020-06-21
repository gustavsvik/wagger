<?php


include("../db_ini.php");
include("../utils.php");
include("header.php");

$receive_timestamp = intval( microtime($get_as_float = TRUE) * 1000000 ) ;

$image_dir = 'images';

$select_all = FALSE;
if ($duration === -9999) $select_all = TRUE;

if ($data_end > 0)
{

  $conn = mysqli_init();

  if (!$conn) 
  {
    die('mysqli_init failed');
  }
  if (!$conn->options(MYSQLI_OPT_CONNECT_TIMEOUT, 5)) 
  {
    die('Setting MYSQLI_OPT_CONNECT_TIMEOUT failed');
  }
  if (!$conn->real_connect($servername, $username, $password, $dbname)) 
  {
    die('Connect Error (' . mysqli_connect_errno() . ') ' . mysqli_connect_error());
  }

  $conn->autocommit(FALSE);

  $return_string = "";
  $base64_string = "";

  while ($channel_start < $data_end)
  {
    $channel_end = strpos($channels, ';', $channel_start);
    $channel_string = mb_substr($channels, $channel_start, $channel_end-$channel_start);
    $channel = intval($channel_string);
    
    if ($start_time === -9999)
    {
      if ($end_time === -9999)
      {
        $sql_latest_available = "SELECT MAX(AD.ACQUIRED_TIME) FROM " . $acquired_data_table_name . " AD WHERE AD.CHANNEL_INDEX = " . $channel_string;
        $sql_latest_available .= " AND AD.STATUS>=" . strval($lowest_status);

        $latest_available = $conn->query($sql_latest_available);
        if ($latest_available->num_rows > 0) 
        {
          if ($latest_row = $latest_available->fetch_array(MYSQLI_NUM)) 
          {
            if (!is_null($latest_row[0])) $latest_point_time = intval($latest_row[0]);
          }
        } 
        else 
        {                 
        }
        if (!is_null($latest_point_time)) $end_time = $latest_point_time;
      }
      $start_time = $end_time ;
      if (!$select_all) $start_time -= $duration*$unit; 
    }

    $points_range = range($start_time, $end_time, $unit);

    $points_range_string = "(";
    foreach ($points_range as $point) 
    {
      $points_range_string .= "'" . strval($point) . "'";
      if ($point < $end_time) $points_range_string .= ",";
    }
    $points_range_string .= ")";

    $return_string .= $channel_string . ";";

    $sql_get_available_values = "SELECT DISTINCT AD.ACQUIRED_TIME,AD.ACQUIRED_VALUE,AD.ACQUIRED_SUBSAMPLES,AD.ACQUIRED_BASE64 FROM " . $acquired_data_table_name . " AD WHERE AD.CHANNEL_INDEX=" . $channel_string ;
    if (!$select_all) $sql_get_available_values .= " AND AD.ACQUIRED_TIME IN " . $points_range_string ;
    $sql_get_available_values .= " AND AD.STATUS>=" . strval($lowest_status);
    
    $available_values = $conn->query($sql_get_available_values);

    if ($available_values->num_rows > 0) 
    {
      while ($value_row = $available_values->fetch_array(MYSQLI_NUM)) 
      {
        $time_string = "";
        if (!is_null($value_row[0])) $time_string = strval($value_row[0]);
        $value_string = "";
        if (!is_null($value_row[1])) $value_string = strval($value_row[1]);
        $subsample_string = "";
        $base64_string = "";
        if (!is_null($value_row[3])) $base64_string = strval($value_row[3]);
        $return_string .= $time_string . "," . $value_string . "," . $subsample_string . "," . "," ; // . $base64_string ;
        if (strlen($base64_string) > 0)
        {
          $image_filename = $image_dir . "/" . $channel_string . "_" . strval($value_row[0]) . ".jpg";
          $ifp = fopen($image_filename, 'wb'); 
          fwrite($ifp, base64_decode($base64_string) );
          fclose($ifp);
          copy($image_filename, $image_dir . "/" . $channel_string . ".jpg");
        }
      }
    } 
    else 
    {
    }

    $return_string .= ";";

    $channel_start = $channel_end+1;

    $file_pattern = $image_dir . "/" . $channel_string . "_*";
    $files = glob($file_pattern);
    $num_files = count($files);
    foreach($files as $file)
    {
      $complete_filename = $file ;
      if(is_file($complete_filename) && $num_files > 20) 
      {
        unlink($complete_filename);
        --$num_files;
      }
    }
  }

  $conn->close();

}

$transmit_timestamp = intval( microtime($get_as_float = TRUE) * 1000000 ) ;

header("Content-type: application/json");
$json_array = array('returnstring' => $return_string, 'receivetime' => $receive_timestamp, 'transmittime' => $transmit_timestamp);
echo json_encode($json_array);


?>
