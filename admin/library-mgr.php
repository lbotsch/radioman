<?php

// TODO: Check for user authenticity!!!

require_once '../config.inc.php';

$mgr = new FileManager(Config::MUSIC_LIBRARY_PATH, Config::MUSIC_LIBRARY_ROOT);
$mgr->handleRequest($_REQUEST);
$mgr->sendResponse();


?>
