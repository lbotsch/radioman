<?php

class Config
{
	const PHP_BASE_PATH = "/EXCHANGE/code/radioman/";
	const PHP_LIBRARY_PATH = "/EXCHANGE/code/radioman/lib/";
	const PHP_TEMP_PATH = "/EXCHANGE/code/radioman/tmp/";
	const MUSIC_LIBRARY_PATH = "/EXCHANGE/Music";
	const MUSIC_LIBRARY_ROOT = "library";
	const LANGUAGE = "fr_FR";
	const DB_HOST = "localhost";
	const DB_USER = "root";
	const DB_PASS = "janvier";
	const DB_NAME = "radioman";
	const HISTORY_MAX_SIZE = 5;
	const HISTORY_FILE_NAME = "history-%s";

	private static $_instance;
	
	private $_db;

	private function __construct() {
		$this->_db = Db::open(
			self::DB_HOST,
			self::DB_USER,
			self::DB_PASS,
			self::DB_NAME);

	}

	/**
	 * @return Config
	 */
	public static function getInstance() {
		if(!self::$_instance)
			self::$_instance = new self();
		return self::$_instance;
	}

	/**
	 * @return Db
	 */
	public function getDb() {
		return $this->_db;
	}
}

function __autoload($class_name) {
	require_once Config::PHP_LIBRARY_PATH . $class_name . ".class.php";
}

?>