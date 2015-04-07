<?php

if(!empty($_GET) && $_GET["manga"]) {
	$path = dirname(__FILE__) . "/../manga/" . $_GET["manga"];

	$dir = new DirectoryIterator($path);
	
	$data = array("chapters"=> array());
	
	foreach ($dir as $fileinfo) {
		if (!$fileinfo->isDot() && $fileinfo->getFilename() !== ".DS_Store") {
			array_push($data["chapters"], $fileinfo->getFilename());
		}
	}
	
	header('Content-Type: application/json; charset=UTF-8');
	echo json_encode($data);
}
?>