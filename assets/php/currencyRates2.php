<?php
    $executionStartTime = microtime(true);
    $api = 'fb27523238d2b2e5b237';
    $url = 'https://free.currconv.com/api/v7/convert?q='.$_GET['from'].'_'.$_GET['to'].','.$_GET['to'].'_'.$_GET['from'].'&compact=ultra&apiKey='.$api;

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