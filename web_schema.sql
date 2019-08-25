-- --------------------------------------------------------
-- Värd:                         localhost
-- Server version:               10.1.37-MariaDB-0+deb9u1 - Debian 9.6
-- Server OS:                    debian-linux-gnu
-- HeidiSQL Version:             9.1.0.4867
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping database structure for wagger_db
DROP DATABASE IF EXISTS `wagger_db`;
CREATE DATABASE IF NOT EXISTS `wagger_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `wagger_db`;


-- Dumping structure for table wagger_db.t_accumulated_data
DROP TABLE IF EXISTS `t_accumulated_data`;
CREATE TABLE IF NOT EXISTS `t_accumulated_data` (
  `CHANNEL_INDEX` smallint(5) unsigned DEFAULT NULL,
  `ACCUMULATED_BIN_END_TIME` int(11) unsigned DEFAULT NULL,
  `ACCUMULATED_BIN_SIZE` mediumint(8) unsigned DEFAULT NULL,
  `ACCUMULATED_NO_OF_SAMPLES` mediumint(8) unsigned DEFAULT NULL,
  `ACCUMULATED_VALUE` double DEFAULT NULL,
  `ACCUMULATED_TEXT` mediumtext,
  `ACCUMULATED_BINARY` mediumblob,
  UNIQUE KEY `T_DOWNSAMPLED_DATA_IDX` (`CHANNEL_INDEX`,`ACCUMULATED_BIN_END_TIME`,`ACCUMULATED_BIN_SIZE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for table wagger_db.t_acquired_data
DROP TABLE IF EXISTS `t_acquired_data`;
CREATE TABLE IF NOT EXISTS `t_acquired_data` (
  `UNIQUE_INDEX` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `CHANNEL_INDEX` smallint(5) unsigned NOT NULL,
  `ACQUIRED_TIME` int(11) unsigned NOT NULL,
  `ACQUIRED_VALUE` double DEFAULT NULL,
  `ACQUIRED_SUBSAMPLES` mediumtext,
  `ACQUIRED_BASE64` mediumblob,
  `ADDED_TIMESTAMP` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `STATUS` tinyint(4) DEFAULT '-1',
  PRIMARY KEY (`UNIQUE_INDEX`),
  KEY `ACQUIRED_TIME_CHANNEL_INDEX_IDX` (`ACQUIRED_TIME`,`CHANNEL_INDEX`),
  KEY `CHANNEL_INDEX_STATUS_IDX` (`CHANNEL_INDEX`,`STATUS`),
  KEY `ADDED_TIMESTAMP_CHANNEL_INDEX_STATUS_IDX` (`ADDED_TIMESTAMP`,`CHANNEL_INDEX`,`STATUS`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for table wagger_db.t_channels
DROP TABLE IF EXISTS `t_channels`;
CREATE TABLE IF NOT EXISTS `t_channels` (
  `CHANNEL_UNIQUE_INDEX` smallint(5) unsigned NOT NULL,
  `CHANNEL_SAMPLE_RATE` float unsigned DEFAULT NULL,
  `CHANNEL_MIN_VALUE` float unsigned DEFAULT NULL,
  `CHANNEL_MAX_VALUE` float unsigned DEFAULT NULL,
  `CHANNEL_TEXT_ID` varchar(50) DEFAULT NULL,
  `CHANNEL_DESCRIPTION` varchar(1000) DEFAULT NULL,
  `CHANNEL_FUNCTION` varchar(200) DEFAULT NULL,
  `CHANNEL_LOOKUP` varchar(2000) DEFAULT NULL,
  `OFFSET` smallint(5) unsigned DEFAULT NULL,
  `MODULE_INDEX` smallint(5) unsigned DEFAULT NULL,
  `DEVICE_INDEX` smallint(5) unsigned DEFAULT NULL,
  `HOST_INDEX` smallint(5) unsigned DEFAULT NULL,
  PRIMARY KEY (`CHANNEL_UNIQUE_INDEX`),
  KEY `t_channels_t_modules_FK` (`MODULE_INDEX`),
  KEY `t_channels_t_hosts_FK` (`HOST_INDEX`),
  KEY `t_channels_t_devices_FK` (`DEVICE_INDEX`),
  CONSTRAINT `t_channels_t_devices_FK` FOREIGN KEY (`DEVICE_INDEX`) REFERENCES `t_devices` (`DEVICE_UNIQUE_INDEX`),
  CONSTRAINT `t_channels_t_hosts_FK` FOREIGN KEY (`HOST_INDEX`) REFERENCES `t_hosts` (`HOST_UNIQUE_INDEX`),
  CONSTRAINT `t_channels_t_modules_FK` FOREIGN KEY (`MODULE_INDEX`) REFERENCES `t_modules` (`MODULE_UNIQUE_INDEX`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for table wagger_db.t_devices
DROP TABLE IF EXISTS `t_devices`;
CREATE TABLE IF NOT EXISTS `t_devices` (
  `DEVICE_UNIQUE_INDEX` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `DEVICE_TEXT_ID` varchar(50) DEFAULT NULL,
  `DEVICE_HARDWARE_ID` varchar(50) NOT NULL,
  `DEVICE_DESCRIPTION` varchar(200) DEFAULT NULL,
  `HOST_INDEX` smallint(5) unsigned DEFAULT NULL,
  PRIMARY KEY (`DEVICE_HARDWARE_ID`),
  UNIQUE KEY `t_devices_UN` (`DEVICE_UNIQUE_INDEX`),
  KEY `t_devices_t_hosts_FK` (`HOST_INDEX`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- Data exporting was unselected.


-- Dumping structure for table wagger_db.t_device_channels
DROP TABLE IF EXISTS `t_device_channels`;
CREATE TABLE IF NOT EXISTS `t_device_channels` (
  `CHANNEL_UNIQUE_INDEX` smallint(5) unsigned NOT NULL,
  `CHANNEL_SAMPLE_RATE` float unsigned DEFAULT NULL,
  `CHANNEL_MIN_VALUE` float unsigned DEFAULT NULL,
  `CHANNEL_MAX_VALUE` float unsigned DEFAULT NULL,
  `CHANNEL_TEXT_ID` varchar(50) DEFAULT NULL,
  `CHANNEL_DESCRIPTION` varchar(1000) DEFAULT NULL,
  `CHANNEL_FUNCTION` varchar(200) DEFAULT NULL,
  `CHANNEL_LOOKUP` varchar(2000) DEFAULT NULL,
  `CHANNEL_OFFSET` smallint(5) unsigned NOT NULL,
  `DEVICE_INDEX` smallint(5) unsigned NOT NULL,
  PRIMARY KEY (`DEVICE_INDEX`,`CHANNEL_OFFSET`),
  UNIQUE KEY `t_device_channels_UN` (`CHANNEL_UNIQUE_INDEX`),
  CONSTRAINT `t_device_channels_t_devices_FK` FOREIGN KEY (`DEVICE_INDEX`) REFERENCES `t_devices` (`DEVICE_UNIQUE_INDEX`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for table wagger_db.t_hosts
DROP TABLE IF EXISTS `t_hosts`;
CREATE TABLE IF NOT EXISTS `t_hosts` (
  `HOST_UNIQUE_INDEX` smallint(5) unsigned NOT NULL,
  `HOST_TEXT_ID` varchar(50) DEFAULT NULL,
  `HOST_HARDWARE_ID` varchar(50) NOT NULL,
  `HOST_IP_ADDRESS` varchar(50) DEFAULT NULL,
  `HOST_PERSISTENT_DATA_PATH` varchar(200) DEFAULT NULL,
  `HOST_DATABASE_CONNECTION_STRING` varchar(200) DEFAULT NULL,
  `HOST_DESCRIPTION` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`HOST_HARDWARE_ID`),
  UNIQUE KEY `t_hosts_UN` (`HOST_UNIQUE_INDEX`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- Data exporting was unselected.


-- Dumping structure for table wagger_db.t_modules
DROP TABLE IF EXISTS `t_modules`;
CREATE TABLE IF NOT EXISTS `t_modules` (
  `MODULE_UNIQUE_INDEX` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `MODULE_TEXT_ID` varchar(50) DEFAULT NULL,
  `MODULE_DESCRIPTION` varchar(200) DEFAULT NULL,
  `SLOT_INDEX` smallint(5) unsigned NOT NULL,
  `DEVICE_INDEX` smallint(5) unsigned NOT NULL,
  PRIMARY KEY (`SLOT_INDEX`,`DEVICE_INDEX`),
  UNIQUE KEY `t_modules_UN` (`MODULE_UNIQUE_INDEX`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- Data exporting was unselected.


-- Dumping structure for table wagger_db.t_ports
DROP TABLE IF EXISTS `t_ports`;
CREATE TABLE IF NOT EXISTS `t_ports` (
  `PORT_UNIQUE_INDEX` smallint(5) unsigned NOT NULL,
  `PORT_TEXT_ID` varchar(50) DEFAULT NULL,
  `PORT_DESCRIPTION` varchar(200) DEFAULT NULL,
  `HOST_INDEX` smallint(5) unsigned DEFAULT NULL,
  `DEVICE_INDEX` smallint(5) unsigned DEFAULT NULL,
  PRIMARY KEY (`PORT_UNIQUE_INDEX`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- Data exporting was unselected.


-- Dumping structure for table wagger_db.t_servers
DROP TABLE IF EXISTS `t_servers`;
CREATE TABLE IF NOT EXISTS `t_servers` (
  `SERVER_UNIQUE_INDEX` smallint(5) unsigned NOT NULL,
  `SERVER_TEXT_ID` varchar(50) DEFAULT NULL,
  `SERVER_DESCRIPTION` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`SERVER_UNIQUE_INDEX`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- Data exporting was unselected.


-- Dumping structure for table wagger_db.t_service
DROP TABLE IF EXISTS `t_service`;
CREATE TABLE IF NOT EXISTS `t_service` (
  `SERVICE_UNIQUE_INDEX` smallint(5) unsigned NOT NULL,
  `SERVICE_TEXT_ID` varchar(50) DEFAULT NULL,
  `SERVICE_DESCRIPTION` varchar(200) DEFAULT NULL,
  `SERVICE_REBOOT_NEXT` tinyint(4) DEFAULT NULL,
  `HOST_INDEX` smallint(5) unsigned DEFAULT NULL,
  UNIQUE KEY `t_hosts_UN` (`SERVICE_UNIQUE_INDEX`) USING BTREE,
  KEY `t_service_t_hosts_FK` (`HOST_INDEX`),
  CONSTRAINT `t_service_t_hosts_FK` FOREIGN KEY (`HOST_INDEX`) REFERENCES `t_hosts` (`HOST_UNIQUE_INDEX`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.


-- Dumping structure for table wagger_db.t_slots
DROP TABLE IF EXISTS `t_slots`;
CREATE TABLE IF NOT EXISTS `t_slots` (
  `SLOT_UNIQUE_INDEX` smallint(5) unsigned NOT NULL,
  `SLOT_DEVICE_INDEX` smallint(5) unsigned DEFAULT NULL,
  `SLOT_TEXT_ID` varchar(50) DEFAULT NULL,
  `SLOT_DESCRIPTION` varchar(200) DEFAULT NULL,
  `MODULE_INDEX` smallint(5) unsigned DEFAULT NULL,
  `DEVICE_INDEX` smallint(5) unsigned DEFAULT NULL,
  PRIMARY KEY (`SLOT_UNIQUE_INDEX`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='BehÃ¶vs denna verkligen? RÃ¤cker det inte med att ange SLOT_INDEX per modul?';

-- Data exporting was unselected.


-- Dumping structure for table wagger_db.t_tasks
DROP TABLE IF EXISTS `t_tasks`;
CREATE TABLE IF NOT EXISTS `t_tasks` (
  `TASK_UNIQUE_INDEX` smallint(5) unsigned NOT NULL,
  `TASK_SAMPLE_RATE` float unsigned DEFAULT NULL,
  `TASK_TEXT_ID` varchar(50) DEFAULT NULL,
  `TASK_DESCRIPTION` varchar(200) DEFAULT NULL,
  `HOST_INDEX` smallint(5) unsigned DEFAULT NULL,
  `DEVICE_INDEX` smallint(5) unsigned DEFAULT NULL,
  PRIMARY KEY (`TASK_UNIQUE_INDEX`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- Data exporting was unselected.


-- Dumping structure for table wagger_db.t_uplink_processes
DROP TABLE IF EXISTS `t_uplink_processes`;
CREATE TABLE IF NOT EXISTS `t_uplink_processes` (
  `UPLINK_PROCESS_UNIQUE_INDEX` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `UPLINK_PROCESS_TEXT_ID` varchar(50) DEFAULT NULL,
  `UPLINK_PROCESS_DESCRIPTION` varchar(1000) DEFAULT NULL,
  `CHANNEL_INDEX` smallint(5) unsigned NOT NULL,
  `SERVER_INDEX` smallint(5) unsigned NOT NULL,
  `HOST_INDEX` smallint(5) unsigned NOT NULL,
  PRIMARY KEY (`CHANNEL_INDEX`,`SERVER_INDEX`,`HOST_INDEX`),
  UNIQUE KEY `t_uplinks_UN` (`UPLINK_PROCESS_UNIQUE_INDEX`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
