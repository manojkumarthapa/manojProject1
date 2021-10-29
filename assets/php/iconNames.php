<?php

$dir = '../img/';
$fileNames = scandir($dir);

$output['data'] = $fileNames;



// header('Content-type: application/json', 'charset=UTF-8');
echo json_encode($fileNames);
// print_r($fileNames);

?>