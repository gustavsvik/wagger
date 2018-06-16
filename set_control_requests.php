<?php


$data_string = NULL;

$data_string = strval(getPost('returnstring', ';,,,;'));


$servername = "mydb6.surf-town.net";
$username = "dannil1_daq";
$password = "2k8Y8!16";
$dbname = "dannil1_data_logging_db";

$conn = new mysqli($servername, $username, $password, $dbname);
if (mysqli_connect_errno())
{
  printf("Connect failed: %s\n", mysqli_connect_error());
  exit();
}
$conn->autocommit(FALSE);
$conn->begin_transaction();


$data_start = 0;
$data_end = strlen($data_string);
$channel_start = $data_start;

while ($channel_start < $data_end)
{
  $channel_end = strpos($data_string, ';', $channel_start);
  $channel_string = mb_substr($data_string, $channel_start, $channel_end-$channel_start);
  $channel = intval($channel_string);
  //echo "channel";  
  //echo $channel;

  $points_start = $channel_end+1;
  $points_end = strpos($data_string, ';', $points_start);
  $points_string = mb_substr($data_string, $points_start, $points_end-$points_start);

  while ($points_start < $points_end)
  {
    $timestamp_start = $points_start;
    $timestamp_end = strpos($data_string, ",", $timestamp_start);
    $timestamp_string = mb_substr($data_string, $timestamp_start, $timestamp_end-$timestamp_start);
    $timestamp = intval($timestamp_string);
    //echo "timestamp";  
    //echo $timestamp;
    $value_start = $timestamp_end+1;
    $value_end = strpos($data_string, ",", $value_start);
    $value_string = mb_substr($data_string, $value_start, $value_end-$value_start);
    $value = doubleval($value_string);
    //echo "value";
    //echo $value;
    $subsamples_start = $value_end+1;
    $subsamples_end = strpos($data_string, ",", $subsamples_start);
    $subsamples_string = mb_substr($data_string, $subsamples_start, $subsamples_end-$subsamples_start);
    //echo "subsamples_string";
    //echo $subsamples_string;
    $base64_start = $subsamples_end+1;
    $base64_end = strpos($data_string, ",", $base64_start);
    $base64_string = mb_substr($data_string, $base64_start, $base64_end-$base64_start);
    //echo "base64_string";
    //echo $base64_string;


    $stmt=$conn->prepare("UPDATE T_ACQUIRED_DATA SET ACQUIRED_VALUE=?,ACQUIRED_SUBSAMPLES=?,ACQUIRED_BASE64=?,STATUS=0 WHERE CHANNEL_INDEX=? AND ACQUIRED_TIME=? AND STATUS=-1");
    $stmt->bind_param('sssss',$value,$subsamples_string,$base64_string,$channel,$timestamp);
    if(!$stmt->execute())
    {
      $conn->rollback();
      exit();
    }

    $points_start = $base64_end+1;
  }

  $channel_start = $points_end+1;
}


$stmt->close();
$conn->commit();
$conn->close();


//print_r($return_array);

function getPost($key, $default) 
{
  if (isset($_POST[$key]))
    return $_POST[$key];
  return $default;
}


?>