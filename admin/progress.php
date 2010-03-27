<?php

$upload = apc_fetch('upload_'.$_POST["UPLOAD_IDENTIFIER"]);

if($upload) {
	if ($upload['done'])
		$percent = 100;
	else if ($upload['total'] == 0)
		$percent = 0;
	else
		$percent = $upload['current'] / $upload['total'] * 100;

	header("Content-Type: application/json, charset=utf-8");
	print '{'
		.'"bytesTotal": '.$upload['total']
		.',"bytesUploaded": '.$upload['current']
		.'}';
	exit();
}
print '{"error": "Upload not found... (id='.$_POST["UPLOAD_IDENTIFIER"].')"}';

?>