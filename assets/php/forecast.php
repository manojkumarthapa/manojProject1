<?php

    $executionStartTime = microtime(true);
    $key = '5627b73bddbdf19bb7bd029084d70ce8';
    $url = 'https://api.openweathermap.org/data/2.5/onecall?lat='.$_GET['lat'].'&lon='.$_GET['lng'].'&exclude=minutely,hourly,alerts&units=metric&appid='.$key;
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