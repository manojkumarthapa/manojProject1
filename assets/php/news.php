<?php
    $executionStartTime = microtime(true);
    $api = 'c846b509b8f9994079ea684d20d1c2f2';
    $url = 'http://api.mediastack.com/v1/news?access_key='.$api.'&countries='.$_GET['iso2'].'&date='.$_GET['date'].'&limit=10';
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $result = curl_exec($ch);
    curl_close($ch);

    $decode = json_decode($result, true);
    $output['status']['code'] = '200';
    $output['status']['name'] = 'ok';
    $output['status']['description'] = 'success';
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $decode;



    header('Content-type: application/json', 'charset=UTF-8');
    echo json_encode($output);

?>