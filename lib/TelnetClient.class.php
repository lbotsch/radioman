<?php

class TelnetClient
{
	private $_conn;
	
	public function __construct($host, $port) {
		$this->_conn = fsockopen($host, $port);
		if($this->_conn) {
			// Read server response
			while(!feof($this->_conn)) {
				fgets($this->_conn);
			}
		}
	}
	
	public function __destruct() {
		if($this->_conn)
			$this->close();
	}
	
	public function close() {
		fputs($this->_conn, "quit\r\n");
		while(!feof($this->_conn))
			fgets($this->_conn); // Read the remaining lines
		fclose($this->_conn);
	}
	
	/**
	 * Register a channel with liquidsoap
	 * @param string $channel Channel info in the form '<mount>|<name>|<genre>|<description>'
	 */
	public function registerChannel($channel) {
		fputs($this->_conn, "channel.register $channel\r\n");
		$res = fgets($this->_conn);
		while(!feof($this->_conn))
			fgets($this->_conn); // Read the remaining lines
		return $this->_testResponse($res, "Done");
	}
	
	/**
	 * Skip the an item on a specific channel
	 * @param string $channel The channel to skip
	 */
	public function skipChannel($channel) {
		fputs($this->_conn, "$channel.skip\r\n");
		$res = fgets($this->_conn);
		while(!feof($this->_conn))
			fgets($this->_conn); // Read the remaining lines
		return $this->_testResponse($res, "Done");
	}
	
	public function getChannelStatus($channel) {
		fputs($this->_conn, "$channel.status\r\n");
		$res = fgets($this->_conn);
		while(!feof($this->_conn))
			fgets($this->_conn); // Read the remaining lines
		return $this->_trimResponse($res);
	}
	
	public function startChannel($channel) {
		if($this->getChannelStatus($channel) == "on")
			return true;
			
		fputs($this->_conn, "$channel.start\r\n");
		$res = fgets($this->_conn);
		while(!feof($this->_conn))
			fgets($this->_conn); // Read the remaining lines
		return $this->getChannelStatus($channel) == "on";
	}
	
	public function stopChannel($channel) {
		if($this->getChannelStatus($channel) == "off")
			return true;
			
		fputs($this->_conn, "$channel.stop\r\n");
		$res = fgets($this->_conn);
		while(!feof($this->_conn))
			fgets($this->_conn); // Read the remaining lines
		return $this->getChannelStatus($channel) == "off";
	}
	
	/**
	 * Get the liquidsoap daemon's uptime
	 * @return string The uptime in the following format: '00d 00h 00m 00s'
	 */
	public function getUptime() {
		fputs($this->_conn, "uptime\r\n");
		$res = fgets($this->_conn);
		while(!feof($this->_conn))
			fgets($this->_conn); // Read the remaining lines
		return $this->_trimResponse($res);
	}
	
	/**
	 * Get the liquidsoap version string
	 * @return string
	 */
	public function getVersion() {
		fputs($this->_conn, "version\r\n");
		$res = fgets($this->_conn);
		while(!feof($this->_conn))
			fgets($this->_conn); // Read the remaining lines
		return $this->_trimResponse($res);
	}
	
	private function _testResponse($res,$test) {
		return ($this->_trimResponse($res) == $test);
	}
	
	private function _trimResponse($res) {
		return str_replace(array("\n","\r"," ","\t","\0"), "", $res);
	}
}

?>