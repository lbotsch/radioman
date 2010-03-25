#!/usr/bin/php
<?php

/**
 * Output one channel per line in the following form:
 * mount|name|genre|description
 */


// Include configuration
require_once("/EXCHANGE/code/radioman/config.inc.php");

function usage() {
	print "=== Radioman Utility Scripts ===\n";
	print "Author: Lukas Botsch <lukas.botsch@gmail.com>\n\n";
	print "Usage: ".$argv[0]." [options]\n";
	print "OPTIONS:\n\t--debug,-d\tTurn debug mode on\n";
	print "\t--help,-h\tPrint this help text\n";
	exit(1);
}

if(in_array($argv[1],array('--help','-help','-h','-?'))) {
	usage();
}

if(in_array($argv[1],array('--debug','-d'))) {
	print "[INFO] Debug mode is on\n";
	define("DEBUG", true);
} else define("DEBUG", false);

// Initialize the configuration
$cfg = Config::getInstance();
$db = $cfg->getDb();

$res = $db->execAllQuery("SELECT * FROM `channels`");
if(false === $res) {
	if(DEBUG)
		print "[ERROR] ".$db->getLastError()."\n";
	exit(1);
}

$channels = array();
foreach($res as $r) {
	$channels[] = $r["mount"]."|".$r["name"]."|".$r["genre"]."|".$r["description"];
}

if(DEBUG)
	print "[INFO] Got ".count($channels)." channels\n";

print implode("\n", $channels);
if(DEBUG)
	print "\n";

exit(0);

?>