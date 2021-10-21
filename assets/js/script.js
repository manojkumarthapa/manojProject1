let countryJSON = "assets/js/countryBorders.geo.json";
let countryLocation = 'assets/js/countryInfo.json';





// MarkerCluster
var markers = L.markerClusterGroup();



let map = L.map("myMap").setView([0, 0], 2);
// map.addLayer(markers);


L.tileLayer(
  "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=fKzuYDqbLK8jPu9bReiP",
  {
    attribution:
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
  }
).addTo(map);

// Add mouse Position
L.control.mousePosition().addTo(map);






var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

let countryInfoArray = [];



// CountryInfo
$.getJSON(countryLocation, function (item) {
  $(item).each(function (x, y) {
    countryInfoArray.push(y);
  })
})

console.log(countryInfoArray);


// Weather API
function weather(lat, lng) {
  $.ajax({
    url: 'assets/php/weather.php',
    method: 'POST',
    data: {
      'lat': lat,
      'lng': lng
    },
    success: function (item) {
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
function getTime(lat, lng) {
  $.ajax({
    url: 'assets/php/time.php',
    method: 'POST',
    data: {
      'lat': lat,
      'lng': lng
    },
    success: function (item) {
      let time = item['data']['time'].slice(-6);
      $('#result').append(
        `
        <h3>Time: ${time} </h3>
        `)
    }
  })
}

// Currency API
function getCurrencyRates() {

  $.ajax({
    url: 'assets/php/currencyRates.php',
    method: 'GET',
    success: function (item) {
      let rates = item['rates'];
      let countryShortHand = Object.keys(rates);
      let fromSelected = '';
      let toSelected = '';
      $('#currencyCountryBase').click(function () {
        fromSelected = $('#currencyCountryBase').val();
      });

      $('#currencyCountryExchanged').click(function () {
        toSelected = $('#currencyCountryExchanged').val();
      });


      $('#currencySendAmt').val(1);
      $('#currencyReceiveAmt').val(1);
      for (let j = 0; j < countryShortHand.length; j++) {
        let code = countryShortHand[j];
        $('#currencyCountryBase').append(`
        <option value=${code}>${code}</option>
        `);
      }
      for (let j = 0; j < countryShortHand.length; j++) {
        let code = countryShortHand[j];
        $('#currencyCountryExchanged').append(`
        <option value=${code}>${code}</option>
        `);
      }
    }

  })


}
// Updates the value of the currencey
function updateRateFrom(currencyFrom, currencyTo, newCurrencyFrom) {
  $.ajax({
    url: 'assets/php/currencyRates2.php',
    method: 'GET',
    data: {
      'from': currencyFrom,
      'to': currencyTo
    },
    success: function (item) {
      let rate = `${currencyFrom}_${currencyTo}`;
      let receiving = item[rate] * newCurrencyFrom;
      $('#currencyValue').text(receiving);
      console.log(receiving);
    }
  })
}

// Find Lat and Lng api from OpenCage
function findLatAndLng(city, country){
  if(city.search(' ')){
    let city1 = city.replace(' ', '%20');
    console.log(city1);
    city = city1;
  }
  if(country.search(' ')){
    let country1 = country.replace(' ', '%20');
    country = country1;
  }
  $.ajax({
    url: 'assets/php/findLatLng.php',
    method: 'GET',
    data: {
      'city': city,
      'country' : country
    },
    success: function(item){
      // console.log(item);
      // return item['results'];
      console.log(item['results'][0]['geometry']['lat'])
    }
  })
}

// wiki api
function wiki(lat, lng){
  $.ajax({
    url: 'assets/php/wiki.php',
    method: 'GET',
    data: {
      'lat': lat,
      'lng': lng
    },
    success: function(item){
      for(let x = 0; x<= item.length; x++){
        $('#result').append(`
        <h3>${item['geoname']['title']}</h3>
        <p>${item['geoname']['summary']}</p>
        <a href=${item['geoname']['wikipediaUrl']}Click for more info</a>
        `)
      }
    }
  })
}



// Clear Result section
function clearResult() {
  $('#result').html("");
};


// Country in index
let countryIndex = [];

$.getJSON(countryJSON, function (country) {
  for (let x = 0; x < country['features'].length; x++) {
    countryIndex.push(country['features'][x]['properties']['name']);
  }
})








// adds marker to current location of device
navigator.geolocation.getCurrentPosition((result, options) => {
  weather(result["coords"]["latitude"], result["coords"]["longitude"]);
  getTime(result["coords"]["latitude"], result["coords"]["longitude"]);
  getCurrencyRates();
  markers.addLayer(L.marker([result["coords"]["latitude"], result["coords"]["longitude"]]));
  map.addLayer(markers);
});



// EasyButton
// Zooms on current Location
L.easyButton('fa-globe', function () {
  navigator.geolocation.getCurrentPosition((result, options) => {
    $('#lat').val(result['coords']['latitude']);
    $('#lng').val(result['coords']['longitude']);
    map.setView([result['coords']['latitude'], result['coords']['longitude']], 16);

  })
}).addTo(map);

// Toggles sidebar
L.easyButton('fa-sliders-h', function () {
  sidebar.toggle();
}).addTo(map);
// Adds sidebar

var sidebar = L.control.sidebar('sidebar', {
  position: 'left'
});
map.addControl(sidebar);
setTimeout(function () {
  sidebar.show();
}, 500);

$(document).ready(function () {

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

  $('#viewLatlng').click(function () {
    let lat = $('#lat').val();
    let lng = $('#lng').val();
    map.setView([lat, lng], 13);
    // L.marker([lat, lng]).addTo(map)
    markers.addLayer(L.marker([lat, lng]));
    map.addLayer(markers);
    $('#lat').val('');
    $('#lng').val('');
    weather(lat, lng);
    getTime(lat, lng);
  });


  $('#currencyCountryBase').click(function () {
    let countryBase = $('#currencyCountryBase').val();
    let countryExchanged = $('#currencyCountryExchanged').val();
    let currencySendAmt = $('#currencySendAmt').val();
    updateRateFrom(countryBase, countryExchanged, currencySendAmt);
  });

  $('#currencySendAmt').change(function () {
    let countryBase = $('#currencyCountryBase').val();
    let countryExchanged = $('#currencyCountryExchanged').val();
    let currencySendAmt = $('#currencySendAmt').val();
    updateRateFrom(countryBase, countryExchanged, currencySendAmt);
  })


  $('#currencyCountryExchanged').click(function () {
    let countryBase = $('#currencyCountryBase').val();
    let countryExchanged = $('#currencyCountryExchanged').val();
    let currencySendAmt = $('#currencySendAmt').val();
    updateRateFrom(countryBase, countryExchanged, currencySendAmt);
  });

  // nav select tag
  $('#country').click(function () {
    let countryValue = $('#country').val();

    
    $.getJSON(countryJSON, function (country) {

      for (let x = 0; x < countryIndex.length; x++) {
        if (countryIndex[x].startsWith(countryValue)) {
          countryValue = countryIndex[x];
          let index = countryIndex.indexOf(countryValue);
          let knn = country['features'][index]['geometry'];
          let iso2 = country['features'][index]['properties']['iso_a2'];
          let countryName ="";
          let capitalName ="";
          $.ajax({
            url: 'assets/php/countryInfo.php',
            method: 'GET',
            data: {
              'iso2': iso2
            },
            success: function(details){
              countryName = details['geonames'][0]['countryName'];
              capitalName = details['geonames'][0]['capital'];
              // let latAndLng = findLatAndLng(details['geonames'][0]['countryName'], details['geonames'][0]['capital']);
              // console.log(findLatAndLng(item['geonames'][0]['countryName'], item['geonames'][0]['capital']));
              // let arrayLength = Math.floor((findLatAndLng(item['geonames'][0]['countryName'], item['geonames'][0]['capital'])['results'])/2);
              // console.log(arrayLength);
              $('#result').html(`
              <h3>Country: ${details['geonames'][0]['countryName']}</h3>
              <h3>Capital: ${details['geonames'][0]['capital']}</h3>
              <h3>Population: ${details['geonames'][0]['population']}</h3>
              `)
              // wiki(latAndLng['results'][0]['geometry']['lat'], latAndLng[0]['results']['geometry']['lng']);
            }
          }
          

          
          
          )

          L.geoJSON(knn).bindPopup(countryValue).addTo(map);


          if(knn['type'] == 'MultiPolygon'){
            knnLength = Math.floor((knn['coordinates'][0][0].length)/2);
            map.setView([knn['coordinates'][0][0][knnLength][1],knn['coordinates'][0][0][knnLength][0]],7);
          }else{
            knnLength = Math.floor((knn['coordinates'][0].length)/2);
            map.setView([knn['coordinates'][0][knnLength][1],knn['coordinates'][0][knnLength][0]],5);
          };
        }

      }
    })
  });
});
