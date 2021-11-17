<?php

$executionStartTime = microtime(true);
$countryDetails = file_get_contents('../js/countryBorders.geo.json');
$countryFeatures = json_decode($countryDetails,true)['features'];


function sortAlphabetical($a, $b){
    return $a['properties']['name'] <=> $b['properties']['name'];
}
usort($countryFeatures, "sortAlphabetical");
// Returns countryBorders.geo.json in alphabetical order


$nameAndIso = [] ;
$container = [];

foreach ($countryFeatures as $feature) {
    $tempContainer= [];
    array_push($tempContainer, $feature['properties']['name']);
    array_push($tempContainer, $feature['properties']['iso_a2']);
    array_push($nameAndIso, $tempContainer);
        
};


$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $nameAndIso;

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);

?>