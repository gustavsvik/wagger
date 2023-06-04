<?php declare(strict_types=1);


include_once("Log.php") ;
include_once("Status.php") ;
include_once("AcquiredRecordsSql.php") ;


class ClientAcquiredRecordsSql extends AcquiredRecordsSql
{

  public function __construct (string|null $server_name = NULL, string|null $user_name = NULL, string|null $password = NULL, string|null $db_name = NULL)
  {
    parent::__construct($server_name, $user_name, $password, $db_name);
  }

/*
  public static function get_latest_channel_update_time(array|null $channel_array = [], Status|null $lowest_status = Status::FULFILLED) : int|null
  {
    return parent::get_latest_channel_update_time(channel_array: $channel_array, lowest_status: STATUS::FULFILLED);
  }
*/
}
