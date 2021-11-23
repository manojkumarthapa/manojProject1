<?php
    $executionStartTime = microtime(true);
    $api = '8a87cd470a03403aadb1e5f3754e6b9b';
    $url = 'https://openexchangerates.org/api/latest.json?app_id='.$api;
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $result = curl_exec($ch);
    curl_close($ch);

    $decode = json_decode($result, true);
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $decode;



    header('Content-type: application/json', 'charset=UTF-8');
    echo json_encode($decode);

?>