<?php

class History
{
	/**
	 * @var HistoryItem
	 */
	private $_lastItems;
	/**
	 * @var HistoryItem
	 */
	private $_nextItem;
	
	private $_channel;
	private $_path;
	
	public $isNew = true;
	
	public function __construct() {
	}
	
	/**
	 * Restore the history from file if one exists or create a new one
	 * @return History
	 */
	public static function restore($channel) {
		$channel = str_replace(" ", "-", strtolower($channel));
		$path = Config::PHP_TEMP_PATH . sprintf(Config::HISTORY_FILE_NAME, $channel);
		if(file_exists($path)) {
			// Restore history state from file
			$h = file_get_contents($path);
			$h = unserialize($h);
			$h->_path = $path;
			$h->isNew = false;
		} else {
			// Create new fresh instance
			$h = new self();
			$h->_channel = $channel;
			$h->_path = $path;
			$h->_lastItems = array();
			$h->_first();
			$h->isNew = true;
		}
		
		// Save the new state to file
		$h->save();
		
		return $h;
	}
	
	public function __sleep() {
		return array("_lastItems", "_nextItem", "_channel");
	}
	
	public function __wakeup() {
		// Check if the active schedule is the most appropriate.
		// If so, find next item of the scheduled playlist.
		// If not, find first item of the most appropriate schedule's playlist.
		if(!$this->_check()) {
			$this->_first();
		} else {
			$this->_next();
		}
	}
	
	/**
	 * @return HistoryItem
	 */
	public function getNext() { return $this->_nextItem; }
	/**
	 * @return HistoryItem[]
	 */
	public function getHistory() { return $this->_lastItems; }
	
	public function save() {
		$h = serialize($this);
		file_put_contents($this->_path, $h);
	}
	
	/**
	 * Get next item to be played
	 * @return bool
	 */
	private function _next() {
		$schedule_id = $this->_nextItem->schedule_id;
		$index = $this->_nextItem->index;
		// Get next (or first if last was reached) item in playlist
		$query = "SELECT s.id as schedule_id,"
					."p.id as playlist_id,"
					."i.id as item_id,"
					."i.index as `index`,"
					."i.title as title,"
					."i.artist as artist,"
					."i.album as album,"
					."i.length as length,"
					."i.playtime as playtime,"
					."i.path as path "
				."FROM `schedules` as s "
					."LEFT OUTER JOIN `playlists` as p "
						."ON s.playlists_id = p.id "
					."LEFT OUTER JOIN `playlist_item` as i "
						."ON p.id = i.playlists_id "
							."AND (i.index = ".(intval($index) + 1)." OR i.index = 0) "
				."WHERE s.id = $schedule_id AND s.channel = '$this->_channel' "
				."ORDER BY i.index DESC "
				."LIMIT 1";
		
		$schedule = Db::getInstance()->execFirstQuery($query);
		if($schedule === false || !is_array($schedule)) {
			$this->_updateNextItem(null);
			return false;
		}
		$this->_updateNextItem(new HistoryItem(
			$schedule["item_id"],
			$schedule["index"],
			$schedule["title"],
			$schedule["artist"],
			$schedule["album"],
			$schedule["length"],
			$schedule["playtime"],
			$schedule["path"],
			$schedule["playlist_id"],
			$schedule["schedule_id"]));
		
		return true;
	}
	
	/**
	 * @return bool
	 */
	private function _first() {
		$now = new DateTime();
		$dNow = $now->format("Y-m-d");
		$tNow = $now->format("H:i:s");
		$query = "SELECT s.id as schedule_id,"
					."p.id as playlist_id,"
					."i.id as item_id,"
					."i.index as `index`,"
					."i.title as title,"
					."i.artist as artist,"
					."i.album as album,"
					."i.length as length,"
					."i.playtime as playtime,"
					."i.path as path "
				."FROM `schedules` as s "
					."LEFT OUTER JOIN `playlists` as p "
						."ON s.playlists_id = p.id "
					."LEFT OUTER JOIN `playlist_item` as i "
						."ON p.id = i.playlists_id "
				."WHERE s.begin_date <= '$dNow' "
					."AND s.end_date > '$dNow' "
					."AND s.begin_time <= '$tNow' "
					."AND s.end_time > '$tNow' "
					."AND s.enabled = 1 "
					."AND s.channel = '$this->_channel' "
				."ORDER BY s.priority DESC, i.index "
				."LIMIT 1";
		
		$schedule = Db::getInstance()->execFirstQuery($query);
		if($schedule === false || !is_array($schedule)) {
			$this->_updateNextItem(null);
			return false;
		}
		
		$this->_updateNextItem(new HistoryItem(
			$schedule["item_id"],
			$schedule["index"],
			$schedule["title"],
			$schedule["artist"],
			$schedule["album"],
			$schedule["length"],
			$schedule["playtime"],
			$schedule["path"],
			$schedule["playlist_id"],
			$schedule["schedule_id"]));
		
		return true;
	}
	
	/**
	 * Check whether the active schedule is still the most appropriate
	 * @return bool
	 */
	private function _check() {
		if(!$this->_nextItem) return false;
		
		$now = new DateTime();
		$dNow = $now->format("Y-m-d");
		$tNow = $now->format("H:i:s");
		$schedule_id = $this->_nextItem->schedule_id;
		
		$query = "SELECT * FROM `schedules` as s "
				."WHERE s.begin_date <= '$dNow' "
					."AND s.end_date > '$dNow' "
					."AND s.begin_time <= '$tNow' "
					."AND s.end_time > '$tNow' "
					."AND s.enabled = 1 "
					."AND s.channel = '$this->_channel' "
				."ORDER BY s.priority DESC "
				."LIMIT 1";
		
		$schedule = Db::getInstance()->execFirstQuery($query);
		
		// Check if the schedule is still the most appropriate
		if($schedule["id"] != $schedule_id) return false;
			
		$start_date = new DateTime($schedule["begin_date"]);
		$end_date = new DateTime($schedule["end_date"]);
		$start_time = new DateTime($now->format("Y-m-d")." ".$schedule["begin_time"]);
		$end_time = new DateTime($now->format("Y-m-d")." ".$schedule["end_time"]);
		$active = $schedule["enabled"] == "1";
		
		return ($start_date <= $now && $end_date > $now && $start_time <= $now && $end_time > $now && $active);
	}
	
	/**
	 * Set the next item to be played and update the history
	 * @param HistoryItem $next The next item to be played
	 */
	private function _updateNextItem($next) {
		// Move last played item to history
		if($this->_nextItem)
			$this->_lastItems[] = $this->_nextItem;
		
		// Shift oldest item if history gets too big
		if(count($this->_lastItems) > Config::HISTORY_MAX_SIZE)
			array_shift($this->_lastItems);
		
		$this->_nextItem = $next;
	}
}

class HistoryItem
{
	public $item_id;
	public $index;
	public $title;
	public $artist;
	public $album;
	public $length;
	public $playtime;
	public $path;
	public $playlist_id;
	public $schedule_id;
	
	public function __construct($item_id,$index,$title,$artist,$album,$length,$playtime,$path,$playlist_id,$schedule_id) {
		$this->item_id = $item_id;
		$this->index = $index;
		$this->title = $title;
		$this->artist = $artist;
		$this->album = $album;
		$this->length = $length;
		$this->playtime = $playtime;
		$this->path = $path;
		$this->playlist_id = $playlist_id;
		$this->schedule_id = $schedule_id;
	}
}

?>