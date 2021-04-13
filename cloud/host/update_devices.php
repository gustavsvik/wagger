<?php


include("../header.php");
include("../db_ini.php");
include("../utils.php");
include("header.php");

//debug_log('$: ' . mb_substr($, 0, 100));

debug_log('$host_id: ' . $host_id);
debug_log('$hardware_id: ' . $hardware_id);
debug_log('$description: ' . $description);

$conn = mysqli_init();

if (!$conn) die('mysqli_init failed');
if (!$conn->options(MYSQLI_OPT_CONNECT_TIMEOUT, 5)) die('Setting MYSQLI_OPT_CONNECT_TIMEOUT failed');
if (!$conn->real_connect($SERVERNAME, $USERNAME, $PASSWORD, $DBNAME)) die('Connect Error (' . mysqli_connect_errno() . ') ' . mysqli_connect_error());

$conn->autocommit(FALSE);

$conn->begin_transaction();

$stmt = NULL;

debug_log('ctype_graph($description): ' . ctype_graph($description) );
if (ctype_graph($description))
{
  $stmt_string = "INSERT INTO t_device (HOST_INDEX, DEVICE_HARDWARE_ID, DEVICE_DESCRIPTION) VALUES (?,?,?) ON DUPLICATE KEY UPDATE HOST_INDEX = VALUES(HOST_INDEX), DEVICE_DESCRIPTION = VALUES(DEVICE_DESCRIPTION)";
  debug_log('$stmt_string: ' . $stmt_string);
  $stmt = $conn->prepare($stmt_string);
  $stmt->bind_param('sss', $host_id, $hardware_id, $description);
}
else
{
  $stmt_string = "INSERT INTO t_device (HOST_INDEX, DEVICE_HARDWARE_ID) VALUES (?,?) ON DUPLICATE KEY UPDATE HOST_INDEX = VALUES(HOST_INDEX)";
  debug_log('$stmt_string: ' . $stmt_string);
  $stmt = $conn->prepare($stmt_string);
  $stmt->bind_param('ss', $host_id, $hardware_id);
}

if(!$stmt->execute())
{
  $conn->rollback();
  die();
}
$stmt->close();

$conn->commit();

$conn->close();
