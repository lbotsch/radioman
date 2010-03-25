<?php

class PlaylistManager extends AbstractManager
{
	private $_fsRoot = "";
	private $_clRoot = "library";
	
	public function __construct($root,$clRoot=null) {
		$this->_fsRoot = $root;
		if($clRoot) $this->_clRoot = $clRoot;
	}
	
	public function handleRequest($args) {
		$cmd = $args["cmd"];
		$status = false;
		switch($cmd) {
			case 'loadPlaylists':
				$status = $this->_handleLoadPlaylists($args);
				break;
			case 'createPlaylist':
				$status = $this->_handleCreatePlaylist($args);
				break;
			case 'editPlaylist':
				$status = $this->_handleEditPlaylist($args);
				break;
			case 'removePlaylist':
				$status = $this->_handleRemovePlaylist($args);
				break;
			case 'loadPlaylistData':
				$status = $this->_handleLoadPlaylistData($args);
				break;
			case 'updatePlaylistData':
				$status = $this->_handleUpdatePlaylistData($args);
				break;
			default:
				$this->_response = "Error: Unimplemented Method!";
				break;
		}
	}
	
	private function _handleLoadPlaylists($args) {
		$this->_headers[] = "Content-Type: application/json, charset=utf-8";
		$res = Db::getInstance()->execAllQuery(
			 "SELECT pl.id as `id`, pl.name as `name`, count(items.id) as `songs` "
			."FROM `playlists` as pl "
			."LEFT OUTER JOIN `playlist_item` as items ON items.playlists_id = pl.id "
			."GROUP BY pl.id");
		if($res === false) {
			$this->_response = '[]';
			return false;
		}
		$playlists = array();
		foreach($res as $r) {
			$playlists[] = '{"playlist_id": '.$r["id"].', "name": "'.$r["name"].'", "songs": '.$r["songs"].'}';
		}
		$this->_response = '['.implode(", ", $playlists).']';
		return true;
	}
	
	private function _handleCreatePlaylist($args) {
		$this->_headers[] = "Content-Type: application/json, charset=utf-8";
		
		if(!$args["name"]) {
			$this->_response = '{"status": "error", "error": "Argument error"}';
			return false;
		}
		
		$name = $args["name"];
		if(false === Db::getInstance()->execNoneQuery("INSERT INTO `playlists` (`name`) VALUES ('".mysql_real_escape_string($name)."');")) {
			$this->_response = '{"status": "error", "error": "'.Db::getInstance()->getLastError().'"}';
			return false;
		}
		$id = Db::getInstance()->getLastInsertId();
		$this->_response = '{"status": "success", "playlist_id": "'.$id.'", "name": "'.$name.'"}';
		return true;
	}
	
	private function _handleEditPlaylist($args) {
		if(!$args["id"] || !$args["name"]) {
			$this->_response = '{"status": "error", "error": "Argument error"}';
			return false;
		}
		$this->_headers[] = "Content-Type: application/json, charset=utf-8";
		
		$id = $args["id"];
		$name = $args["name"];
		if(false === Db::getInstance()->execNoneQuery("UPDATE `playlists` SET `name` = '".mysql_real_escape_string($name)."' WHERE id = $id;")) {
			$this->_response = '{"status": "error", "error": "'.Db::getInstance()->getLastError().'"}';
			return false;
		}
		$this->_response = '{"status": "success", "playlist_id": "'.$id.'", "name": "'.$name.'"}';
		return true;
	}
	
	private function _handleRemovePlaylist($args) {
		if(!$args["id"]) {
			$this->_response = '{"status": "error", "error": "Argument error"}';
			return false;
		}
		$this->_headers[] = "Content-Type: application/json, charset=utf-8";
		
		$id = $args["id"];
		if(false === Db::getInstance()->execNoneQuery("DELETE FROM `playlists` WHERE id = $id;")) {
			$this->_response = '{"status": "error", "error": "'.Db::getInstance()->getLastError().'"}';
			return false;
		}
		$this->_response = '{"status": "success", "playlist_id": "'.$id.'", "name": "'.$name.'"}';
		return true;
	}
	
	private function _handleLoadPlaylistData($args) {
		$this->_headers[] = "Content-Type: application/json, charset=utf-8";
		if(!$args["id"]) {
			$this->_response = '{"status": "error", "error": "Argument error"}';
			return false;
		}
		$id = $args["id"];
		$res = Db::getInstance()->execAllQuery("SELECT * FROM `playlist_item` WHERE `playlists_id` = $id ORDER BY `index`");
		if($res === false) {
			$this->_response = '{"status": "error", "error": "'.Db::getInstance()->getLastError().'"}';
			return false;
		}
		$playlistItems = array();
		foreach($res as $r) {
			$playlistItems[] = '{"path": "'.$r["path"].'", '
					.'"title": "'.$r["title"].'", '
					.'"artist": "'.$r["artist"].'", '
					.'"album": "'.$r["album"].'", '
					.'"length": "'.$r["length"].'", '
					.'"playtime": "'.$r["playtime"].'"}';
		}
		$this->_response = '['.implode(", ", $playlistItems).']';
		return true;
	}
	
	private function _handleUpdatePlaylistData($args) {
		$this->_headers[] = "Content-Type: application/json, charset=utf-8";
		if(!$args["id"] || !$args["data"]) {
			$this->_response = '{"status": "error", "error": "Argument error"}';
			return false;
		}
		$id = $args["id"];
		$data = stripslashes($args["data"]);
		$data = json_decode($data)->items;
		
		if(false === Db::getInstance()->execNoneQuery("DELETE FROM playlist_item WHERE playlists_id = $id")) {
			$this->_response = '{"status": "error", "error": "'.Db::getInstance()->getLastError().'"}';
			return false;
		}
		$query = array();
		$i = 0;
		foreach($data as $item) {
			$query[] = "($id, '".mysql_real_escape_string($item->path)
				."', '".mysql_real_escape_string($item->title)
				."', '".mysql_real_escape_string($item->artist)
				."', '".mysql_real_escape_string($item->album)
				."', '".mysql_real_escape_string($item->length)
				."', '".mysql_real_escape_string($item->playtime)."', $i)";
			$i++;
		}
		$query = "INSERT INTO playlist_item (playlists_id, path, title, artist, album, length, playtime, `index`) VALUES ".implode(", ", $query);
		if(false === Db::getInstance()->execNoneQuery($query)) {
			$this->_response = '{"status": "error", "error": "'.Db::getInstance()->getLastError().'"}';
			return false;
		}
		$this->_response = '{"status": "success"}';
		return true;
	}
	
	
}

?>