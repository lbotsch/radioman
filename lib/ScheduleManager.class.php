<?php

class ScheduleManager extends AbstractManager
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
			"SELECT s.*, p.id as playlist_id, p.name as playlist_name FROM schedules as s LEFT OUTER JOIN playlists as p ON s.playlists_id = p.id ORDER BY begin_date, begin_time DESC");
		if($res === false) {
			$this->_response = '{"success": false, "message": "'.Db::getInstance()->getLastError().'", "results": 0, "schedules": []}';
			return false;
		}
		$schedules = array();
		foreach($res as $r) {
			$schedules[] = '{"id": '.$r["id"].', '
							.'"channel": "'.$r["channel"].'", '
							.'"playlist_id": '.$r["playlist_id"].', '
							.'"playlist_name": "'.$r["playlist_name"].'", '
							.'"startdate": "'.$r["begin_date"].'", '
							.'"starttime": "'.implode(":", array_slice(explode(":", $r["begin_time"]), 0, 2)).'", '
							.'"enddate": "'.$r["end_date"].'", '
							.'"endtime": "'.implode(":", array_slice(explode(":", $r["end_time"]), 0, 2)).'", '
							.'"enabled": '.($r["enabled"] == 1 ? "true" : "false").', '
							.'"priority": "'.$r["priority"].'"'
							.'}';
		}
		$this->_response = '{"success": true, "message": "", "results": '.count($schedules).', "schedules": ['.implode(", ", $schedules).']}';
		return true;
	}
	
	private function _handleCreate($args) {
		$this->_headers[] = "Content-Type: application/json, charset=utf-8";
		if(!$args["schedules"]) {
			$this->_response = '{"success": false, "message": "Argument error"}';
			return false;
		}
		$schedule = json_decode(stripslashes($args["schedules"]));
		$query = "INSERT INTO `schedules` (`channel`, `playlists_id`, `begin_date`, `begin_time`, `end_date`, `end_time`, `enabled`, `priority`) VALUES ";
		
		$channel = $schedult->channel;
		$playlist_id = $schedule->playlist_id;
		$start_date = $schedule->startdate;
		$end_date = $schedule->enddate;
		$start_time = $schedule->starttime.":00";
		$end_time = $schedule->endtime.":00";
		$enabled = $schedule->enabled ? 1 : 0;
		$priority = $schedule->priority;
		
		$query .= "('$channel', $playlist_id, '$start_date', '$start_time', '$end_date', '$end_time', $enabled, '$priority')";
		if(false === Db::getInstance()->execNoneQuery($query)) {
			$this->_response = '{"success": false, "message": "'.Db::getInstance()->getLastError().'"}';
			return false;
		}
		$id = Db::getInstance()->getLastInsertId();
		
		$this->_response = '{"success": true, "message": "", "results": 1, "schedules": [{"id": '.$id.'}]}';
		return true;
	}
	
	private function _handleUpdate($args) {
		$this->_headers[] = "Content-Type: application/json, charset=utf-8";
		if(!$args["schedules"]) {
			$this->_response = '{"success": false, "message": "Argument error"}';
			return false;
		}
		$schedule = json_decode(stripslashes($args["schedules"]));
		
		$id = $schedule->id;
		$channel = $schedule->channel;
		$playlist_id = $schedule->playlist_id;
		$start_date = explode("T", $schedule->startdate);
		$start_date = $start_date[0];
		$end_date = explode("T", $schedule->enddate);
		$end_date = $end_date[0];
		$start_time = $schedule->starttime.":00";
		$end_time = $schedule->endtime.":00";
		$enabled = $schedule->enabled ? 1 : 0;
		$priority = $schedule->priority;
		
		$query = "UPDATE `schedules` SET "
					."`channel` = '$channel', "
					."`playlists_id` = $playlist_id, "
					."`begin_date` = '$start_date', "
					."`begin_time` = '$start_time', "
					."`end_date` = '$end_date', "
					."`end_time` = '$end_time', "
					."`enabled` = $enabled, "
					."`priority` = '$priority' "
				."WHERE id = $id";
		
		if(false === Db::getInstance()->execNoneQuery($query)) {
			$this->_response = '{"success": false, "message": "'.Db::getInstance()->getLastError().'"}';
			return false;
		}
		
		$this->_response = '{"success": true, "message": ""}';
		return true;
	}
	
	private function _handleDestroy($args) {
		$this->_headers[] = "Content-Type: application/json, charset=utf-8";
		if(!$args["schedules"]) {
			$this->_response = '{"success": false, "message": "Argument error"}';
			return false;
		}
		
		$id = $args["schedules"];
		
		if(false === Db::getInstance()->execNoneQuery("DELETE FROM `schedules` WHERE id = $id")) {
			$this->_response = '{"success": false, "message": "'.Db::getInstance()->getLastError().'"}';
			return false;
		}
		
		$this->_response = '{"success": true, "message": ""}';
		return true;
	}
}

?>