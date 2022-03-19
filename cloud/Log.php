<?php declare(strict_types=1);


include_once("CheckIf.php");



class Log
{

  public static function debug($log_label, $log_var = "")
  {
    $logged_scripts = [];  // 'AcquiredRecordsApi.php', 'AcquiredRecordsSql.php', 'partition_database.php', 'get_own_pos_records.php', 'get_requested.php', 'send_request.php', 'set_requested.php', 'database.php', 'get_static_data.php', 'get_static_records_string.php', 'get_ais_data_records.php', 'update_static_data.php', 'update_devices.php', 'get_uploaded.php', 'get_host_data.php', 'server_time.php', 'network_time.php', 'update_static_data_client.php', 'contributed.php'
    if (count($logged_scripts) > 0)
    {
      $logfile = '/srv/wagger/cloud/client/images/debug.log';
      $trace = debug_backtrace();
      $caller = array_shift($trace);
      foreach($logged_scripts as $script_name)
      {
        $log_var_str = "";
        if (is_array($log_var)) $log_var_str = json_encode($log_var);
        else $log_var_str = Transform::to_string($log_var);  //if (CheckIf::is_stringy($log_var)) $log_var_str = strval($log_var);
        $log_str = strval( (is_null($log_var_str)) ? "NULL" : $log_var_str );
        if (strpos($caller['file'], $script_name) !== FALSE) error_log(gmdate('YmdHis') . ' ' . $caller['file'] . ', line ' . $caller['line'] . ': ' . $log_label . $log_str . PHP_EOL, 3, $logfile) ;
      }
    }
  }

}
