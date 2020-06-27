<?php


include ("network_time.php") ;

//$receive_timestamp = intval( microtime($get_as_float = TRUE) * 1000000 ) ;
$receive_timestamp = intval(network_time_get() * 1000000) ;

header("Content-type: application/json");

//$transmit_timestamp = intval( microtime($get_as_float = TRUE) * 1000000 ) ;
$transmit_timestamp = intval(network_time_get() * 1000000) ;

$json_array = array('receivetime' => $receive_timestamp, 'transmittime' => $transmit_timestamp);

echo json_encode($json_array);


?>
