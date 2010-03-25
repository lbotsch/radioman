<?php

// TODO: Check for user authenticity!!!

require_once '../config.inc.php';

// Open the database connection
Config::getInstance()->getDb();
$mgr = new ScheduleManager();
$mgr->handleRequest($_REQUEST);
$mgr->sendResponse();

?>