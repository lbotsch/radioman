<?php

// TODO: Check for user authenticity!!!

require_once 'config.php';
require_once 'lib/playlist-mgr.class.php';
require_once 'lib/db.class.php';

Db::open(DB_HOST, DB_USER, DB_PASS, DB_NAME);
$mgr = new PlaylistManager("/EXCHANGE/Music", "library");
$mgr->handleRequest($_REQUEST);
$mgr->sendResponse();

?>