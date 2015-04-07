<?php

if(!empty($_GET) && $_GET["manga"] && $_GET["chapter"]) {
	$path = dirname(__FILE__) . "/../manga/" . $_GET["manga"] . "/" . $_GET["chapter"];

	$dir = new DirectoryIterator($path);
	
	$data = array("pages"=> array());
	
	foreach ($dir as $fileinfo) {
		if (!$fileinfo->isDot() && $fileinfo->getFilename() !== ".DS_Store") {
			array_push($data["pages"], array( "page"=>preg_replace('/\\.[^.\\s]{3,4}$/', '', $fileinfo->getFilename()), "img"=>$fileinfo->getFilename(), ) );
		}
	}
	
	header('Content-Type: application/json; charset=UTF-8');
	echo json_encode($data);
}
?>