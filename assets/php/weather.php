<?php

$api = '5b31ad55162995023d38734566c1b53c';
$url = 'http://api.openweathermap.org/data/2.5/weather?lat='.$_POST['lat'].'&lon='.$_POST['lng'].'&appid='.$api.'&units=metric';
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$result = curl_exec($ch);
curl_close($ch);

$decode = json_decode($result, true);
$output['status']['code'] = '200';
$output['status']['name'] = 'ok';
$output['status']['description'] = 'success';
$output['data'] = $decode;



header('Content-type: application/json', 'charset=UTF-8');
echo json_encode($output);

?>