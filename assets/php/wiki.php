<?php

$api = 'manoj182';
$url = 'http://api.geonames.org/findNearbyWikipediaJSON?lat='.$_GET['lat'].'&lng='.$_GET['lng'].'&username='.$api;
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$result = curl_exec($ch);
curl_close($ch);

$decode = json_decode($result, true);

$output['data'] = $decode;



header('Content-type: application/json', 'charset=UTF-8');
echo json_encode($decode);

?>