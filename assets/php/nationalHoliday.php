<?php

    $executionStartTime = microtime(true);
    $api = '31229636-7db0-437f-9ca9-0d02c5e64083';
    $url = 'https://date.nager.at/api/v3/publicholidays/'.$_GET['year'].'/'.$_GET['iso2'];
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