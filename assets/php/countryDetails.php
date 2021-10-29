<?php
$string = file_get_contents('../js/countryBorders.geo.json');
$jizz1 = json_decode($string,true)['features'];




function knn($a, $b){
    return $a['properties']['name'] <=> $b['properties']['name'];
}
usort($jizz1, "knn");
// Returns countryBorders.geo.json in alphabetical order
$nameAndIso = [] ;
$container = [];
// Return border in lat and lng
for($i = 0; $i < count($jizz1); $i++) {
    $container = [];
    array_push($container, $jizz1[$i]['geometry']['coordinates']);
    array_push($nameAndIso, $container);
};
$output['data'] = $nameAndIso;
// print_r($nameAndIso);
echo json_encode($nameAndIso);



?>