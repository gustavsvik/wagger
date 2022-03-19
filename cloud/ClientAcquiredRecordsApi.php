<?php declare(strict_types=1);


include_once("AcquiredRecordsApi.php") ;



class ClientAcquiredRecordsApi extends AcquiredRecordsApi
{
  protected static array|null $ACCESSIBLE_CHANNELS ;
  protected static array|null $CLEAR_REQUESTED_CHANNELS ;
  protected static array|null $ARMORED_BYTE_STRING_CHANNELS ;
  protected static int|null $UNRESTRICTED_CHANNELS_FROM ;

  public function __construct()
  {
    self::$ACCESSIBLE_CHANNELS = array_merge( range(17,32), range(97,112), [140,143,144,145,146,147,160,162,163,180,200,202,220], range(600,603), range(61010,61012), [168,169,170,171,148,172,173,152,153,154], [2000,2001,2002,2003], [99999] );
    self::$CLEAR_REQUESTED_CHANNELS = array_merge( range(17,32), range(97,112), [140,160,180,200,220], range(600,603), range(2000,2003) ) ;
    self::$ARMORED_BYTE_STRING_CHANNELS = array_merge( [1], range(144,145), [150,151,162,163,170,171,148,172,173,152,153,154], [99999] ) ;
    self::$UNRESTRICTED_CHANNELS_FROM = 20000;

    parent::__construct();
  }

}
