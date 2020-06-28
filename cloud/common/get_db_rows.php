<?php


include("../db_ini.php");
include("../utils.php");

$id_range = NULL;
$id_range = strval(getPost("idrange", "NULL"));
$table_label = NULL;
$table_label = strval(getPost("tablelabel", "none"));

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_errno)
{
  printf("Connect failed: %s\n", mysqli_connect_error());
  exit();
}

$sql_request_channels = "SELECT * FROM t_" . strtolower($table_label);
if ($id_range !== "-9999") $sql_request_channels .= " C WHERE C." . strtoupper($table_label) . "_" . "UNIQUE_INDEX IN (" . $id_range . ")";

$ifp = fopen("/srv/wagger/cloud/client/images/test.txt", "wb"); 
fwrite($ifp, " table_name:" . $table_name);
fwrite($ifp, " id_range:" . $id_range);
fwrite($ifp, " sql_request_channels:" . $sql_request_channels);
fclose($ifp);

$rows_requested = $conn->query($sql_request_channels); 

if ($rows_requested->num_rows > 0) 
{
  while ($row = $rows_requested->fetch_assoc()) 
  {
    $rows[] = $row;
  }
}
else 
{
}

$conn->close();

header("Content-type: application/json");
$json_array = array("returnstring" => $rows);
echo json_encode($json_array);
