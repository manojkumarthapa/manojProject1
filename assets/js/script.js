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

  function randomImg(){
    let randomNumber = Math.floor(Math.random() * 14);
    let randomMarker = L.icon({
    iconUrl: "assets/img/"+iconNames[randomNumber],
    iconSize: [32,37],
    iconAnchor: [16,37],
    popupAnchor: [0, -30]
  })
  return randomMarker;
}

const year = new Date().getFullYear();




let map = L.map("myMap").setView([0, 0], 2);

let myLayer = L.tileLayer(
  "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=kUYUQh6yWmhM3i7akAec",
  {
    attribution:
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
  }
).addTo(map);


function tiles(){
  L.layerGroup().addLayer(myLayer);
}


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
      try{
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
      catch(err){
        console.log('try again.')
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
    weather(theLat, theLng);
    getTime(theLat, theLng);
    wiki(theLat, theLng);
    
    // Weatherforcast for 7 days api
    $.ajax({
      url: 'assets/php/forecast.php',
      data:{
        'lat' : theLat,
        'lng' : theLng
      },
      success: function(item){
        $('#todayForecast').html(`
        <div>
          <img src="http://openweathermap.org/img/wn/${item.current.weather[0].icon}@2x.png" alt="WeatherIcon">
        </div>
        <div>
          <p>${item.daily[0].temp.min} &#8451</p><br>
          <p>${item.daily[0].temp.max} &#8451</p><br>
        </div>
        <div>
          <h3>${item.daily[0].weather[0].description}</h3>
          <h3>${item.current.temp} &#8451</h3>
        </div>
        `)
        let threeDaysForcast = "";
        for(let i =1; i<= 3; i++ ){
          let itemDate = new Date((item.daily[i].dt) * 1000);
          let itemDateDay =itemDate.toUTCString().slice(0,8).replace(",", " ");
          threeDaysForcast += `
          <div>
            <div>
              <p>${itemDateDay}</p>
              <img src="http://openweathermap.org/img/wn/${item.daily[i].weather[0].icon}@2x.png" alt="WeatherIcon">
            </div>
            <div>
              <p>${item.daily[i].temp.min} &#8451</p><br>
              <p>${item.daily[i].temp.max} &#8451</p><br>
            </div>
          </div>  
          `
        }
        $('#otherDayForecast').html(threeDaysForcast);
      }
    })
    }
  })
}





// EasyButton
// Zooms on current Location
L.easyButton('fa-globe', function () {
  navigator.geolocation.getCurrentPosition((result, options) => {
    $('#lat').val(result['coords']['latitude']);
    $('#lng').val(result['coords']['longitude']);
    getCurrencyRates();
    $.ajax({
      url: 'assets/php/getIso2.php',
      data: {
        'lat': result['coords']['latitude'],
        'lng': result['coords']['longitude']
      },
      success: function(item){
        let userIso2 = item.results[0].components['ISO_3166-1_alpha-2'];
        $('#country').val(userIso2).change();
      }
    })
  })
}).addTo(map);


// Bootstrap Modal for easy button. Right side 

new L.Control.BootstrapModal({
    modalId: 'exampleModal',
    tooltip: "Basic Info"
}).addTo(map);



new L.Control.BootstrapModal({
    modalId: 'exampleModalNews',
    tooltip: "News Headlines"
}).addTo(map);




new L.Control.BootstrapModal({
    modalId: 'exampleModalCovid',
    tooltip: "Covid Info"
}).addTo(map);

new L.Control.BootstrapModal({
    modalId: 'exampleModalWeather',
    tooltip: "Weather Forecast Info"
}).addTo(map);


new L.Control.BootstrapModal({
    modalId: 'exampleModalWebcam',
    tooltip: "Webcam"
}).addTo(map);





$(window).on('load', function () {
  if ($('#preloader').length) {
    $('#preloader').delay(1000).fadeOut('slow',function () {
      $(this).remove();
    });
  }
});


$(document).ready(function () {
  let countryIndex = [];
  let iso2;
  iconNames.splice(11,1);
  $.ajax({
    url: 'assets/php/countrySortName.php',
    success: function(item){
      $(item['data']).each(function(numb, data){
        countryIndex.push(data);
        $('#country').append(
          '<option class = "country" value = ' + '"' +
          data[1] + '"' +
          '>' +
          data[0] +
          '</option>'
        )
      })
    }
  })

  let borderLines;

  $('#country').change(function(){
    let countryValue = $('#country').val();
    getCurrencyRates();
    markers.clearLayers();
    for(i in map._layers) {
      if(map._layers[i]._path != undefined) {
          try {
              map.removeLayer(map._layers[i]);
          }
          catch(e) {
              console.log("problem with " + e + map._layers[i]);
          }
      }
    }
    let currentIndex;
    // let geometry;
    for (let i =0; i <countryIndex.length;i++){
      if(countryIndex[i][0] == countryValue){
        currentIndex = i;
      }
    }
    let todayDate = new Date();
    let dateOnly = `${todayDate.getFullYear()}-${todayDate.getMonth()+1}-${todayDate.getDate()}`
    $.ajax({
      url: 'assets/php/countryDetails.php',
      method: 'GET',
      data: {
        'iso2': countryValue
      },
      success: function(item){
        let itemCoordinates = item['data']['coordinates'];
        let border = L.geoJSON(item['data'],{
          style: function(){
            return{
              color: '#060',
              weight: 3.5
            }
          }
        }).addTo(map);
        
        if(item['data']['type']=="Polygon"){
          itemCoordinates.forEach(function(coordsArray){
            coordsArray.forEach(function(coords){
              markers.addLayer(L.marker([coords[1],coords[0]], {icon: randomImg()}));
            })
          })
          map.addLayer(markers);
        }else{
          itemCoordinates.forEach(function(outerIndex){
            outerIndex.forEach(function(coordsArray){
              coordsArray.forEach(function(coords){
                markers.addLayer(L.marker([coords[1],coords[0]], {icon: randomImg()}));
              })
            })
          })
          map.addLayer(markers);
        }
        map.fitBounds(border.getBounds());
        
            $.ajax({
            url: 'assets/php/countryInfo.php',
            method: 'GET',
            data: {
              'iso2': countryValue
            },
            success: function(details){
              countryName = details['geonames'][0]['countryName'];
              capitalName = details['geonames'][0]['capital'];
              currencyCode = details['geonames'][0]['currencyCode'];
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
              $('#capitalVal').text(capitalName)
              $('#populationsVal').text(population)
              $('#currencyIdVal').html(`<p>1 USD to ${currencyCode} : ${currencyValue}<p>`)

              findLatAndLng(countryName,capitalName);
                }
              })
                }
              });
              $.ajax({
                url: 'assets/php/nationalHoliday.php',
                data: {
                  'iso2' : countryValue,
                  'year' : year
                },
                success: function(item){
                  $('#holidays > ul').html(``);
                  try{
                    item.forEach(function(holiday){
                    $('#holidays > ul').append(`
                    <li>${holiday.date} : ${holiday.name}</li>
                    `)
                  })
                  }
                  catch(err){
                    $('#holidays > ul').append(`
                    <p>${countryValue} is not available in API</p>
                    `);
                  }
                }
              })
              $.ajax({
                url: 'assets/php/covid.php',
                data:{
                  'iso2': countryValue
                },
                success: function(item){
                  $('#exampleModalLabelCovid').text(`${item.data.name} latest covid statistics`)   
                  $('#covid-newCase').text(item.data.timeline[0].new_confirmed);    
                  $('#covid-newDeath').text(item.data.timeline[0].new_deaths);  
                  $('#covid-totalCase').text(item.data.latest_data.confirmed);   
                  $('#covid-totalDeath').text(item.data.latest_data.deaths);      
                }
              })
              $.ajax({
                url: 'assets/php/webcam.php',
                data: {"iso2" : countryValue},
                success: function(item){
                  let data = item.data.result.webcams;
                  let webcam = "";
                  $('#exampleModalLabelWebcam').text(`${data[0].location.country} Webcams`);
                  try{
                    for(let i = 0; i<= 3; i++){
                    webcam += `
                    <iframe width="200" height="240" src="${data[i].player.day.embed}"></iframe>
                    `
                  }
                  }catch(err){
                    console.log()
                  }
                  $('.webcam').html(webcam)
                }
              })
              $.ajax({
                url: 'assets/php/news.php',
                data: {
                  'iso2': countryValue,
                  'date': dateOnly
                },
                success: function(item){
                  let news = '';
                  let data = item.data.data;
                  data.forEach(function(headline){
                    news += `
                    <div>
                    <h3>${headline.title}</h3>
                    <p>${headline.description}</p>
                    <p>Published at: ${headline.published_at}</p>
                    <a href="${headline.url}" target="_blank">Click for more info</a>
                    </div>
                    `
                  })
                  $('.news').html(news);
                }
              })
            }
          }
          )
          }

      }
    )
  })
   

  $('#currencyCountryBase').change(function () {
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


  $('#currencyCountryExchanged').change(function () {
    let countryBase = $('#currencyCountryBase').val();
    let countryExchanged = $('#currencyCountryExchanged').val();
    let currencySendAmt = $('#currencySendAmt').val();
    updateRateFrom(countryBase, countryExchanged, currencySendAmt);
  });
});
