<?php

class ChannelManager extends AbstractManager
{
	public function __construct() {
	}
	
	public function handleRequest($args) {
		$cmd = $args["cmd"];
		$status = false;
		switch($cmd) {
			case 'load':
				$status = $this->_handleLoad($args);
				break;
			case 'create':
				$status = $this->_handleCreate($args);
				break;
			case 'update':
				$status = $this->_handleUpdate($args);
				break;
			case 'destroy':
				$status = $this->_handleDestroy($args);
				break;
			default:
				$this->_response = "Error: Unimplemented Method!";
				break;
		}
	}
	
	private function _handleLoad($args) {
		$this->_headers[] = "Content-Type: application/json, charset=utf-8";
		$res = Db::getInstance()->execAllQuery(
			"SELECT * FROM channels ORDER BY name");
		if($res === false) {
			$this->_response = '{"success": false, "message": "'.Db::getInstance()->getLastError().'", "results": 0, "schedules": []}';
			return false;
		}
		$channels = array();
		foreach($res as $r) {
			$channels[] = '{"name": "'.$r["name"].'", '
							.'"mount": "'.$r["mount"].'", '
							.'"genre": "'.$r["genre"].'", '
							.'"description": "'.$r["description"].'"'
							.'}';
		}
		$this->_response = '{"success": true, "message": "", "results": '.count($channels).', "channels": ['.implode(", ", $channels).']}';
		return true;
	}
	
	private function _handleCreate($args) {
		$this->_headers[] = "Content-Type: application/json, charset=utf-8";
		if(!$args["channels"]) {
			$this->_response = '{"success": false, "message": "Argument error"}';
			return false;
		}
		$channel = json_decode(stripslashes($args["channels"]));
		$query = "INSERT INTO `channels` (`name`, `mount`, `genre`, `description`) VALUES ";
		
		$name = $channel->name;
		$mount = $channel->mount;
		$genre = $channel->genre;
		$description = $channel->description;
		
		$query .= "('$name', '$mount', '$genre', '$description')";
		if(false === Db::getInstance()->execNoneQuery($query)) {
			$this->_response = '{"success": false, "message": "'.Db::getInstance()->getLastError().'"}';
			return false;
		}
		
		$this->_response = '{"success": true, "message": "", "results": 1, "channels": [{"name": '.$name.'}]}';
		return true;
	}
	
	private function _handleUpdate($args) {
		$this->_headers[] = "Content-Type: application/json, charset=utf-8";
		if(!$args["channels"]) {
			$this->_response = '{"success": false, "message": "Argument error"}';
			return false;
		}
		$channel = json_decode(stripslashes($args["channels"]));
		
		$name = $channel->name;
		$mount = $channel->mount;
		$genre = $channel->genre;
		$description = $channel->description;
		
		$query = "UPDATE `channels` SET "
					."`name` = '$name', "
					."`mount` = '$mount', "
					."`genre` = '$genre', "
					."`description` = '$description' "
				."WHERE `name` = '$name'";
		
		if(false === Db::getInstance()->execNoneQuery($query)) {
			$this->_response = '{"success": false, "message": "'.Db::getInstance()->getLastError().'"}';
			return false;
		}
		
		$this->_response = '{"success": true, "message": ""}';
		return true;
	}
	
	private function _handleDestroy($args) {
		$this->_headers[] = "Content-Type: application/json, charset=utf-8";
		if(!$args["channels"]) {
			$this->_response = '{"success": false, "message": "Argument error"}';
			return false;
		}
		
		$name = json_decode(stripslashes($args["channels"]));
		
		if(false === Db::getInstance()->execNoneQuery("DELETE FROM `channels` WHERE `name` = '$name'")) {
			$this->_response = '{"success": false, "message": "'.Db::getInstance()->getLastError().'"}';
			return false;
		}
		
		$this->_response = '{"success": true, "message": ""}';
		return true;
	}
}

?>