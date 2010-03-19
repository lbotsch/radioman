<?php

// TODO: Check for user authenticity!!!

require_once 'lib/playlist-mgr.class.php';
require_once 'lib/db.class.php';

Db::open("localhost", "root", "janvier", "radioman");
$mgr = new PlaylistManager("/EXCHANGE/Music", "library");
$mgr->handleRequest($_REQUEST);
$mgr->sendResponse();

?>