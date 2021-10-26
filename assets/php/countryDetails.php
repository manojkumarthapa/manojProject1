<?php
$string = file_get_contents('../js/countryBorders.geo.json');
$jpt1 = json_decode($string,true)['features'];


function knn($a, $b){
    return $a['properties']['name'] <=> $b['properties']['name'];
}
usort($jpt1, "knn");
$output['data'] = $jpt1;


echo json_encode($jpt1);


?>