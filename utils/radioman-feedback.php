#!/usr/bin/php
<?php

require_once("/EXCHANGE/code/radioman/config.inc.php");

function usage() {
	print "=== Radioman Utility Scripts ===\n";
	print "Author: Lukas Botsch <lukas.botsch@gmail.com>\n\n";
	print "Usage: ".$argv[0]." [options] channel item_id\n";
	print "OPTIONS:\n\t--debug,-d\tTurn debug mode on\n";
	print "\t--help,-h\tPrint this help text\n";
	exit(1);
}

if($argc < 3 || in_array($argv[1],array('--help','-help','-h','-?'))) {
	usage();
}

if(in_array($argv[1],array('--debug','-d'))) {
	if($argc < 3) usage();

	print "[INFO] Debug mode is on\n";
	define("DEBUG", true);
} else define("DEBUG", false);

$channel = $argv[$argc - 2];
$item_id = $argv[$argc - 1];

// Initialize the configuration
$cfg = Config::getInstance();
$db = $cfg->getDb();

$db->execNoneQuery(
	"INSERT INTO `history` ("
		."created_at,"
		."playlists_id,"
		."title,"
		."path,"
		."artist,"
		."playtime,"
		."index,"
		."album,"
		."length"
	.") SELECT "
		."NOW(),"
		."playlists_id,"
		."title,"
		."path,"
		."artist,"
		."playtime,"
		."index,"
		."album,"
		."length"
	." FROM playlist_item WHERE id = $item_id");

?>
