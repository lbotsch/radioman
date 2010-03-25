<?php

abstract class AbstractManager
{
	protected $_response = "";
	protected $_headers = array();
	
	public function getResponse() { return $this->_response; }
	public function getHeaders() { return $this->_headers; }
	
	public abstract function handleRequest($args);
	
	public function sendResponse() {
		foreach($this->_headers as $h) {
			header($h);
		}
		echo $this->_response;
	}
}

?>