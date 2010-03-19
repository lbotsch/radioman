<?php

// TODO: Check for user authenticity!!!

require_once 'lib/file-mgr.class.php';

$mgr = new FileManager("/EXCHANGE/Music", "library");
$mgr->handleRequest($_REQUEST);
$mgr->sendResponse();


?>
