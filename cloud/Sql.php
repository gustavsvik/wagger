<?php declare(strict_types=1);


include_once("CheckIf.php");
include_once("DbIni.php");



class Sql //extends mysqli
{
  private static string|null $server_name = DbIni::SERVERNAME;
  private static string|null $user_name = DbIni::USERNAME;
  private static string|null $password = DbIni::PASSWORD;
  private static string|null $db_name = DbIni::DBNAME;

  protected static MySQLi|null $connection = NULL;

  public function __construct (string|null $server_name = NULL, string|null $user_name = NULL, string|null $password = NULL, string|null $db_name = NULL)
  {
    static::$server_name = $server_name ?? static::$server_name;
    static::$user_name = $user_name ?? static::$user_name;
    static::$password = $password ?? static::$password;
    static::$db_name = $db_name ?? static::$db_name;

    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    try
    {
      static::$connection = new mysqli(static::$server_name , static::$user_name, static::$password, static::$db_name, 3306);
      static::$connection->set_charset('utf8');
      static::$connection->options(MYSQLI_OPT_INT_AND_FLOAT_NATIVE, 1);
      static::$connection->options(MYSQLI_OPT_CONNECT_TIMEOUT, 5);
    }
    catch (\mysqli_sql_exception $e)
    {
      throw new \mysqli_sql_exception($e->getMessage(), $e->getCode());
    }
  }


  public static function close()
  {
    static::$connection->close();
  }

}
