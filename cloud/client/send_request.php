<?php


include("../db_ini.php");
include("../utils.php");
include("header.php");

//$delete_horizon = 3600; // = $duration;

if ($data_end > 0)
{

  $conn = new mysqli($servername, $username, $password, $dbname);
  if (mysqli_connect_errno())
  {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
  }

  if ($start_time == -9999)
  {
    if ($end_time == -9999)
    {
      $end_time = intval(time()); // - $duration*$unit;
    }
    $end_time = $end_time - $end_time % $unit;
    $start_time = $end_time - $duration*$unit;
  }

  $points_range = range($start_time, $end_time, $unit);

  $points_range_string = " (";
  foreach ($points_range as $point)
  {
    $points_range_string .= strval($point);
    if ($point < $end_time) $points_range_string .= ",";
  }
  $points_range_string .= ")";

  while ($channel_start < $data_end)
  {
    $channel_end = strpos($channels, ';', $channel_start);
    $channel_string = mb_substr($channels, $channel_start, $channel_end-$channel_start);
    $channel = intval($channel_string);
    $sql_delete = "DELETE FROM " . $acquired_data_table_name . " WHERE CHANNEL_INDEX=" . $channel_string . " AND TIMEDIFF(SYSDATE(), ADDED_TIMESTAMP)>" . strval($delete_horizon) . " AND STATUS IN (-1,0)";
    $conn->autocommit(FALSE);
    $conn->begin_transaction();
    $stmt=$conn->prepare($sql_delete);
    if(!$stmt->execute())
    {
      $conn->rollback();
      exit();
    }
    $stmt->close();
    $conn->commit();

    $existing_points_array = array();
    $sql_get_existing_points = "SELECT DISTINCT AD.ACQUIRED_TIME FROM " . $acquired_data_table_name . " AD WHERE AD.CHANNEL_INDEX=" . $channel_string . " AND AD.ACQUIRED_TIME IN" . $points_range_string;
    $existing_points = $conn->query($sql_get_existing_points);
    if ($existing_points->num_rows > 0)
    {
      while ($point_row = $existing_points->fetch_array(MYSQLI_NUM))
      {
        if (!is_null($point_row[0])) $existing_points_array[] = $point_row[0];
      }
    }

    $at_least_one_missing = FALSE;
    foreach ($points_range as $point)
    {
      if (in_array($point, $existing_points_array))
      {
      }
      else
      {
        $at_least_one_missing = TRUE;
      }
    }

    if ($at_least_one_missing)
    {
      $conn->autocommit(FALSE);
      $conn->begin_transaction();

      $missing_points_string = " ";

      foreach ($points_range as $point)
      {
        if (in_array($point, $existing_points_array))
        {
        }
        else
        {
          $stmt=$conn->prepare("INSERT INTO " . $acquired_data_table_name . " (ACQUIRED_TIME,CHANNEL_INDEX,ACQUIRED_VALUE,STATUS) VALUES (?,?,?,-1)");
          $stmt->bind_param('iid',$point,$channel,$value);

          if (!$stmt->execute())
          {
            $conn->rollback();
            exit();
          }
        }
      }

      $stmt->close();
      $conn->commit();

    }

    $channel_start = $channel_end+1;

  }

  $conn->close();

}


?>
