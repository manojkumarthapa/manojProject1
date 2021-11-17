<?php
    $executionStartTime = microtime(true);
    $api = '587d47b12f264271b313c96e2467eb2c';
    $url = 'https://api.opencagedata.com/geocode/v1/json?q='.$_GET['city'].','.$_GET['country'].'&key='.$api.'&language=en&pretty=1';
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