<?php
    $executionStartTime = microtime(true);
    $api = 'manoj82';
    $url = 'http://api.geonames.org/countryInfoJSON?formatted=true&lang=en&country='.$_GET['iso2'].'&username=manoj182&style=full';
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