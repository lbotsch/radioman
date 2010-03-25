#!/usr/bin/php
<?php

// Include configuration
require_once("/EXCHANGE/code/radioman/config.inc.php");

function usage() {
	print "=== Radioman Utility Scripts ===\n";
	print "Author: Lukas Botsch <lukas.botsch@gmail.com>\n\n";
	print "Usage: ".$argv[0]." [options] channel_name\n";
	print "OPTIONS:\n\t--debug,-d\tTurn debug mode on\n";
	print "\t--help,-h\tPrint this help text\n";
	exit(1);
}

if($argc < 2 || in_array($argv[1],array('--help','-help','-h','-?'))) {
	usage();
}

if(in_array($argv[1],array('--debug','-d'))) {
	if($argc < 3) usage();

	print "[INFO] Debug mode is on\n";
	define("DEBUG", true);
} else define("DEBUG", false);

$channel = $argv[$argc - 1];

// Initialize the configuration
$cfg = Config::getInstance();
$db = $cfg->getDb();

// Get next item from history
$hist = History::restore($channel);
if(DEBUG) {
	if($hist->isNew)
		print "[INFO] Created new history.\n";
	else {
		print "[INFO] Restored history from file.\n";
		//print "[DEBUG] History: \n";
		//var_dump($hist);
	}
}
$item = $hist->getNext();
if($item) {
	if(DEBUG) {
		print "[INFO] Got next item.\n";
		print "[DEBUG] Item path: "
			.FileManager::getServerPath($item->path)."\n";
		print "[INFO] ";
	}
	print "annotate:channel=\"$channel\","
		."item_id=\"$item->item_id\","
		."playlist_id=\"$item->playlist_id\","
		."schedule_id=\"$item->schedule_id\","
		."display_title=\"$item->title\","
		."display_artist=\"$item->artist\","
		."display_album=\"$item->album\","
		."length=\"$item->length\","
		."playtime=\"$item->playtime\""
		.":".FileManager::getServerPath($item->path)."\n";
} else {
	// Error: no next item found!
	if(DEBUG) {
		print "[ERROR] No next item found.\n";
	}
	exit(1);
}

exit(0);

?>
