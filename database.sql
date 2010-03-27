DROP TABLE IF EXISTS `channels`;
DROP TABLE IF EXISTS `history`;
DROP TABLE IF EXISTS `playlist_item`;
DROP TABLE IF EXISTS `playlists`;
DROP TABLE IF EXISTS `schedules`;

CREATE TABLE  `channels` (
  `name` varchar(100) NOT NULL,
  `mount` varchar(100) NOT NULL,
  `genre` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `running` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
CREATE TABLE `history` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `playlists_id` int(10) unsigned NOT NULL,
  `title` varchar(255) NOT NULL,
  `path` text NOT NULL,
  `artist` varchar(255) NOT NULL,
  `playtime` varchar(20) NOT NULL,
  `index` int(10) unsigned NOT NULL,
  `album` varchar(255) NOT NULL,
  `length` varchar(100) NOT NULL,
  `channel` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
CREATE TABLE `playlist_item` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `path` text NOT NULL,
  `playlists_id` int(10) unsigned NOT NULL,
  `title` varchar(255) NOT NULL,
  `artist` varchar(255) NOT NULL,
  `playtime` varchar(20) NOT NULL,
  `index` int(10) unsigned NOT NULL,
  `album` varchar(255) NOT NULL,
  `length` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
CREATE TABLE `playlists` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
CREATE TABLE `schedules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `playlists_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `begin_date` date NOT NULL,
  `begin_time` time NOT NULL,
  `end_date` date NOT NULL,
  `end_time` time NOT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT '1',
  `priority` int(11) NOT NULL DEFAULT '1',
  `channel` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
