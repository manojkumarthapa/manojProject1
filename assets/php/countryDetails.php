<?php

    $executionStartTime = microtime(true);
    $countryDetails = file_get_contents('../js/countryBorders.geo.json');
    $countryFeatures = json_decode($countryDetails,true)['features'];
    
    $border;

    foreach ($countryFeatures as $feature) {
        if ($feature["properties"]['iso_a2'] == $_GET['iso2']) {
            $border = $feature['geometry'];
            break;
        }
    }
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $border;

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);




?>