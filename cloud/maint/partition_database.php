<?php


include_once("../db_ini.php");
include_once("../utils.php");
include_once("../database.php");
include_once("header.php");


//$new_partition_name_date = NULL ;
//$new_partition_name_date = strval(getPost('new_partition_name_date', '19700101')) ;
debug_log('$new_partition_name_date: ', $new_partition_name_date);
//$new_partition_timestamp = NULL ;
//$new_partition_timestamp = intval(getPost('new_partition_timestamp', 0)) ;
debug_log('$new_partition_timestamp: ', $new_partition_timestamp);
//$oldest_kept_partition_name_date = NULL ;
//$oldest_kept_partition_name_date = strval(getPost('oldest_kept_partition_name_date', '19700101')) ;
debug_log('$oldest_kept_partition_name_date: ', $oldest_kept_partition_name_date);

/*
$conn = mysqli_init();
if (!$conn) die('mysqli_init failed');
if (!$conn->options(MYSQLI_OPT_CONNECT_TIMEOUT, 5)) die('Setting MYSQLI_OPT_CONNECT_TIMEOUT failed');
if (!$conn->real_connect($SERVERNAME, $USERNAME, $PASSWORD, $DBNAME)) die('Connect Error (' . mysqli_connect_errno() . ') ' . mysqli_connect_error());
*/
$conn = db_get_connection($SERVERNAME, $USERNAME, $PASSWORD, $DBNAME);

$sql_reorganize_partitions = "ALTER TABLE " . $DBNAME . "." . $ACQUIRED_DATA_TABLE_NAME . " REORGANIZE PARTITION acquired_time_max INTO ( PARTITION acquired_time_" . $new_partition_name_date . " VALUES LESS THAN (" . strval($new_partition_timestamp) . "), PARTITION acquired_time_max VALUES LESS THAN (MAXVALUE) )" ;

$conn->autocommit(FALSE);
$conn->begin_transaction();

debug_log('$sql_reorganize_partitions: ', $sql_reorganize_partitions);
$stmt = $conn->prepare($sql_reorganize_partitions);
if ($stmt)
{
  if(!$stmt->execute())
  {
    $conn->rollback();
    die();
  }
  $stmt->close();
}
$conn->commit();

$all_partition_date_strings = array() ;
$sql_get_all_date_partition_strings = "SELECT PARTITION_NAME FROM INFORMATION_SCHEMA.PARTITIONS WHERE TABLE_SCHEMA='" . $DBNAME . "' AND PARTITION_NAME IS NOT NULL AND LOWER(PARTITION_NAME)<>'acquired_time_max' ORDER BY PARTITION_NAME" ;

debug_log('$sql_get_all_date_partition_strings: ', $sql_get_all_date_partition_strings);
$results = $conn->query($sql_get_all_date_partition_strings);
if (is_object($results) && $results->num_rows > 0)
{
  while ($row = $results->fetch_array(MYSQLI_NUM))
  {
    if (!is_null($row[0])) $all_partition_date_strings[] = substr(strval($row[0]), -8) ;
  }
}

$conn->autocommit(FALSE);
$conn->begin_transaction();

foreach ($all_partition_date_strings as $partition_date_string)
{
  if ($partition_date_string < $oldest_kept_partition_name_date)
  {
    $sql_drop_old_partition = "ALTER TABLE " . $DBNAME . "." . $ACQUIRED_DATA_TABLE_NAME . " DROP PARTITION acquired_time_" . $partition_date_string ;

    debug_log('$sql_drop_old_partition: ', $sql_drop_old_partition);
    $stmt = $conn->prepare($sql_drop_old_partition);
    if ($stmt)
    {
      if (!$stmt->execute())
      {
        $conn->rollback();
        die();
      }
      $stmt->close();
    }
  }
}

$conn->commit();

$conn->close();
