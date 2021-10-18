<?php

$api = 'd025bfa7386c489c9a801f00ed7dff01';
$url = 'https://openexchangerates.org/api/latest.json?app_id='.$api;
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