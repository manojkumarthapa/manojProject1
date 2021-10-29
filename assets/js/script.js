




// MarkerCluster
var markers = L.markerClusterGroup();



// maker icons in arrays
  let iconNames =[];
  $.ajax({
  url: 'assets/php/iconNames.php',
  success: function(data){
    let jyaw = data.split(",")
    jyaw.shift()
    jyaw.shift()
    for(let i = 0; i< jyaw.length; i++){
      jyaw[i] = jyaw[i].slice(1)
      jyaw[i] = jyaw[i].slice(0,-1)
    }
    jyaw[14] = jyaw[14].slice(0,-1)
    jyaw.forEach(function(item, numb){
      iconNames.push(item)
    })
    } 
  })

  
let currentMarker = L.icon({
  iconUrl: "assets/img/star-3.png",
  iconSize: [32,37],
  iconAnchor: [16,37],
  popupAnchor: [0, -30]
})




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

      $('#result').append(
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
      for(let x = 0; x< item['geonames'].length; x++){
        $('#result').append(`
        <details>
        <summary>${item['geonames'][x]['title']}</summary>
        <p>${item['geonames'][x]['summary']}</p>
        <a href=http://${item['geonames'][x]['wikipediaUrl']} target="_blank">Click for more info</a>
        </details> 
        `)
      }
    }
  })
}



// Find Lat and Lng api from OpenCage
function findLatAndLng(city, country){
  if(city.search(' ')){
    let city1 = city.replace(' ', '%20');

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


    let theLat = item['results'][0]['geometry']['lat'];
    let theLng = item['results'][0]['geometry']['lng']
    weather(theLat, theLng);
    getTime(theLat, theLng);
    wiki(theLat, theLng);

    }
  })
}


// Clear Result section
function clearResult() {
  $('#result').html("");
};



// adds marker to current location of device
navigator.geolocation.getCurrentPosition((result, options) => {
  weather(result["coords"]["latitude"], result["coords"]["longitude"]);
  getTime(result["coords"]["latitude"], result["coords"]["longitude"]);
  getCurrencyRates();
  markers.addLayer(L.marker([result["coords"]["latitude"], result["coords"]["longitude"]],{icon: currentMarker}));
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
  let countryIndex = [];
  let iso2;
  iconNames.splice(11,1);

  $.ajax({
    url: 'assets/php/countrySortName.php',
    success: function(item){

      let data = JSON.parse(item);
      $(data).each(function(numb, item1){
        
        countryIndex.push(item1);
        $('#country').append(
          '<option class = "country" value = ' + '"' +
          item1[0] + '"' +
          '>' +
          item1[0] +
          '</option>'
        )
        $("nav").append("</select>");
      })

    }
  })
  $('#country').click(function(){
    $('#result').html("");


    let countryValue = $('#country').val();
    let currentIndex;
    let knn;
    let iso3;
    let knnType;
    // let geometry;
    let currentLatLng;
    for (let i =0; i <countryIndex.length;i++){
      if(countryIndex[i][0] == countryValue){
        currentIndex = i;
      }
    }

    $.ajax({
      url: 'assets/php/countryDetails.php',
      success: function(item){
        let data = JSON.parse(item);
        currentLatLng = data[currentIndex];
        $.ajax({
              url: 'assets/php/fullGeometry.php',
              success: function(details){
                let data1 = JSON.parse(details);
                let geometry = data1[currentIndex]['geometry'];
                let knnType = data1[currentIndex]['geometry']['type'];
                L.geoJSON(geometry).bindPopup(countryValue).addTo(map);
                if(knnType == 'MultiPolygon'){
                  let knnFullLength = geometry['coordinates'][0][0].length;
                let knnLength = Math.floor((geometry['coordinates'][0][0].length)/2);
                map.setView([geometry['coordinates'][0][0][knnLength][1],geometry['coordinates'][0][0][knnLength][0]],7);
                for(let i = 0; i< knnFullLength; i++){
                  let randomNumber = Math.floor(Math.random() * 14);
                  let randomMarker = L.icon({
                  iconUrl: "assets/img/"+iconNames[randomNumber],
                  iconSize: [32,37],
                  iconAnchor: [16,37],
                  popupAnchor: [0, -30]
                  })
                  markers.addLayer(L.marker([geometry['coordinates'][0][0][i][1],geometry['coordinates'][0][0][i][0]], {icon: randomMarker}));
                }

                map.addLayer(markers);

              }else if(knnType == 'Polygon'){
                let knnFullLength = geometry['coordinates'][0].length;
                let knnLength = Math.floor((geometry['coordinates'].length)/2);
                map.setView([geometry['coordinates'][0][knnLength][1],geometry['coordinates'][0][knnLength][0]],5);

                for(let i = 0; i< knnFullLength; i++){
                  let randomNumber = Math.floor(Math.random() * 14);
                  let randomMarker = L.icon({
                  iconUrl: "assets/img/"+iconNames[randomNumber],
                  iconSize: [32,37],
                  iconAnchor: [16,37],
                  popupAnchor: [0, -30]
                  })
                  markers.addLayer(L.marker([geometry['coordinates'][0][i][1],geometry['coordinates'][0][i][0]], {icon: randomMarker}));
                }

                map.addLayer(markers);
              };

              }
            })

        iso2 = countryIndex[currentIndex][1];
        countryValue = countryIndex[currentIndex][0];

            $.ajax({
            url: 'assets/php/countryInfo.php',
            method: 'GET',
            data: {
              'iso2': iso2
            },
            success: function(details){
              countryName = details['geonames'][0]['countryName'];
              capitalName = details['geonames'][0]['capital'];
              
              let currencyValue = "";
              $.ajax({
                url: 'assets/php/iso3.php',
                data: {
                  'city' : capitalName,
                  'country': countryName
                },
                success: function(item){
                  try{
                    iso3 = item['results'][0]['annotations']['currency']['iso_code'];
                  }
                  catch(err){
                  }
                  try{
                    iso3 = item['result'][0]['annotations']['currency']['iso_code'];
                  }
                  catch(err){
                  }
                }
              });
              $.ajax({
                url: 'assets/php/currencyRates.php',
                success: function(item){
                  let rates = item["rates"];
                  let currencyValue = rates[iso3];
                  $('#result').html(`
              <h3>Country: ${details['geonames'][0]['countryName']}</h3>
              <h3>Capital: ${details['geonames'][0]['capital']}</h3>
              <h3>Population: ${details['geonames'][0]['population']}</h3>
              <h3>1USD to ${countryName} : ${currencyValue}</h3>
              `)
                }
              })
              findLatAndLng(countryName,capitalName);
            }
          }
          )
          }

      }
    )
  })
   

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


});
