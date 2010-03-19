<?php

// TODO: Check for user authenticity!!!

require_once 'config.php';
require_once 'lib/file-mgr.class.php';

$mgr = new FileManager(LIBRARY_PATH, LIBRARY_ROOT);
$mgr->handleRequest($_REQUEST);
$mgr->sendResponse();


?>
