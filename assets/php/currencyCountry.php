<?php

$api = '02f7f0e573d74644b585267ea6055d12';
$url = 'https://openexchangerates.org/api/currencies.json?app_id='.$api.'&base='.$_GET['base'];
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