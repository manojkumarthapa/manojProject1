<?php
    $executionStartTime = microtime(true);
    $string = file_get_contents('../js/countryBorders.geo.json');
    $theFeature = json_decode($string,true)['features'];




    function sorting($a, $b){
        return $a['properties']['name'] <=> $b['properties']['name'];
    }
    usort($theFeature, "sorting");
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $theFeature;

        
    header('Content-type: application/json', 'charset=UTF-8');
    echo json_encode($theFeature);



?>