<?php
$string = file_get_contents('../js/countryBorders.geo.json');
$jizz1 = json_decode($string,true)['features'];




function knn($a, $b){
    return $a['properties']['name'] <=> $b['properties']['name'];
}
usort($jizz1, "knn");
$output['data'] = $jizz1;

echo json_encode($jizz1);


?>