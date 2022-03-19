<?php


include_once("CheckIf.php");
include_once("DbIni.php");



class MySql //extends mysqli
{

  public function __construct ($server_name = NULL, $user_name = NULL, $password = NULL, $db_name = NULL)
  {
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    try
    {
      $this->connection = new mysqli($server_name ?? DbIni::SERVERNAME, $user_name ?? DbIni::USERNAME, $password ?? DbIni::PASSWORD, $db_name ?? DbIni::DBNAME, 3306);
      $this->connection->set_charset('utf8');
      $this->connection->options(MYSQLI_OPT_INT_AND_FLOAT_NATIVE, 1);
      $this->connection->options(MYSQLI_OPT_CONNECT_TIMEOUT, 5);
    }
    catch (\mysqli_sql_exception $e)
    {
      throw new \mysqli_sql_exception($e->getMessage(), $e->getCode());
    }
  }


  public function close()
  {
    $this->connection->close();
  }

}
