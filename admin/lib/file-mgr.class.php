<?php

class FileManager
{
  private $_fsRoot = "";
  private $_clRoot = "library";
  private $_response = "";
  private $_headers = array();

  public function __construct($root,$clRoot=null) {
    $this->_fsRoot = $root;
    if($clRoot) $this->_clRoot = $clRoot;
  }
  
  public function getResponse() { return $this->_response; }
  public function getHeaders() { return $this->_headers; }
  
  public function handleRequest($args) {
    $cmd = $args["cmd"];
    $status = false;
    switch($cmd) {
      case "get":
        $status = $this->_handleGet($args);
        break;
      case "rename":
        $status = $this->_handleRename($args);
        break;
      case "newdir":
        $status = $this->_handleNewdir($args);
        break;
      case "delete":
        $status = $this->_handleDelete($args);
        break;
      case "upload":
        $status = $this->_handleUpload($args);
        break;
      case "download":
      	$status = $this->_handleDownload($args);
      	break;
    }
    
  }
  
  public function sendResponse() {
    foreach($this->_headers as $h) {
      header($h);
    }
    echo $this->_response;
  }
  
  private function _handleGet($args) {
    $this->_headers[] = "Content-Type: application/json, charset=utf-8";
    if(!$args["path"]) return false;
    $path = $this->_getServerPath($args["path"]);
    $dir = opendir($path);
    $files = array();
    
    // GetId3
    require_once 'getid3/getid3.php';
    $getID3 = new getID3;
    $getID3->setOption(array(
        'encoding' => 'UTF-8',
        'option_tag_apetag' => false,
        'option_tag_lyrics3' => false
    ));
    
    while($e = readdir($dir)) {
      if($e == "." || $e == "..") continue;
      
      $title = "";
      $artist = "";
      $playtime = "";
      
      if(filetype($path."/".$e) == "dir") {
        $ft = "folder";
        $qtip = "";
      } else {
        $ext = split("[/\\.]",strtolower($e));
        $ft = "file-".$ext[count($ext)-1];
        if(strpos(strtolower($e), ".mp3") > -1) {
          $fileinfo = $getID3->analyze($path."/".$e);
          $title = $fileinfo['tags_html']['id3v1']['title'][0];
          if(!$title) $title = $fileinfo['tags_html']['id3v2']['title'][0];
          $artist = $fileinfo['tags_html']['id3v1']['artist'][0];
          if(!$artist) $artist = $fileinfo['tags_html']['id3v2']['artist'][0];
          $playtime = $fileinfo['playtime_string'];
          $qtip = ',"qtip":"'
                  . 'Title: '.$title.'<br/>'
                  . 'Artist: '.$artist.'<br/>'
                  . 'Format: '.$fileinfo['audio']['dataformat'].'<br/>'
                  . 'Codec: '.$fileinfo['audio']['codec'].'<br/>'
                  . 'Bitrate: '.sprintf("%.2f",$fileinfo['audio']['bitrate'] / 1024).'kbit '.$fileinfo['audio']['bitrate_mode'].'<br/>'
                  . 'Filesize: '.sprintf("%.2f",$fileinfo['filesize'] / 1024).'kb<br/>'
                  . 'Playtime: '.$playtime.'"';
          $title = ', "title": "'.$title.'"';
          $artist = ', "artist": "'.$artist.'"';
          $playtime = ', "playtime": "'.$playtime.'"';
        } else {
          $qtip = ',"qtip":"Filesize: '.sprintf("%.2f",filesize($path."/".$e) / 1024).'kb"';
        }
        
        $itemPath = ', "path": "'.$args["path"].'/'.$e.'"';
      }
      $files[] = '{"text":"'.$e.'","iconCls":"'.$ft.'","disabled":false,"leaf":'.($ft == "folder" ? "false" : "true").$qtip.$itemPath.$title.$artist.$playtime.'}';
    }
    $this->_response = '['.implode(",", $files).']';
    return true;
  }
  
  private function _handleRename($args) {
    $this->_headers[] = "Content-Type: application/json, charset=utf-8";
    if(!$args["newname"] || !$args["oldname"]) {
      $this->_response = '{"success":false,"error":"Argument error!"}';
      return false;
    }
    $oldname = $this->_getServerPath($args["oldname"]);
    $newname = $this->_getServerPath($args["newname"]);
    
    if(!rename($oldname, $newname)) {
      $this->_response = '{"success":false,"error":"Couldn\'t rename '.$args["oldname"].' to '.$args["newname"].'!"}';
      return false;
    }
    
    $this->_response = '{"success":true}';
    return true;
  }
  
  private function _handleNewdir($args) {
    $this->_headers[] = "Content-Type: application/json, charset=utf-8";
    if(!$args["dir"]) {
      $this->_response = '{"success":false,"error":"Argument error!"}';
      return false;
    }
    $dir = $this->_getServerPath($args["dir"]);
    
    if(!mkdir($dir)) {
      $this->_response = '{"success":false,"error":"Couldn\'t create directory '.$args["dir"].'!"}';
      return false;
    }
    
    $this->_response = '{"success":true}';
    return true;
  }
  
  private function _handleDelete($args) {
    $this->_headers[] = "Content-Type: application/json, charset=utf-8";
    if(!$args["file"]) {
      $this->_response = '{"success":false,"error":"Argument error!"}';
      return false;
    }
    $file = $this->_getServerPath($args["file"]);
    $res = false;
    if(filetype($file) == "dir")
      $res = $this->delTree($file);
    else
      $res = unlink($file);
      
    if(!$res) {
      $this->_response = '{"success":false,"error":"Couldn\'t delete file '.$args["file"].'!"}';
      return false;
    }
    
    $this->_response = '{"success":true}';
    return true;
  }
  
  private function _handleUpload($args) {
    $this->_headers[] = "Content-Type: text/html, charset=utf-8";
    if(!$args["path"] || count($_FILES) == 0) {
      // Ignore argument error and no file
      exit();
    }
    $path = $this->_getServerPath($args["path"]);
    $errors = array();
    foreach($_FILES as $id => $file) {
      if($file["error"] !=  UPLOAD_ERR_OK) {
        switch($file["error"]) {
          default:
            $errors[] = '"'.$id.'":"File upload failed."';
            break;
          case UPLOAD_ERR_NO_FILE:
          case UPLOAD_ERR_PARTIAL:
            break;
          case UPLOAD_ERR_INI_SIZE:
          case UPLOAD_ERR_FORM_SIZE:
            $errors[] = '"'.$id.'":"File too big."';
            break;
        }
        continue;
      }
      if(!move_uploaded_file($file["tmp_name"], $path.'/'.basename($file['name']))) {
        $errors[] = '"'.$id.'":"File upload failed."';
      }
    }
    
    if(count($errors) > 0) {
      $this->_response = '{"success":false,"errors":{'.implode(",",$errors).'}';
      return false;
    }
    
    $this->_response = '{"success":true}';
    return true;
  }
  
  private function _handleDownload($args) {
  	if(!$args["path"]) return false;
  	$path = $this->_getServerPath($args["path"]);
  	$this->_output_file($path, basename($path));
  }
  
  private function _getServerPath($path) {
    return str_replace($this->_clRoot, $this->_fsRoot, $path);
  }
  
  private function delTree($dir) {
    $files = glob( $dir . '*', GLOB_MARK );
    $res = true;
    foreach( $files as $file ){
        if( substr( $file, -1 ) == '/' )
            $res = $this->delTree( $file );
        else
            $res = unlink( $file );
        
        if(!$res) return false;
    }
   
    if (is_dir($dir))
      $res = rmdir( $dir );
    
    return $res;
  }
  
  private function _output_file($file, $name, $mime_type='')
  {
	 /*
	 This function takes a path to a file to output ($file), 
	 the filename that the browser will see ($name) and 
	 the MIME type of the file ($mime_type, optional).
	 
	 If you want to do something on download abort/finish,
	 register_shutdown_function('function_name');
	 */
	 if(!is_readable($file)) die('File not found or inaccessible!');
	 
	 $size = filesize($file);
	 $name = rawurldecode($name);
	 
	/* Figure out the MIME type (if not specified) */
	$known_mime_types=array(
	"pdf" => "application/pdf",
	"txt" => "text/plain",
	"html" => "text/html",
	"htm" => "text/html",
	"exe" => "application/octet-stream",
	"zip" => "application/zip",
	"doc" => "application/msword",
	"xls" => "application/vnd.ms-excel",
	"ppt" => "application/vnd.ms-powerpoint",
	"gif" => "image/gif",
	"png" => "image/png",
	"jpeg"=> "image/jpg",
	"jpg" => "image/jpg",
	"php" => "text/plain",
	"mp3" => "audio/mpeg"
	 );
	 
	 if($mime_type==''){
	 	$file_extension = strtolower(substr(strrchr($file,"."),1));
	 	if(array_key_exists($file_extension, $known_mime_types)){
			$mime_type=$known_mime_types[$file_extension];
	 	} else {
			$mime_type="application/force-download";
	 	};
	 };
	 
	 @ob_end_clean(); //turn off output buffering to decrease cpu usage
	 
	 // required for IE, otherwise Content-Disposition may be ignored
	 if(ini_get('zlib.output_compression'))
	 	ini_set('zlib.output_compression', 'Off');
	 
	 header('Content-Type: ' . $mime_type);
	 header('Content-Disposition: attachment; filename="'.$name.'"');
	 header("Content-Transfer-Encoding: binary");
	 header('Accept-Ranges: bytes');
	 
	 /* The three lines below basically make the 
	    download non-cacheable */
	 header("Cache-control: private");
	 header('Pragma: private');
	 header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
	 
	// multipart-download and download resuming support
	if(isset($_SERVER['HTTP_RANGE']))
	{
		list($a, $range) = explode("=",$_SERVER['HTTP_RANGE'],2);
		list($range) = explode(",",$range,2);
		list($range, $range_end) = explode("-", $range);
		$range=intval($range);
		if(!$range_end) {
			$range_end=$size-1;
		} else {
			$range_end=intval($range_end);
		}
	 
		$new_length = $range_end-$range+1;
		header("HTTP/1.1 206 Partial Content");
		header("Content-Length: $new_length");
		header("Content-Range: bytes $range-$range_end/$size");
	} else {
		$new_length=$size;
		header("Content-Length: ".$size);
	}
	 
	/* output the file itself */
	$chunksize = 1*(1024*1024); //you may want to change this
	$bytes_send = 0;
	if ($file = fopen($file, 'r'))
	{
		if(isset($_SERVER['HTTP_RANGE']))
			fseek($file, $range);
	 
		while(!feof($file) && 
			(!connection_aborted()) && 
			($bytes_send<$new_length))
		{
			$buffer = fread($file, $chunksize);
			print($buffer); //echo($buffer); // is also possible
			flush();
			$bytes_send += strlen($buffer);
		}
	 	fclose($file);
	 } else return false;
	 
	 die();
  }
}

?>
