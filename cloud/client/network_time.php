<?php


  function network_time_get()
  {
    // Adapted from https://www.johnromanodorazio.com/ntptest.php

    /* Query an NTP time server on port 123 (SNTP protocol) : */
    $bit_max = 4294967296;
    $epoch_convert = 2208988800;
    $vn = 3;

    $servers = array('0.se.pool.ntp.org','1.se.pool.ntp.org','2.se.pool.ntp.org','3.se.pool.ntp.org') ;
    $server_count = count($servers);

    //see rfc5905, page 20
    //first byte
    //LI (leap indicator), a 2-bit integer. 00 for 'no warning'
    $header = '00';
    //VN (version number), a 3-bit integer.  011 for version 3
    $header .= sprintf('%03d', decbin($vn));
    //Mode (association mode), a 3-bit integer. 011 for 'client'
    $header .= '011';

    //construct the packet header, byte 1
    $request_packet = chr(bindec($header));

    //we'll use a for loop to try additional servers should one fail to respond
    $i = 0;
    for($i; $i < $server_count; $i++)
    {
      debug_log('udp://.$servers[$i]: ' . strval('udp://'.$servers[$i]));
      $socket = @fsockopen('udp://'.$servers[$i], 123, $err_no, $err_str, 1);

      if ($socket)
      {
        debug_log('$socket create successful');
        //add nulls to position 11 (the transmit timestamp, later to be returned as originate)
        //10 lots of 32 bits
        for ($j = 1; $j < 40; $j++)
        {
          $request_packet .= chr(0x0);
        }

        //the time our packet is sent from our server (returns a string in the form 'msec sec')
        $local_sent_explode = explode(' ', microtime());
        $local_sent = $local_sent_explode[1] + $local_sent_explode[0];

        //add 70 years to convert unix to ntp epoch
        $originate_seconds = $local_sent_explode[1] + $epoch_convert;

        //convert the float given by microtime to a fraction of 32 bits
        $originate_fractional = round($local_sent_explode[0] * $bit_max);

        //pad fractional seconds to 32-bit length
        $originate_fractional = sprintf('%010d', $originate_fractional);

        //pack to big endian binary string
        $packed_seconds = pack('N', $originate_seconds);
        $packed_fractional = pack("N", $originate_fractional);

        //add the packed transmit timestamp
        $request_packet .= $packed_seconds;
        $request_packet .= $packed_fractional;
        debug_log('$request_packet: ' . strval(bin2hex($request_packet)));
        if (fwrite($socket, $request_packet))
        {
          debug_log('fwrite($socket, $request_packet) successful');
          $data = NULL;
          stream_set_timeout($socket, 1);

          $response = fread($socket, 48);
          debug_log('$response: ' . strval(bin2hex($response)));

          //the time the response was received
          $local_received = microtime(true);
        }
        fclose($socket);

        if (strlen($response) == 48)
        {
          //the response was of the right length, assume it's valid and break out of the loop
          break;
        }
        else
        {
          debug_log('$response incorrect length!');
          if ($i == $server_count - 1)
          {
            //this was the last server on the list, so give up
            die('unable to establish a connection');
          }
        }
      }
      else
      {
        debug_log('$socket create unsuccessful');
        if ($i == $server_count-1)
        {
          //this was the last server on the list, so give up
          die('unable to establish a connection');
        }
      }
    }

    //unpack the response to unsiged lonng for calculations
    $unpack0 = unpack("N12", $response);

    //present as a decimal number
    $remote_received_seconds = sprintf('%u', $unpack0[9]) - $epoch_convert;
    $remote_transmitted_seconds = sprintf('%u', $unpack0[11]) - $epoch_convert;

    $remote_received_fraction = sprintf('%u', $unpack0[10]) / $bit_max;
    $remote_transmitted_fraction = sprintf('%u', $unpack0[12]) / $bit_max;

    $remote_received = $remote_received_seconds + $remote_received_fraction;
    $remote_transmitted = $remote_transmitted_seconds + $remote_transmitted_fraction;

    //calculations assume a symmetrical delay, fixed point would give more accuracy
    $delay = ( ($local_received - $local_sent) / 2 )  - ( $remote_transmitted - $remote_received );
    $delay_ms = round($delay * 1000) . ' ms';

    $server = $servers[$i];

    $ntp_time =  $remote_transmitted - $delay;

    return $ntp_time ;

  }
