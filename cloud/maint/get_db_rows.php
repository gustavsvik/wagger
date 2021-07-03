<?php


include("../db_ini.php");
include("../utils.php");
include("../database.php");

$id_range = NULL;
$id_range = strval(getPost("id_range", "NULL"));
$table_label = NULL;
$table_label = strval(getPost("table_label", "none"));

$conn = db_get_connection($SERVERNAME, $USERNAME, $PASSWORD, $DBNAME);

//$ifp = fopen("/srv/wagger/cloud/client/images/test.txt", "wb"); 
//fwrite($ifp, " table_name:" . $table_name);
//fwrite($ifp, " id_range:" . $id_range);
//fwrite($ifp, " sql_request_channels:" . $sql_request_channels);
//fclose($ifp);

$rows = db_get_full_rows($conn, "t_" . $table_label, explode(",", $id_range))

$conn->close();

header("Content-type: application/json");
$json_array = array("returnstring" => $rows);
echo json_encode($json_array);
