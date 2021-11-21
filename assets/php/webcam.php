<?php
    $executionStartTime = microtime(true);
    $url = "https://webcamstravel.p.rapidapi.com/webcams/list/country=".$_GET['iso2']."?lang=en&show=webcams%3Aimage%2Clocation%2Cplayer";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
		"x-rapidapi-host: webcamstravel.p.rapidapi.com",
		"x-rapidapi-key: 8c19435526msh21a02a486f99271p19d8f4jsn415429f18c0f"
	]);

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

