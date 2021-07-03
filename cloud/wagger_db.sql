-- MySQL dump 10.13  Distrib 5.5.62, for Win64 (AMD64)
--
-- Host: 127.0.0.1    Database: wagger_db
-- ------------------------------------------------------
-- Server version	5.5.5-10.5.10-MariaDB-1:10.5.10+maria~stretch

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `t_acquired_data`
--

DROP TABLE IF EXISTS `t_acquired_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_acquired_data` (
  `ACQUIRED_DATA_UNIQUE_INDEX` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `CHANNEL_INDEX` int(11) unsigned NOT NULL,
  `ACQUIRED_TIME` int(11) unsigned NOT NULL,
  `ACQUIRED_MICROSECS` mediumint(8) unsigned DEFAULT NULL,
  `ACQUIRED_VALUE` double DEFAULT NULL,
  `ACQUIRED_TEXT` mediumtext DEFAULT NULL,
  `ACQUIRED_BYTES` mediumblob DEFAULT NULL,
  `ADDED_TIMESTAMP` timestamp NULL DEFAULT current_timestamp(),
  `UPDATED_TIMESTAMP` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `STATUS` tinyint(4) DEFAULT -1,
  PRIMARY KEY (`ACQUIRED_TIME`,`CHANNEL_INDEX`),
  KEY `ACQUIRED_TIME_CHANNEL_INDEX_IDX` (`ACQUIRED_TIME`,`CHANNEL_INDEX`),
  KEY `CHANNEL_INDEX_STATUS_IDX` (`CHANNEL_INDEX`,`STATUS`),
  KEY `ADDED_TIMESTAMP_CHANNEL_INDEX_STATUS_IDX` (`ADDED_TIMESTAMP`,`CHANNEL_INDEX`,`STATUS`),
  KEY `UNIQUE_INDEX_IDX` (`ACQUIRED_DATA_UNIQUE_INDEX`)
) ENGINE=InnoDB AUTO_INCREMENT=238144870 DEFAULT CHARSET=utf8
 PARTITION BY RANGE (`ACQUIRED_TIME`)
(PARTITION `acquired_time_20210623` VALUES LESS THAN (1624492800) ENGINE = InnoDB,
 PARTITION `acquired_time_20210624` VALUES LESS THAN (1624579200) ENGINE = InnoDB,
 PARTITION `acquired_time_20210625` VALUES LESS THAN (1624665600) ENGINE = InnoDB,
 PARTITION `acquired_time_20210626` VALUES LESS THAN (1624752000) ENGINE = InnoDB,
 PARTITION `acquired_time_20210627` VALUES LESS THAN (1624838400) ENGINE = InnoDB,
 PARTITION `acquired_time_20210628` VALUES LESS THAN (1624924800) ENGINE = InnoDB,
 PARTITION `acquired_time_20210629` VALUES LESS THAN (1625011200) ENGINE = InnoDB,
 PARTITION `acquired_time_20210630` VALUES LESS THAN (1625097600) ENGINE = InnoDB,
 PARTITION `acquired_time_20210701` VALUES LESS THAN (1625184000) ENGINE = InnoDB,
 PARTITION `acquired_time_20210702` VALUES LESS THAN (1625270400) ENGINE = InnoDB,
 PARTITION `acquired_time_20210703` VALUES LESS THAN (1625356800) ENGINE = InnoDB,
 PARTITION `acquired_time_max` VALUES LESS THAN MAXVALUE ENGINE = InnoDB);
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

--
-- Table structure for table `t_accumulated_data`
--

DROP TABLE IF EXISTS `t_accumulated_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_accumulated_data` (
  `ACCUMULATED_DATA_UNIQUE_INDEX` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `CHANNEL_INDEX` smallint(5) unsigned DEFAULT NULL,
  `ACCUMULATED_BIN_END_TIME` int(11) unsigned DEFAULT NULL,
  `ACCUMULATED_BIN_SIZE` mediumint(8) unsigned DEFAULT NULL,
  `ACCUMULATED_NO_OF_SAMPLES` mediumint(8) unsigned DEFAULT NULL,
  `ACCUMULATED_VALUE` double DEFAULT NULL,
  `ACCUMULATED_TEXT` mediumtext DEFAULT NULL,
  `ACCUMULATED_BYTES` mediumblob DEFAULT NULL,
  PRIMARY KEY (`ACCUMULATED_DATA_UNIQUE_INDEX`),
  KEY `CHANNEL_INDEX_ACCUMULATED_BIN_END_TIME_ACCUMULATED_BIN_SIZE_IDX` (`CHANNEL_INDEX`,`ACCUMULATED_BIN_END_TIME`,`ACCUMULATED_BIN_SIZE`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_accumulated_data`
--

LOCK TABLES `t_accumulated_data` WRITE;
/*!40000 ALTER TABLE `t_accumulated_data` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_accumulated_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_device`
--

DROP TABLE IF EXISTS `t_device`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_device` (
  `DEVICE_UNIQUE_INDEX` int(11) unsigned NOT NULL,
  `DEVICE_HARDWARE_ID` varchar(200) NOT NULL,
  `DEVICE_TEXT_ID` varchar(200) DEFAULT NULL,
  `DEVICE_ADDRESS` varchar(200) DEFAULT NULL,
  `DEVICE_DESCRIPTION` varchar(2000) DEFAULT NULL,
  `DEVICE_TIME` int(11) unsigned DEFAULT NULL,
  `DEVICE_ADDED_TIMESTAMP` timestamp NULL DEFAULT current_timestamp(),
  `DEVICE_UPDATED_TIMESTAMP` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `DEVICE_STATUS` tinyint(4) DEFAULT -1,
  `HOST_INDEX` int(11) unsigned DEFAULT 0,
  PRIMARY KEY (`DEVICE_HARDWARE_ID`),
  KEY `t_device_DEVICE_TIME_IDX` (`DEVICE_TIME`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_device`
--

LOCK TABLES `t_device` WRITE;
/*!40000 ALTER TABLE `t_device` DISABLE KEYS */;
INSERT INTO `t_device` VALUES (0,'0',NULL,NULL,'No specified device',NULL,'2021-06-19 18:13:18',NULL,NULL,0),(1,'1',NULL,NULL,'NI cDAQ-9188 main chassis (upper floor)',NULL,'2021-06-19 18:13:18',NULL,NULL,3),(2,'2',NULL,NULL,'NI cDAQ-9188 aux chassis (control room)',NULL,'2021-06-19 18:13:18',NULL,NULL,3),(4,'4',NULL,NULL,'Raspicam on rpi_heta_02',NULL,'2021-06-19 18:13:18',NULL,NULL,5),(5,'5',NULL,NULL,'USB camera on LAN gateway host',NULL,'2021-06-19 18:13:18',NULL,NULL,4),(6,'6',NULL,NULL,'Arduino on rpi_heta_02',NULL,'2021-06-19 18:13:18',NULL,NULL,5),(7,'7',NULL,NULL,'USB camera on storage/uplink host',NULL,'2021-06-19 18:13:18',NULL,NULL,1),(8,'8',NULL,NULL,'USB camera on rpi_heta_02',NULL,'2021-06-19 18:13:18',NULL,NULL,5),(9,'9',NULL,NULL,'PureThermal USB thermal camera on storage/uplink host',NULL,'2021-06-19 18:13:18',NULL,NULL,1);
/*!40000 ALTER TABLE `t_device` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_layout`
--

DROP TABLE IF EXISTS `t_layout`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_layout` (
  `LAYOUT_UNIQUE_INDEX` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `LAYOUT_TEXT_ID` varchar(50) DEFAULT NULL,
  `LAYOUT_DESCRIPTION` varchar(200) DEFAULT NULL,
  `HOST_INDEX` smallint(5) unsigned DEFAULT NULL,
  `LAYOUT_JSON` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`LAYOUT_JSON`)),
  PRIMARY KEY (`LAYOUT_UNIQUE_INDEX`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_layout`
--

LOCK TABLES `t_layout` WRITE;
/*!40000 ALTER TABLE `t_layout` DISABLE KEYS */;
INSERT INTO `t_layout` VALUES (0,NULL,NULL,NULL,NULL),(1,'00',NULL,7,'{\r\n\"disp_timeout\": 900,\r\n\"disp_viewport_size\": {\"w\": 1067, \"h\": 600},\r\n\"disp_override_font\": {\"filename\": \"arimo-regular.woff\", \"path\": \"/fonts/\"}\r\n}'),(2,'00',NULL,6,NULL),(3,'01',NULL,7,NULL),(4,'01',NULL,6,NULL),(5,'02',NULL,7,NULL),(6,'03',NULL,7,NULL),(7,'04',NULL,7,NULL),(8,'05',NULL,7,NULL),(9,'06',NULL,7,NULL);
/*!40000 ALTER TABLE `t_layout` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_display`
--

DROP TABLE IF EXISTS `t_display`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_display` (
  `DISPLAY_UNIQUE_INDEX` smallint(5) unsigned NOT NULL,
  `DISPLAY_TEXT_ID` varchar(50) DEFAULT NULL,
  `DISPLAY_DESCRIPTION` varchar(200) DEFAULT NULL,
  `DISPLAY_JSON` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`DISPLAY_JSON`)),
  PRIMARY KEY (`DISPLAY_UNIQUE_INDEX`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_display`
--

LOCK TABLES `t_display` WRITE;
/*!40000 ALTER TABLE `t_display` DISABLE KEYS */;
INSERT INTO `t_display` VALUES (0,NULL,NULL,'{\r\n    \"title\": \"Select display\",\r\n    \"show\": true\r\n}'),(1,NULL,NULL,'{\r\n    \"title\": \"Lab building front view\",\r\n    \"show\": true\r\n}'),(2,NULL,NULL,'{\r\n    \"title\": \"Water treatment plant (plan)\",\r\n    \"show\": true\r\n}'),(3,NULL,NULL,'{\r\n    \"title\": \"Maritime College\",\r\n    \"show\": true\r\n}'),(4,NULL,NULL,'{\r\n    \"title\": \"Shore Control Development Lab (live)\",\r\n    \"show\": true\r\n}'),(5,NULL,NULL,'{\r\n    \"title\": \"AIS Station Map (live)\",\r\n    \"show\": true\r\n}'),(6,NULL,NULL,'{\r\n    \"title\": \"Algae cultivation project\",\r\n    \"show\": true\r\n}'),(7,NULL,NULL,'{\r\n    \"title\": \"Condensing turbine (view)\",\r\n    \"show\": true\r\n}'),(8,NULL,NULL,'{\r\n    \"title\": \"Lesson in the heat pump lab\",\r\n    \"show\": true\r\n}'),(9,NULL,NULL,'{\r\n    \"title\": \"Weather station (view)\",\r\n    \"show\": true\r\n}'),(10,NULL,NULL,'{\r\n    \"title\": \"Solar energy measurements\",\r\n    \"show\": true\r\n}'),(11,NULL,NULL,'{\r\n    \"title\": \"OpenCPN screen (live)\",\r\n    \"show\": true\r\n}'),(12,NULL,NULL,'{\r\n    \"title\": \"Heat pump installation\",\r\n    \"show\": true\r\n}'),(13,NULL,NULL,'{\r\n    \"title\": \"AIS display (live)\",\r\n    \"show\": true\r\n}'),(14,NULL,NULL,'{\r\n    \"title\": \"Precision Barometer (view)\",\r\n    \"show\": true\r\n}'),(15,NULL,NULL,'{\r\n    \"title\": \"Solar power test setup\",\r\n    \"show\": true\r\n}'),(16,NULL,NULL,'{\r\n    \"title\": \"Heat pump test setups\",\r\n    \"show\": true\r\n}'),(17,NULL,NULL,'{\r\n    \"title\": \"Valmet DNA view (live)\",\r\n    \"show\": true\r\n}'),(18,NULL,NULL,'{\r\n    \"title\": \"Lesson in main boiler hall\",\r\n    \"show\": true\r\n}'),(19,NULL,NULL,'{\r\n    \"title\": \"Solar collector installation\",\r\n    \"show\": true\r\n}'),(20,NULL,NULL,'{\r\n    \"title\": \"Electrical loads (live)\",\r\n    \"show\": true\r\n}');
/*!40000 ALTER TABLE `t_display` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_screen`
--

DROP TABLE IF EXISTS `t_screen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_screen` (
  `SCREEN_UNIQUE_INDEX` smallint(5) unsigned NOT NULL,
  `SCREEN_TEXT_ID` varchar(50) DEFAULT NULL,
  `SCREEN_DESCRIPTION` varchar(200) DEFAULT NULL,
  `SCREEN_JSON` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`SCREEN_JSON`)),
  PRIMARY KEY (`SCREEN_UNIQUE_INDEX`),
  CONSTRAINT `json_check` CHECK (json_valid(`SCREEN_JSON`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_screen`
--

LOCK TABLES `t_screen` WRITE;
/*!40000 ALTER TABLE `t_screen` DISABLE KEYS */;
INSERT INTO `t_screen` VALUES (0,NULL,'','      {\r\n        \"label\": \"View\",\r\n        \"imgs\":\r\n        [\r\n          { \"file\": \"0.png\", \"dim\": \"source\", \"disp\": {\"h\": 480, \"pos\": \"center\"} }\r\n        ],\r\n        \"time\": null,\r\n        \"channels\": [],\r\n        \"img_channels\": [],\r\n        \"ctrl_channels\": []\r\n      }'),(1,NULL,'','      {\r\n        \"label\": \"View\",\r\n        \"imgs\": \r\n        [\r\n          { \"file\": \"11.png\", \"dim\": \"source\", \"disp\": {\"h\": 480, \"pos\": \"center\"} }\r\n        ],\r\n        \"time\": null,\r\n        \"channels\": [],\r\n        \"img_channels\": [],\r\n        \"ctrl_channels\": []\r\n      }'),(2,NULL,'','      {\r\n        \"label\": \"View\",\r\n        \"imgs\": \r\n        [\r\n          { \"file\": \"4.jpg\", \"dim\": \"source\", \"disp\": {\"h\": 600, \"pos\": \"center\"} }\r\n        ],\r\n        \"time\": { \"label\": \"\", \"val\": 0, \"str_val\": \"Retrieving data...\", \"bins\": 10, \"bin_size\": 1, \"disp\": {\"size\": 12, \"pos\": {\"x\": 5, \"y\": 10}, \"col\": {\"r\": 255, \"g\": 0, \"b\": 0, \"a\": 255}, \"bgcol\": {\"r\": 0, \"g\": 0, \"b\": 0, \"a\": 200} } },\r\n        \"channels\":\r\n        [\r\n          { \"index\": 97, \"show\": true, \"label\": \"Makeup water conductivity\", \"str_val\": \"Retrieving data...\", \"val\": -9999.0, \"scale\": 1.0e6, \"unit\": \"\\u03BCS\", \"disp\": {\"len\": 5, \"size\": 12, \"pos\": {\"x\": 95, \"y\": 315}, \"col\": {\"r\": 255, \"g\": 0, \"b\": 0, \"a\": 255}, \"bgcol\": {\"r\": 0, \"g\": 0, \"b\": 0, \"a\": 200}} }\r\n        ],\r\n        \"img_channels\": [],\r\n        \"ctrl_channels\": []\r\n      }'),(3,NULL,'','      {\r\n        \"label\": \"View\",\r\n        \"imgs\": \r\n        [\r\n          { \"file\": \"9.png\", \"dim\": \"source\", \"disp\": {\"h\": 480, \"pos\": \"center\"} }\r\n        ],\r\n        \"time\": null,\r\n        \"channels\": [],\r\n        \"img_channels\": [],\r\n        \"ctrl_channels\": []\r\n      }'),(4,NULL,'','      {\r\n        \"label\": \"View\",\r\n        \"imgs\": [],\r\n        \"time\": { \"label\": \"\", \"val\": 0, \"str_val\": \"Retrieving data...\", \"bins\": 10, \"bin_size\": 1, \"disp\": {\"size\": 14, \"pos\": {\"x\": 5, \"y\": 10}, \"col\": {\"r\": 255, \"g\": 255, \"b\": 255, \"a\": 255}, \"bgcol\": {\"r\": 255, \"g\": 0, \"b\": 0, \"a\": 127} } },\r\n        \"channels\": [],\r\n        \"img_channels\":\r\n        [\r\n          { \"index\": 180, \"show\": true, \"label\": \"\", \"ext\": \"jpg\", \"dim\": \"source\", \"disp\": {\"h\": 480, \"pos\": \"center\"} }\r\n        ],\r\n        \"ctrl_channels\": []\r\n      }'),(5,NULL,'','      {\r\n        \"label\": \"View\",\r\n        \"imgs\": [],\r\n        \"time\": { \"label\": \"\", \"val\": 0, \"str_val\": \"Retrieving data...\", \"bins\": 10, \"bin_size\": 1, \"disp\": {\"size\": 12, \"pos\": {\"x\": 10, \"y\": 10}, \"col\": {\"r\": 255, \"g\": 0, \"b\": 0, \"a\": 255}, \"bgcol\": {\"r\": 127, \"g\": 127, \"b\": 127, \"a\": 127} } },\r\n        \"channels\": [],\r\n        \"img_channels\":\r\n        [\r\n          { \"index\": 602, \"show\": true, \"label\": \"\", \"ext\": \"jpg\", \"dim\": \"source\", \"disp\": {\"h\": 480, \"pos\": \"center\"} }\r\n        ],\r\n        \"ctrl_channels\": []\r\n      }'),(6,NULL,'','      {\r\n        \"label\": \"View\",\r\n        \"imgs\": \r\n        [\r\n          { \"file\": \"12.jpg\", \"dim\": \"source\", \"disp\": {\"h\": 480, \"pos\": \"center\"} }\r\n        ],\r\n        \"time\": null,\r\n        \"channels\": [],\r\n        \"img_channels\": [],\r\n        \"ctrl_channels\": []\r\n      }'),(7,NULL,'','      {\r\n        \"label\": \"View\",\r\n        \"imgs\": \r\n        [\r\n          { \"file\": \"1.png\", \"dim\": \"source\", \"disp\": {\"h\": 480, \"pos\": \"center\"} }\r\n        ],\r\n        \"time\": { \"label\": \"\", \"val\": 0, \"str_val\": \"Retrieving data...\", \"bins\": 10, \"bin_size\": 1, \"disp\": {\"size\": 14, \"pos\": {\"x\": 5, \"y\": 10}, \"col\": {\"r\": 255, \"g\": 255, \"b\": 255, \"a\": 255}, \"bgcol\": {\"r\": 255, \"g\": 0, \"b\": 0, \"a\": 127} } },\r\n        \"channels\":\r\n        [\r\n          { \"index\": 98, \"show\": true, \"label\": \"Cooling water temperature\", \"str_val\": \"Retrieving data...\", \"val\": -9999.0, \"scale\": 1.0, \"unit\": \"\\u00B0C\", \"disp\": {\"len\": 4, \"size\": 16, \"pos\": {\"x\": 210, \"y\": 380}, \"col\": {\"r\": 255, \"g\": 255, \"b\": 255, \"a\": 255}, \"bgcol\": {\"r\": 0, \"g\": 0, \"b\": 255, \"a\": 127}} }\r\n        ],\r\n        \"img_channels\": [],\r\n        \"ctrl_channels\": []\r\n      }'),(8,NULL,'','      {\r\n        \"label\": \"View\",\r\n        \"imgs\": \r\n        [\r\n          { \"file\": \"13.jpg\", \"dim\": \"source\", \"disp\": {\"h\": 480, \"pos\": \"center\"} }\r\n        ],\r\n        \"time\": null,\r\n        \"channels\": [],\r\n        \"img_channels\": [],\r\n        \"ctrl_channels\": []\r\n      }'),(9,NULL,'','      {\r\n        \"label\": \"View\",\r\n        \"imgs\":\r\n        [	\r\n          { \"file\": \"2.png\", \"dim\": \"source\", \"disp\": {\"h\": 600, \"pos\": \"center\"} }\r\n        ],\r\n        \"time\": { \"label\": \"\", \"val\": 0, \"str_val\": \"Retrieving data...\", \"bins\": 10, \"bin_size\": 1, \"disp\": {\"size\": 14, \"pos\": {\"x\": 5, \"y\": 10}, \"col\": {\"r\": 255, \"g\": 255, \"b\": 255, \"a\": 255}, \"bgcol\": {\"r\": 255, \"g\": 0, \"b\": 0, \"a\": 127} } },\r\n        \"channels\":\r\n        [\r\n          { \"index\": 21, \"show\": true, \"label\": \"Global insolation\", \"str_val\": \"Retrieving data...\", \"val\": -9999.0, \"scale\": 1.0e-0, \"unit\": \"W/m\\u00B2\", \"disp\": {\"len\": 5, \"size\": 16, \"pos\": { \"x\": 130, \"y\": 290 }, \"col\": {\"r\": 255, \"g\": 255, \"b\": 255, \"a\": 255}, \"bgcol\": {\"r\": 0, \"g\": 0, \"b\": 255, \"a\": 127}} },\r\n          { \"index\": 23, \"show\": true, \"label\": \"Ambient temperature\", \"str_val\": \"Retrieving data...\", \"val\": -9999.0, \"scale\": 2.0e-1, \"unit\": \"\\u00B0C\", \"disp\": {\"len\": 4 , \"size\": 16, \"pos\": { \"x\": 245, \"y\": 375 }, \"col\": {\"r\": 255, \"g\": 255, \"b\": 255, \"a\": 255}, \"bgcol\": {\"r\": 0, \"g\": 0, \"b\": 255, \"a\": 127}} }\r\n        ],\r\n        \"img_channels\": [],\r\n        \"ctrl_channels\": []\r\n      }'),(10,NULL,'','      {\r\n        \"label\": \"View\",\r\n        \"imgs\": \r\n        [\r\n          { \"file\": \"14.jpg\", \"dim\": \"source\", \"disp\": {\"h\": 480, \"pos\": \"center\"} }\r\n        ],\r\n        \"time\": null,\r\n        \"channels\": [],\r\n        \"img_channels\": [],\r\n        \"ctrl_channels\": []\r\n      }'),(11,NULL,'','      {\r\n        \"label\": \"View\",\r\n        \"imgs\": [],\r\n        \"time\": { \"label\": \"\", \"val\": 0, \"str_val\": \"Retrieving data...\", \"bins\": 10, \"bin_size\": 1, \"disp\": {\"size\": 12, \"pos\": {\"x\": 10, \"y\": 10}, \"col\": {\"r\": 255, \"g\": 0, \"b\": 0, \"a\": 255}, \"bgcol\": {\"r\": 127, \"g\": 127, \"b\": 127, \"a\": 127} } },\r\n        \"channels\": [],\r\n        \"img_channels\":\r\n        [\r\n          { \"index\": 601, \"show\": true, \"label\": \"\", \"ext\": \"jpg\", \"dim\": \"source\", \"disp\": {\"h\": 480, \"pos\": \"center\"} }\r\n        ],\r\n        \"ctrl_channels\": []\r\n      }'),(12,NULL,'','      {\r\n        \"label\": \"View\",\r\n        \"imgs\": \r\n        [\r\n          { \"file\": \"15.jpg\", \"dim\": \"source\", \"disp\": {\"h\": 480, \"pos\": \"center\"} }\r\n        ],\r\n        \"time\": null,\r\n        \"channels\": [],\r\n        \"img_channels\": [],\r\n        \"ctrl_channels\": []\r\n      }'),(13,NULL,'','      {\r\n        \"label\": \"View\",\r\n        \"imgs\": [],\r\n        \"time\": { \"label\": \"\", \"val\": 0, \"str_val\": \"Retrieving data...\", \"bins\": 10, \"bin_size\": 1, \"disp\": {\"size\": 14, \"pos\": {\"x\": 5, \"y\": 10}, \"col\": {\"r\": 255, \"g\": 255, \"b\": 255, \"a\": 255}, \"bgcol\": {\"r\": 255, \"g\": 0, \"b\": 0, \"a\": 127} } },\r\n        \"channels\": [],\r\n        \"img_channels\":\r\n        [\r\n          { \"index\": 160, \"show\": true, \"label\": \"\", \"ext\": \"jpg\", \"dim\": \"source\", \"disp\": {\"h\": 480, \"pos\": \"center\"} }\r\n        ],\r\n        \"ctrl_channels\": []\r\n      }'),(14,NULL,'','      {\r\n        \"label\": \"View\",\r\n        \"imgs\": [],\r\n        \"time\": { \"label\": \"\", \"val\": 0, \"str_val\": \"Retrieving data...\", \"bins\": 10, \"bin_size\": 1, \"disp\": {\"size\": 14, \"pos\": {\"x\": 5, \"y\": 10}, \"col\": {\"r\": 255, \"g\": 255, \"b\": 255, \"a\": 255}, \"bgcol\": {\"r\": 255, \"g\": 0, \"b\": 0, \"a\": 127} } },\r\n        \"channels\":\r\n        [\r\n          { \"index\": 142, \"show\": true, \"label\": \"Barometric pressure\", \"str_val\": \"Retrieving data...\", \"val\": -9999.0, \"scale\": 1.0, \"unit\": \"hPa\", \"disp\": {\"len\": 7, \"size\": 30, \"pos\": {\"x\": 360, \"y\": 240}, \"col\": {\"r\": 255, \"g\": 255, \"b\": 255, \"a\": 255}, \"bgcol\": {\"r\": 0, \"g\": 0, \"b\": 255, \"a\": 127}} }\r\n        ],\r\n        \"img_channels\":\r\n        [\r\n          { \"index\": 140, \"show\": true, \"label\": \"\", \"ext\": \"jpg\", \"dim\": \"source\", \"disp\": {\"h\": 480, \"pos\": \"center\"} }\r\n        ],\r\n        \"ctrl_channels\": []\r\n      }'),(15,NULL,'','      {\r\n        \"label\": \"View\",\r\n        \"imgs\": \r\n        [\r\n          { \"file\": \"16.jpg\", \"dim\": \"source\", \"disp\": {\"h\": 480, \"pos\": \"center\"} }\r\n        ],\r\n        \"time\": null,\r\n        \"channels\": [],\r\n        \"img_channels\": [],\r\n        \"ctrl_channels\": []\r\n      }'),(16,NULL,'','      {\r\n        \"label\": \"View\",\r\n        \"imgs\": \r\n        [\r\n          { \"file\": \"17.jpg\", \"dim\": \"source\", \"disp\": {\"h\": 480, \"pos\": \"center\"} }\r\n        ],\r\n        \"time\": null,\r\n        \"channels\": [],\r\n        \"img_channels\": [],\r\n        \"ctrl_channels\": []\r\n      }'),(17,NULL,'','      {\r\n        \"label\": \"View\",\r\n        \"imgs\": [],\r\n        \"time\": { \"label\": \"\", \"val\": 0, \"str_val\": \"Retrieving data...\", \"bins\": 10, \"bin_size\": 1, \"disp\": {\"size\": 12, \"pos\": {\"x\": 20, \"y\": 8}, \"col\": {\"r\": 255, \"g\": 255, \"b\": 255, \"a\": 255}, \"bgcol\": {\"r\": 255, \"g\": 0, \"b\": 0, \"a\": 127} } },\r\n        \"channels\": [],\r\n        \"img_channels\":\r\n        [\r\n          { \"index\": 600, \"show\": true, \"label\": \"\", \"ext\": \"jpg\", \"dim\": \"source\", \"disp\": {\"h\": 480, \"pos\": \"center\"} }\r\n        ],\r\n        \"ctrl_channels\": []\r\n      }'),(18,NULL,'','      {\r\n        \"label\": \"View\",\r\n        \"imgs\": \r\n        [\r\n          { \"file\": \"10.jpg\", \"dim\": \"source\", \"disp\": {\"h\": 480, \"pos\": \"center\"} }\r\n        ],\r\n        \"time\": null,\r\n        \"channels\": [],\r\n        \"img_channels\": [],\r\n        \"ctrl_channels\": []\r\n      }'),(19,NULL,'','      {\r\n        \"label\": \"View\",\r\n        \"imgs\": \r\n        [\r\n          { \"file\": \"18.png\", \"dim\": \"source\", \"disp\": {\"h\": 480, \"pos\": \"center\"} }\r\n        ],\r\n        \"time\": null,\r\n        \"channels\": [],\r\n        \"img_channels\": [],\r\n        \"ctrl_channels\": []\r\n      }'),(20,NULL,'','      {\r\n        \"label\": \"View\",\r\n        \"imgs\": [],\r\n        \"time\": { \"label\": \"\", \"val\": 0, \"str_val\": \"Retrieving data...\", \"bins\": 10, \"bin_size\": 1, \"disp\": {\"size\": 14, \"pos\": {\"x\": 5, \"y\": 10}, \"col\": {\"r\": 255, \"g\": 255, \"b\": 255, \"a\": 255}, \"bgcol\": {\"r\": 255, \"g\": 0, \"b\": 0, \"a\": 127} } },\r\n        \"channels\": \r\n        [\r\n          { \"index\": 98, \"show\": true, \"label\": \"Measured temperature\", \"str_val\": \"Retrieving data...\", \"val\": -9999.0, \"scale\": 1.0, \"unit\": \"\\u00B0C\", \"disp\": {\"len\": 4, \"size\": 30, \"pos\": {\"x\": 300, \"y\": 300}, \"col\": {\"r\": 0, \"g\": 255, \"b\": 0, \"a\": 255}, \"bgcol\": {\"r\": 255, \"g\": 0, \"b\": 255, \"a\": 127}} }\r\n        ],\r\n        \"img_channels\":\r\n        [\r\n          { \"index\": 160, \"show\": true, \"label\": \"\", \"ext\": \"jpg\", \"dim\": \"source\", \"disp\": {\"h\": 480, \"pos\": \"center\"} }\r\n        ],\r\n        \"ctrl_channels\": \r\n        [\r\n          { \"index\": 174, \"show\": true, \"label\": \"Start heater\", \"str_val\": \"Off\", \"val\": 0.0, \"min_str_val\": \"Off\", \"min_val\": 0.0, \"max_str_val\": \"On\", \"max_val\": 10.0, \"val_step\": 0.5, \"scale\": 1.0, \"unit\": \"\", \"disp\": {\"len\": 5, \"size\": 14, \"pos\": {\"x\": 10, \"y\": 30}, \"col\": {\"r\": 255, \"g\": 255, \"b\": 255, \"a\": 255}, \"bgcol\": {\"r\": 255, \"g\": 0, \"b\": 0, \"a\": 127}} },\r\n          { \"index\": 175, \"show\": true, \"label\": \"Temperature setpoint\", \"str_val\": \"\", \"val\": 0.0, \"min_str_val\": \"\", \"min_val\": -5.0, \"max_str_val\": \"\", \"max_val\": 10.0, \"val_step\": 0.5, \"scale\": 1.0, \"unit\": \"\\u00B0C\", \"disp\": {\"len\": 5, \"size\": 14, \"pos\": {\"x\": 170, \"y\": 30}, \"col\": {\"r\": 255, \"g\": 255, \"b\": 255, \"a\": 255}, \"bgcol\": {\"r\": 255, \"g\": 0, \"b\": 0, \"a\": 127}} },\r\n          { \"index\": 176, \"show\": true, \"label\": \"Controller P value\", \"str_val\": \"\", \"val\": 0.0, \"min_str_val\": \"\", \"min_val\": 0.0, \"max_str_val\": \"\", \"max_val\": 10.0, \"val_step\": 0.5, \"scale\": 1.0, \"unit\": \"\", \"disp\": {\"len\": 5, \"size\": 14, \"pos\": {\"x\": 320, \"y\": 30}, \"col\": {\"r\": 255, \"g\": 255, \"b\": 255, \"a\": 255}, \"bgcol\": {\"r\": 255, \"g\": 0, \"b\": 0, \"a\": 127}} },\r\n          { \"index\": 177, \"show\": true, \"label\": \"Controller I value\", \"str_val\": \"\", \"val\": 0.0, \"min_str_val\": \"\", \"min_val\": 0.0, \"max_str_val\": \"\", \"max_val\": 10.0, \"val_step\": 0.5, \"scale\": 1.0, \"unit\": \"\", \"disp\": {\"len\": 5, \"size\": 14, \"pos\": {\"x\": 470, \"y\": 30}, \"col\": {\"r\": 255, \"g\": 255, \"b\": 255, \"a\": 255}, \"bgcol\": {\"r\": 255, \"g\": 0, \"b\": 0, \"a\": 127}} },\r\n          { \"index\": 178, \"show\": true, \"label\": \"Controller D value\", \"str_val\": \"\", \"val\": 0.0, \"min_str_val\": \"\", \"min_val\": 0.0, \"max_str_val\": \"\", \"max_val\": 10.0, \"val_step\": 0.5, \"scale\": 1.0, \"unit\": \"\", \"disp\": {\"len\": 5, \"size\": 14, \"pos\": {\"x\": 620, \"y\": 30}, \"col\": {\"r\": 255, \"g\": 255, \"b\": 255, \"a\": 255}, \"bgcol\": {\"r\": 255, \"g\": 0, \"b\": 0, \"a\": 127}} }\r\n        ]\r\n      }');
/*!40000 ALTER TABLE `t_screen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_client_server`
--

DROP TABLE IF EXISTS `t_client_server`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_client_server` (
  `CLIENT_SERVER_UNIQUE_INDEX` smallint(5) unsigned NOT NULL,
  `CLIENT_SERVER_TEXT_ID` varchar(50) DEFAULT NULL,
  `CLIENT_SERVER_DESCRIPTION` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`CLIENT_SERVER_UNIQUE_INDEX`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_client_server`
--

LOCK TABLES `t_client_server` WRITE;
/*!40000 ALTER TABLE `t_client_server` DISABLE KEYS */;
INSERT INTO `t_client_server` VALUES (1,'109.74.8.89','Default WAN cloud gateway'),(2,'192.168.1.103','PC20843795 Energilabbet LAN cloud gateway');
/*!40000 ALTER TABLE `t_client_server` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_module`
--

DROP TABLE IF EXISTS `t_module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_module` (
  `MODULE_UNIQUE_INDEX` int(11) unsigned NOT NULL,
  `MODULE_HARDWARE_ID` varchar(200) NOT NULL,
  `MODULE_TEXT_ID` varchar(200) DEFAULT NULL,
  `MODULE_ADDRESS` varchar(200) DEFAULT NULL,
  `MODULE_DESCRIPTION` varchar(2000) DEFAULT NULL,
  `MODULE_TIME` int(11) unsigned DEFAULT NULL,
  `MODULE_STATUS` tinyint(4) DEFAULT -1,
  `DEVICE_INDEX` int(11) unsigned DEFAULT 0,
  PRIMARY KEY (`MODULE_HARDWARE_ID`),
  KEY `t_module_MODULE_TIME_IDX` (`MODULE_TIME`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_module`
--

LOCK TABLES `t_module` WRITE;
/*!40000 ALTER TABLE `t_module` DISABLE KEYS */;
INSERT INTO `t_module` VALUES (0,'0',NULL,NULL,'No module specified',NULL,0,0),(1,'1',NULL,NULL,NULL,NULL,1,1),(10,'10','VDM-08-031',NULL,'',NULL,1,12),(2,'2',NULL,NULL,NULL,NULL,2,1),(3,'3',NULL,NULL,NULL,NULL,3,1),(4,'4',NULL,NULL,NULL,NULL,4,1),(5,'5',NULL,NULL,NULL,NULL,1,2),(6,'6',NULL,NULL,NULL,NULL,2,2),(7,'7',NULL,NULL,NULL,NULL,3,2),(8,'8','VDM-01',NULL,NULL,NULL,1,10),(9,'9','VDM-08-031',NULL,NULL,NULL,2,10);
/*!40000 ALTER TABLE `t_module` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_port`
--

DROP TABLE IF EXISTS `t_port`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_port` (
  `PORT_UNIQUE_INDEX` smallint(5) unsigned NOT NULL,
  `PORT_TEXT_ID` varchar(50) DEFAULT NULL,
  `PORT_DESCRIPTION` varchar(200) DEFAULT NULL,
  `HOST_INDEX` smallint(5) unsigned DEFAULT NULL,
  `DEVICE_INDEX` smallint(5) unsigned DEFAULT NULL,
  PRIMARY KEY (`PORT_UNIQUE_INDEX`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_port`
--

LOCK TABLES `t_port` WRITE;
/*!40000 ALTER TABLE `t_port` DISABLE KEYS */;
INSERT INTO `t_port` VALUES (1,'169.254.254.254','cDAQ-9188 main chassis address',3,1),(2,'169.254.254.253','cDAQ-9188 aux chassis addres',3,2),(3,'video0','Raspicam on heta_rpi_01',2,3),(5,'0000.001a.0007.004.000.000.000.000.000','USB camera on WAN gateway host',1,10);
/*!40000 ALTER TABLE `t_port` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_channel`
--

DROP TABLE IF EXISTS `t_channel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_channel` (
  `CHANNEL_UNIQUE_INDEX` smallint(5) unsigned NOT NULL,
  `CHANNEL_SAMPLE_RATE` float unsigned DEFAULT NULL,
  `CHANNEL_MIN_VALUE` float DEFAULT NULL,
  `CHANNEL_MAX_VALUE` float DEFAULT NULL,
  `CHANNEL_FACTOR` float DEFAULT NULL,
  `CHANNEL_UNIT` varchar(50) DEFAULT NULL,
  `CHANNEL_TEXT_ID` varchar(50) DEFAULT NULL,
  `CHANNEL_DESCRIPTION` varchar(1000) DEFAULT NULL,
  `CHANNEL_FUNCTION` varchar(200) DEFAULT NULL,
  `CHANNEL_LOOKUP` varchar(2000) DEFAULT NULL,
  `CHANNEL_OFFSET` smallint(5) unsigned DEFAULT 0,
  `MODULE_INDEX` smallint(5) unsigned DEFAULT 0,
  `DEVICE_INDEX` smallint(5) unsigned DEFAULT 0,
  `HOST_INDEX` smallint(5) unsigned DEFAULT 0,
  PRIMARY KEY (`CHANNEL_UNIQUE_INDEX`),
  KEY `t_channels_t_modules_FK` (`MODULE_INDEX`),
  KEY `t_channels_t_hosts_FK` (`HOST_INDEX`),
  KEY `t_channels_t_devices_FK` (`DEVICE_INDEX`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_channel`
--

LOCK TABLES `t_channel` WRITE;
/*!40000 ALTER TABLE `t_channel` DISABLE KEYS */;
INSERT INTO `t_channel` VALUES (20,NULL,NULL,NULL,NULL,'\\u00B0C',NULL,'Cooling water temperature',NULL,NULL,20,5,0,0),(22,NULL,NULL,NULL,NULL,NULL,NULL,'Weather station excitatio',NULL,NULL,22,1,0,0),(23,NULL,NULL,NULL,NULL,NULL,NULL,'Weather station temperature sensor voltage',NULL,NULL,23,1,0,0),(97,NULL,NULL,NULL,NULL,NULL,NULL,'Makeup water conductivity',NULL,NULL,1,6,0,0),(140,NULL,NULL,NULL,NULL,NULL,NULL,'RPi HETA 01 Raspicam',NULL,NULL,0,0,3,0),(160,NULL,NULL,NULL,NULL,NULL,NULL,'RPi HETA 02 USB camera',NULL,NULL,0,0,7,0),(161,NULL,NULL,NULL,NULL,NULL,NULL,'RPi HETA 02 USB camera',NULL,NULL,0,0,8,0),(162,NULL,NULL,NULL,NULL,NULL,NULL,'Arduino AI0',NULL,NULL,0,0,6,0),(163,NULL,NULL,NULL,NULL,NULL,NULL,'Arduino AI1',NULL,NULL,0,0,6,0),(164,NULL,NULL,NULL,NULL,NULL,NULL,'Arduino AI2',NULL,NULL,0,0,6,0),(165,NULL,NULL,NULL,NULL,NULL,NULL,'Arduino AI3',NULL,NULL,0,0,6,0),(166,NULL,NULL,NULL,NULL,NULL,NULL,'Arduino AI4',NULL,NULL,0,0,6,0),(167,NULL,NULL,NULL,NULL,NULL,NULL,'Arduino AI5',NULL,NULL,0,0,6,0),(168,NULL,NULL,NULL,NULL,NULL,NULL,'Arduino DI2',NULL,NULL,0,0,6,0),(169,NULL,NULL,NULL,NULL,NULL,NULL,'Arduino DI4',NULL,NULL,0,0,6,0),(170,NULL,NULL,NULL,NULL,NULL,NULL,'Arduino DI7',NULL,NULL,0,0,6,0),(171,NULL,NULL,NULL,NULL,NULL,NULL,'Arduino DI8',NULL,NULL,0,0,6,0),(172,NULL,NULL,NULL,NULL,NULL,NULL,'Arduino DI12',NULL,NULL,0,0,6,0),(173,NULL,NULL,NULL,NULL,NULL,NULL,'Arduino DI13',NULL,NULL,0,0,6,0),(174,NULL,NULL,NULL,NULL,NULL,NULL,'Arduino ADO3',NULL,NULL,0,0,6,0),(175,NULL,NULL,NULL,NULL,NULL,NULL,'Arduino ADO5',NULL,NULL,0,0,6,0),(176,NULL,NULL,NULL,NULL,NULL,NULL,'Arduino ADO6',NULL,NULL,0,0,6,0),(177,NULL,NULL,NULL,NULL,NULL,NULL,'Arduino ADO9',NULL,NULL,0,0,6,0),(178,NULL,NULL,NULL,NULL,NULL,NULL,'Arduino ADO10',NULL,NULL,0,0,6,0),(179,NULL,NULL,NULL,NULL,NULL,NULL,'Arduino ADO11',NULL,NULL,0,0,6,0),(180,NULL,NULL,NULL,NULL,NULL,NULL,'Purethermal USB thermal camera',NULL,NULL,0,0,9,0),(600,NULL,NULL,NULL,NULL,NULL,NULL,'LAN gateway host screenshot',NULL,NULL,0,0,0,4),(10001,NULL,NULL,NULL,NULL,'\\u00B0C',NULL,'Weather station temperature','c23/c22','336.098,314.553,294.524,275.897,258.563,242.427,227.398,213.394,200.339,188.163,176.803,166.198,156.294,147.042,138.393,130.306,122.741,115.661,109.032,102.824,97.006,91.553,86.439,81.641,77.138,72.911,68.940,65.209,61.703,58.405,55.304,52.385,49.638,47.050,44.613,42.317,40.151,38.110,36.184,34.366,32.651,31.031,29.500,28.054,26.687,25.395,24.172,23.016,21.921,20.885,19.903,18.973,18.092,17.257,16.465,15.714,15.001,14.324,13.682,13.073,12.493,11.943,11.420,10.923,10.450,10.000,9.572,9.165,8.777,8.408,8.056,7.721,7.402,7.097,6.807,6.530,6.266,6.014,5.774,5.544,5.325,5.116,4.916,4.724,4.542,4.367,4.200,4.040,3.887,3.741,3.601',0,0,0,0),(10002,NULL,NULL,NULL,NULL,NULL,NULL,'Dome/feedwater level and superheat temperature camera image composite','c160[0 0 500 500 1000 0 720]&c180&c140','',0,0,0,0),(20000,NULL,NULL,NULL,NULL,NULL,'json','','','',0,10,0,0),(20001,NULL,NULL,NULL,NULL,NULL,'lon','','','',1,10,0,0),(20002,NULL,NULL,NULL,NULL,NULL,'lat','','','',2,10,0,0),(20003,NULL,NULL,NULL,NULL,NULL,'wspeed','','','',3,10,0,0),(49999,NULL,NULL,NULL,NULL,NULL,NULL,'','','',0,0,0,0);
/*!40000 ALTER TABLE `t_channel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_store_channel`
--

DROP TABLE IF EXISTS `t_store_channel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_store_channel` (
  `STORE_CHANNEL_UNIQUE_INDEX` smallint(5) unsigned NOT NULL,
  `STORE_CHANNEL_TEXT_ID` varchar(50) DEFAULT NULL,
  `STORE_CHANNEL_DESCRIPTION` varchar(1000) DEFAULT NULL,
  `TASK_INDEX` smallint(5) unsigned NOT NULL,
  `CHANNEL_INDEX` smallint(5) unsigned NOT NULL,
  `HOST_INDEX` smallint(5) unsigned NOT NULL,
  PRIMARY KEY (`STORE_CHANNEL_UNIQUE_INDEX`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_store_channel`
--

LOCK TABLES `t_store_channel` WRITE;
/*!40000 ALTER TABLE `t_store_channel` DISABLE KEYS */;
INSERT INTO `t_store_channel` VALUES (0,NULL,NULL,0,0,0),(1,NULL,NULL,2,97,1),(2,NULL,NULL,2,98,1),(3,NULL,NULL,2,99,1);
/*!40000 ALTER TABLE `t_store_channel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_host`
--

DROP TABLE IF EXISTS `t_host`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_host` (
  `HOST_UNIQUE_INDEX` int(11) unsigned NOT NULL,
  `HOST_HARDWARE_ID` varchar(200) NOT NULL,
  `HOST_TEXT_ID` varchar(200) DEFAULT NULL,
  `HOST_ADDRESS` varchar(200) DEFAULT NULL,
  `HOST_DESCRIPTION` varchar(2000) DEFAULT NULL,
  `HOST_TIME` int(11) unsigned DEFAULT NULL,
  `HOST_ADDED_TIMESTAMP` timestamp NULL DEFAULT current_timestamp(),
  `HOST_UPDATED_TIMESTAMP` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `HOST_STATUS` tinyint(4) DEFAULT -1,
  PRIMARY KEY (`HOST_HARDWARE_ID`),
  KEY `t_host_HOST_TIME_IDX` (`HOST_TIME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_host`
--

LOCK TABLES `t_host` WRITE;
/*!40000 ALTER TABLE `t_host` DISABLE KEYS */;
INSERT INTO `t_host` VALUES (0,'0','','','No specified host',NULL,'2021-05-20 14:41:50','2021-06-05 19:16:17',0),(1,'1','dogger','192.168.1.194','LAN edge storage and acquisition host',NULL,'2021-05-20 14:41:50','2021-06-05 19:16:17',0),(2,'2','rpi_heta_01','192.168.1.226','RPi HETA 01',NULL,'2021-05-20 14:41:50','2021-06-05 19:16:17',0),(3,'3','nidaq-daqc','192.168.1.193','NI CompactDAQ acquisition host',NULL,'2021-05-20 14:41:50','2021-06-05 19:16:17',0),(5,'5','rpi_heta_02','192.168.1.42','RPi HETA 02',NULL,'2021-05-20 14:41:50','2021-06-05 19:16:17',0),(6,'6','wagger','192.168.1.69','LAN cloud host (SCC)',NULL,'2021-05-20 14:41:50','2021-06-05 19:16:17',0),(4,'64-31-50-20-40-25','opener','192.168.1.103','LAN operator client (SCC lab)',NULL,'2021-05-20 14:41:50','2021-06-05 19:16:17',0),(7,'7','wagger','109.74.8.89','WAN cloud host (VPS)',NULL,'2021-05-20 14:41:50','2021-06-05 19:16:17',0);
/*!40000 ALTER TABLE `t_host` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_layout-display`
--

DROP TABLE IF EXISTS `t_layout-display`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_layout-display` (
  `LAYOUT-DISPLAY_UNIQUE_INDEX` smallint(5) unsigned NOT NULL,
  `LAYOUT-DISPLAY_TEXT_ID` varchar(50) DEFAULT NULL,
  `LAYOUT-DISPLAY_DESCRIPTION` varchar(200) DEFAULT NULL,
  `LAYOUT_INDEX` smallint(5) unsigned DEFAULT NULL,
  `DISPLAY_INDEX` smallint(5) unsigned DEFAULT NULL,
  PRIMARY KEY (`LAYOUT-DISPLAY_UNIQUE_INDEX`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_layout-display`
--

LOCK TABLES `t_layout-display` WRITE;
/*!40000 ALTER TABLE `t_layout-display` DISABLE KEYS */;
INSERT INTO `t_layout-display` VALUES (0,NULL,NULL,0,0),(1,NULL,NULL,1,0),(2,NULL,NULL,1,1),(3,NULL,NULL,1,2),(4,NULL,NULL,1,3),(5,NULL,NULL,1,4),(6,NULL,NULL,1,5),(7,NULL,NULL,1,6),(8,NULL,NULL,1,7),(9,NULL,NULL,1,8),(10,NULL,NULL,1,9),(11,NULL,NULL,1,10),(12,NULL,NULL,1,11),(13,NULL,NULL,1,12),(14,NULL,NULL,1,13),(15,NULL,NULL,1,14),(16,NULL,NULL,1,15),(17,NULL,NULL,1,16),(18,NULL,NULL,1,17),(19,NULL,NULL,1,18),(20,NULL,NULL,1,19),(21,NULL,NULL,1,20);
/*!40000 ALTER TABLE `t_layout-display` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_task`
--

DROP TABLE IF EXISTS `t_task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_task` (
  `TASK_UNIQUE_INDEX` smallint(5) unsigned NOT NULL,
  `TASK_TEXT_ID` varchar(50) DEFAULT NULL,
  `TASK_DESCRIPTION` varchar(200) DEFAULT NULL,
  `TASK_RATE` float unsigned DEFAULT NULL,
  `TASK_STATE` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`TASK_UNIQUE_INDEX`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_task`
--

LOCK TABLES `t_task` WRITE;
/*!40000 ALTER TABLE `t_task` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_display-screen`
--

DROP TABLE IF EXISTS `t_display-screen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_display-screen` (
  `DISPLAY-SCREEN_UNIQUE_INDEX` smallint(5) unsigned NOT NULL,
  `DISPLAY-SCREEN_TEXT_ID` varchar(50) DEFAULT NULL,
  `DISPLAY-SCREEN_DESCRIPTION` varchar(200) DEFAULT NULL,
  `DISPLAY_INDEX` smallint(5) unsigned DEFAULT NULL,
  `SCREEN_INDEX` smallint(5) unsigned DEFAULT NULL,
  PRIMARY KEY (`DISPLAY-SCREEN_UNIQUE_INDEX`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_display-screen`
--

LOCK TABLES `t_display-screen` WRITE;
/*!40000 ALTER TABLE `t_display-screen` DISABLE KEYS */;
INSERT INTO `t_display-screen` VALUES (0,NULL,NULL,0,0),(1,NULL,NULL,1,1),(2,NULL,NULL,2,2),(3,NULL,NULL,3,3),(4,NULL,NULL,4,4),(5,NULL,NULL,5,5),(6,NULL,NULL,6,6),(7,NULL,NULL,7,7),(8,NULL,NULL,8,8),(9,NULL,NULL,9,9),(10,NULL,NULL,10,10),(11,NULL,NULL,11,11),(12,NULL,NULL,12,12),(13,NULL,NULL,13,13),(14,NULL,NULL,14,14),(15,NULL,NULL,15,15),(16,NULL,NULL,16,16),(17,NULL,NULL,17,17),(18,NULL,NULL,18,18),(19,NULL,NULL,19,19),(20,NULL,NULL,20,20);
/*!40000 ALTER TABLE `t_display-screen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_uplink_channel`
--

DROP TABLE IF EXISTS `t_uplink_channel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_uplink_channel` (
  `UPLINK_CHANNEL_UNIQUE_INDEX` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `UPLINK_CHANNEL_TEXT_ID` varchar(50) DEFAULT NULL,
  `UPLINK_CHANNEL_DESCRIPTION` varchar(1000) DEFAULT NULL,
  `PROCESS_INDEX` smallint(5) unsigned NOT NULL,
  `CHANNEL_INDEX` smallint(5) unsigned NOT NULL,
  `CLIENT_SERVER_INDEX` smallint(5) unsigned NOT NULL,
  `HOST_INDEX` smallint(5) unsigned NOT NULL,
  PRIMARY KEY (`CHANNEL_INDEX`,`CLIENT_SERVER_INDEX`,`HOST_INDEX`),
  UNIQUE KEY `t_uplinks_UN` (`UPLINK_CHANNEL_UNIQUE_INDEX`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_uplink_channel`
--

LOCK TABLES `t_uplink_channel` WRITE;
/*!40000 ALTER TABLE `t_uplink_channel` DISABLE KEYS */;
INSERT INTO `t_uplink_channel` VALUES (4,NULL,NULL,0,20,1,1),(5,NULL,NULL,0,21,1,1),(6,NULL,NULL,0,22,1,1),(7,NULL,NULL,0,23,1,1),(2,NULL,NULL,0,160,1,1),(3,NULL,NULL,0,160,2,1),(1,NULL,NULL,0,10002,2,0);
/*!40000 ALTER TABLE `t_uplink_channel` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-07-03 22:39:39
