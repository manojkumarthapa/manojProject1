let countryJSON = "assets/js/countryBorders.geo.json";

let map = L.map("myMap").setView([0, 0], 2);


L.tileLayer(
  "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=fKzuYDqbLK8jPu9bReiP",
  {
    attribution:
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
  }
).addTo(map);

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

// Weather API
function weather(lat, lng){
  $.ajax({
    url: 'assets/php/weather.php',
    method: 'POST',
    data: {
       'lat': lat,
       'lng': lng
    },
    success: function(item){
      console.log(item);
      let country = item['data']['sys']['country'];
      let city = item['data']['name'];
      let temperature = item['data']['main']['temp'];
      let weather = item['data']['weather'][0]['description'];

      $('#result').html(
        `
        <h3>Country: ${country}</h3>
        <h3>City: ${city}</h3>
        <h3>Temperature: ${temperature}&#8451;</h3>
        <h3>Weather: ${weather}</h3>
        `
      );
    }
  })
}

// Time API
function getTime(lat, lng){
  $.ajax({
    url: 'assets/php/time.php',
    method: 'POST',
    data: {
       'lat': lat,
       'lng': lng
    },
    success: function(item){
      console.log(item);
      let time = item['data']['time'].slice(-6);
      $('#result').append(
        `
        <h3>Time: ${time} </h3>
        `)
    }
  })
}



// MarkerCluster
var markers = L.markerClusterGroup({
  zoomToBoundsOnClick: true,
  showCoverageOnHover: true,
  animate: true

});
map.addLayer(markers);







// adds marker to current location of device
navigator.geolocation.getCurrentPosition((result, options) => {
  L.marker([result["coords"]["latitude"], result["coords"]["longitude"]]).addTo(
    map
  );
  weather(result["coords"]["latitude"],result["coords"]["longitude"]);
  getTime(result["coords"]["latitude"],result["coords"]["longitude"]);
  markers.addLayer(L.marker([result["coords"]["latitude"], result["coords"]["longitude"]]));
});



// EasyButton
// Zooms on current Location
L.easyButton('fa-globe', function(){
    navigator.geolocation.getCurrentPosition((result ,options)=>{
      $('#lat').val(result['coords']['latitude']);
      $('#lng').val(result['coords']['longitude']);
      map.setView([result['coords']['latitude'],result['coords']['longitude']],16);
    })
}).addTo(map);

// Toggles sidebar
L.easyButton('fa-sliders-h', function(){
    sidebar.toggle();
}).addTo(map);
// Adds sidebar

var sidebar = L.control.sidebar('sidebar', {
    position: 'left',
    // closeButton: false
});
map.addControl(sidebar);
setTimeout(function () {
    sidebar.show();
}, 500);










$(document).ready(function () {
  // Adds country names in select tag from json file
  $("nav").html('<label for="country">Choose a country:  </label>');
  $("nav").append(
    '<select name="country" id="country" onmousedown="if(this.options.length > 5){this.size = 5}" onchange="this.size=0">'
  );
  $.getJSON(countryJSON, function (countries) {
    $(countries["features"]).each(function (numb, data) {
      // Cant add img beside option
      // numb = '<img src="https://www.countryflags.io/'+ data['properties']['iso_a2']+'/shiny/16.png">'
      // console.log(numb);
      $("#country").append(
        '<option class = "country" value=' +
          data["properties"]["name"] +
          ">" +
          data["properties"]["name"] +
          "</option>"
      );
    });
  });
  $("nav").append("</select>");

  $('#viewLatlng').click(function(){
    let lat = $('#lat').val();
    let lng = $('#lng').val();
    map.setView([lat,lng],13);
    L.marker([lat, lng]).addTo(map)
    markers.addLayer(L.marker([lat, lng]));
    $('#lat').val('');
    $('#lng').val('');
    weather(lat,lng);
    getTime(lat,lng);
  });



});