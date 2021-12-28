<?php


include_once("../GetSafe.php");


$id_range = NULL;
$table_label = NULL;
$new_partition_name_date = NULL;
$new_partition_timestamp = NULL;
$oldest_kept_partition_name_date = NULL;

$id_range = strval(GetSafe::post("id_range", "NULL"));
$table_label = strval(GetSafe::post("table_label", "none"));
$new_partition_name_date = strval(GetSafe::post('new_partition_name_date', '19700101')) ;
$new_partition_timestamp = intval(GetSafe::post('new_partition_timestamp', 0)) ;
$oldest_kept_partition_name_date = strval(GetSafe::post('oldest_kept_partition_name_date', '19700101')) ;
