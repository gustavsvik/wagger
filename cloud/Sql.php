<?php declare(strict_types=1);


include_once("CheckIf.php");
include_once("DbIni.php");



class Sql //extends mysqli
{
  private static string|null $server_name = DbIni::SERVERNAME;
  private static string|null $user_name = DbIni::USERNAME;
  private static string|null $password = DbIni::PASSWORD;
  private static string|null $db_name = DbIni::DBNAME;

  public function __construct (string|null $server_name = NULL, string|null $user_name = NULL, string|null $password = NULL, string|null $db_name = NULL)
  {
    self::$server_name = $server_name ?? self::$server_name;
    self::$user_name = $user_name ?? self::$user_name;
    self::$password = $password ?? self::$password;
    self::$db_name = $db_name ?? self::$db_name;

    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    try
    {
      $this->connection = new mysqli(self::$server_name , self::$user_name, self::$password, self::$db_name, 3306);
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
