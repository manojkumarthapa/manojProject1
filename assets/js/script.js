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

L.tileLayer(
  "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=kUYUQh6yWmhM3i7akAec",
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

      let city = item['data']['name'];
      let temperature = item['data']['main']['temp'];
      let weather = item['data']['weather'][0]['description'];
      $('#temperatureVal').text(temperature + "℃");
      $('#weatherVal').text(weather)
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
      $('#timeVal').text(time)
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
        let theCode = countryShortHand[j];
        if(theCode == "USD"){
          $('#currencyCountryBase').append(`
          <option selected value=${theCode}>${theCode}</option>
          `);
        
          }
        $('#currencyCountryBase').append(`
        <option value=${theCode}>${theCode}</option>
        `);
      }
      for (let j = 0; j < countryShortHand.length; j++) {
        let theCode = countryShortHand[j];
        $('#currencyCountryExchanged').append(`
        <option value=${theCode} >${theCode}</option>
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
      console.log(receiving)
      $('#currencyValue').val(receiving);
    }
  })
}

// wiki api
function wiki(lat, lng){
  $('#wikiVal').html("");
  $.ajax({
    url: 'assets/php/wiki.php',
    method: 'GET',
    data: {
      'lat': lat,
      'lng': lng
    },
    success: function(item){
      
      for(let x = 0; x< item['geonames'].length; x++){
        $('#wikiVal').append(`
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
  let city1 = city.split("");
  let country1 = country.split("");
  for(let i=0;i<city1.length;i++){
    if (city1[i] == " "){
      city1[i] = "%20"
    }
  }
    for(let i=0;i<country1.length;i++){
    if (country1[i] == " "){
      country1[i] = "%20"
    }
  }
  city = city1.join("")
  country = country1.join("")
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
    map.setView([theLat,theLng],6)
    weather(theLat, theLng);
    getTime(theLat, theLng);
    wiki(theLat, theLng);

    }
  })
}


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

new L.Control.BootstrapModal({
    modalId: 'exampleModal',
}).addTo(map);
$('.leaflet-control-bootstrapmodal > a').append(`
<i class="fas fa-sliders-h"></i>
`)

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

  console.log(countryIndex)
  $('#country').click(function(){
    // $('#result').html("");
    let countryValue = $('#country').val();
    $('#exampleModalLabel').text(countryValue)
    console.log(`which clicked? ${countryValue}`)
    let currentIndex;
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
                  for(let i = 0; i < geometry['coordinates'].length;i++){
                    for(let x =0; x< geometry['coordinates'][i].length; x++){
                      for(let y = 0; y < geometry['coordinates'][i][x].length;y++){
                      let randomNumber = Math.floor(Math.random() * 14);
                      let randomMarker = L.icon({
                      iconUrl: "assets/img/"+iconNames[randomNumber],
                      iconSize: [32,37],
                      iconAnchor: [16,37],
                      popupAnchor: [0, -30]
                      })
                      markers.addLayer(L.marker([geometry['coordinates'][i][x][y][1],geometry['coordinates'][i][x][y][0]], {icon: randomMarker}));
                    }
                    }
                  }
                map.addLayer(markers);
              }else if(knnType == 'Polygon'){
                    for(let i = 0; i < geometry['coordinates'].length;i++){
                    for(let x = 0; x < geometry['coordinates'][i].length;x++){
                      let randomNumber = Math.floor(Math.random() * 14);
                      let randomMarker = L.icon({
                      iconUrl: "assets/img/"+iconNames[randomNumber],
                      iconSize: [32,37],
                      iconAnchor: [16,37],
                      popupAnchor: [0, -30]
                      })
                      markers.addLayer(L.marker([geometry['coordinates'][i][x][1],geometry['coordinates'][i][x][0]], {icon: randomMarker}));
                    }
                  }
                map.addLayer(markers);
              };
              }
            })

        iso2 = countryIndex[currentIndex][1];
        countryValue = countryIndex[currentIndex][0];
        let currencyCode;

            $.ajax({
            url: 'assets/php/countryInfo.php',
            method: 'GET',
            data: {
              'iso2': iso2
            },
            success: function(details){
              countryName = details['geonames'][0]['countryName'];
              capitalName = details['geonames'][0]['capital'];
              currencyCode = details['geonames'][0]['currencyCode'];
              console.log(`currency Code: ${currencyCode}`)
              console.log(countryName)
              console.log(`capital ${capitalName}`)
              console.log(`iso2 ${iso2}`)
              $('#currencyCountryExchanged').val(currencyCode)

              $.ajax({
                url: 'assets/php/iso3.php',
                data: {
                  'city' : capitalName,
                  'country': countryName
                },
                success: function(){
                  $.ajax({
                  url: 'assets/php/currencyRates.php',
                  success: function(item){
                  let rates = item["rates"];
                  let currencyValue = rates[currencyCode];
                  $('#currencyValue').val(currencyValue);
                  console.log(currencyValue)
                  let population = details['geonames'][0]['population']
                  population = population.split('')
                  population = population.reverse()
                  population = population.join('')


                  for(let i=3;i<population.length; i+=4){
                    population = [population.slice(0,i),",",population.slice(i)].join('');
                  }
                  population = population.split('')
                  population = population.reverse()
                  population = population.join('')
                    
                  console.log(population)
              $('#capitalVal').text(capitalName)
              $('#populationsVal').text(population)
              $('#currencyIdVal').html(`<p>1 USD to ${currencyCode} : ${currencyValue}<p>`)

              findLatAndLng(countryName,capitalName);
                }
              })
                }
              });
            }
          }
          )
          }

      }
    )
  })
   

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
