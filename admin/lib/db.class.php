<?php

class Db
{
	private static $_instance;
	
	private $_connection;
	
	private function __construct($host, $user, $pass, $database) {
		$this->_connection = mysql_connect($host, $user, $pass);
		mysql_select_db($database, $this->_connection);
	}
	
	/**
	 * Create a singleton instance
	 * @param string $host
	 * @param string $user
	 * @param string $pass
	 * @param string $database
	 * @return Db
	 */
	public static function open($host, $user, $pass, $database) {
		self::$_instance = new self($host, $user, $pass, $database);
		return self::$_instance;
	}
	
	/**
	 * Get the singleton instance
	 * @return Db
	 */
	public static function getInstance() {
		return self::$_instance;
	}
	
	/**
	 * Execute a db query and return nothing
	 * @param string $query
	 * @return bool
	 */
	public function execNoneQuery($query) {
		return mysql_query($query, $this->_connection) !== false;
	}
	
	/**
	 * Execute a db query and return first resulting row
	 * @param string $query
	 */
	public function execFirstQuery($query) {
		$res = mysql_query($query, $this->_connection);
		if($res === false) return false;
		return mysql_fetch_array($res);
	}
	
	public function execAllQuery($query) {
		$res = mysql_query($query, $this->_connection);
		if($res === false) return false;
		$rows = array();
		while($row = mysql_fetch_array($res))
			$rows[] = $row;
		return $rows;
	}
	
	/**
	 * Gets the primary id given to the last inserted row
	 * @return mixed primary id
	 */
	public function getLastInsertId() {
		return mysql_insert_id($this->_connection);
	}
	
	public function getLastError() {
		return mysql_error($this->_connection);
	}
}

?>