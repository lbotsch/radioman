<?php

// TODO: Check for user authenticity!!!

require_once '../config.inc.php';

// Open the database connection
Config::getInstance()->getDb();
$mgr = new PlaylistManager(Config::MUSIC_LIBRARY_PATH, Config::MUSIC_LIBRARY_ROOT);
$mgr->handleRequest($_REQUEST);
$mgr->sendResponse();

?>