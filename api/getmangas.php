<?php

	$path = dirname(__FILE__) . "/../manga";

	$dir = new DirectoryIterator($path);
	
	$data = array("mangas"=> array());
	
	foreach ($dir as $fileinfo) {
		if (!$fileinfo->isDot() && $fileinfo->getFilename() !== ".DS_Store") {
			array_push($data["mangas"], $fileinfo->getFilename());
		}
	}
	
	header('Content-Type: application/json; charset=UTF-8');
	echo json_encode($data);
?>