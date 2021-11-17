<?php
    $executionStartTime = microtime(true);
    $string = file_get_contents('../js/countryBorders.geo.json');
    $jizz1 = json_decode($string,true)['features'];




    function knn($a, $b){
        return $a['properties']['name'] <=> $b['properties']['name'];
    }
    usort($jizz1, "knn");
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $jizz1;

        
    header('Content-type: application/json', 'charset=UTF-8');
    echo json_encode($jizz1);



?>