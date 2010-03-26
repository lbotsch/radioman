#!/usr/bin/php
<?php

require_once("/EXCHANGE/code/radioman/config.inc.php");

function usage() {
	print "=== Radioman Utility Scripts ===\n";
	print "Author: Lukas Botsch <lukas.botsch@gmail.com>\n\n";
	print "Usage: ".$argv[0]." [options] cmd -- [args]\n";
	print "OPTIONS:\n";
	print "\t--\t\tBegin of command arguments.\n";
	print "\t--debug,-d\tTurn debug mode on.\n";
	print "\t--help,-h\tPrint this help text.\n";
	print "COMMANDS:\n";
	print "\tshutdown\n\t\tTell Radioman that the system is getting down.\n";
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

if($i = array_search("--", $argv)) {
	$cmd = $argv[$i - 1];
	$args = array_slice($argv, $i+1);
} else {
	$cmd = $argv[$argc - 1];
}

// Initialize the configuration
$cfg = Config::getInstance();
$db = $cfg->getDb();

switch($cmd) {
	case "shutdown":
		handle_shutdown();
		break;
	case "history":
		handle_history($args);
		break;
	default:
		// Unknown command. exit.
		usage();
}

function handle_shutdown() {
	global $db;
	
	if(DEBUG)
		print "[INFO] Processing command 'shutdown'.\n";
	if(false === $db->execNoneQuery("UPDATE `channels` SET `running` = 0")) {
		if(DEBUG)
			print "[ERROR] ".$db->getLastError()."\n";
		exit(1);
	}
}

?>
