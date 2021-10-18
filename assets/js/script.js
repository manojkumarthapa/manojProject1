let countryJSON = "assets/js/countryBorders.geo.json";
let countryLocation = 'assets/js/countryInfo.json';

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

let countryInfoArray = [];

// CountryInfo
$.getJSON(countryLocation, function(item){
  $(item).each(function(x,y){
    countryInfoArray.push(y);
  })
})

console.log(countryInfoArray);


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
    //   let current = $('#result > h3:first-child').text().slice(-3).trim();
    //   console.log(current);
    //   console.log(Object.keys(countryInfoArray['0']));
    //   let gg = Object.keys(countryInfoArray['0']);
    //   console.log(gg.indexOf(current));
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
      let time = item['data']['time'].slice(-6);
      $('#result').append(
        `
        <h3>Time: ${time} </h3>
        `)
    }
  })
}

// Currency API
function getCurrencyRates(){
  
  $.ajax({
    url: 'assets/php/currencyRates.php',
    method: 'GET',
    success: function(item){
      let rates=item['rates'];
      let countryShortHand = Object.keys(rates);
      let fromSelected = '';
      let toSelected = '';
      $('#currencyCountryBase').click(function(){
        fromSelected = $('#currencyCountryBase').val();
      });

      $('#currencyCountryExchanged').click(function(){
        toSelected = $('#currencyCountryExchanged').val();
      });


      $('#currencySendAmt').val(1);
      $('#currencyReceiveAmt').val(1);
      for(let j =0; j< countryShortHand.length;j++){
        let code = countryShortHand[j];
        $('#currencyCountryBase').append(`
        <option value=${code}>${code}</option>
        `);
      }
      for(let j =0; j< countryShortHand.length;j++){
        let code = countryShortHand[j];
        $('#currencyCountryExchanged').append(`
        <option value=${code}>${code}</option>
        `);
      }
    }
    
  })

  
}
// Updates the value of the currencey
function updateRateFrom(currencyFrom, currencyTo, newCurrencyFrom){
  $.ajax({
        url: 'assets/php/currencyRates2.php',
        method: 'GET',
        data: {
          'from': currencyFrom,
          'to': currencyTo
        },
        success: function(item){
          let rate = `${currencyFrom}_${currencyTo}`;
          let receiving = item[rate] * newCurrencyFrom;
          $('#currencyValue').text(receiving);
          console.log(receiving);
        }
      })
}




// Clear Result section
function clearResult(){
  $('#result').html("");
};



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
  getCurrencyRates();
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
    position: 'left'
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


  $('#currencyCountryBase').click(function(){
    let countryBase = $('#currencyCountryBase').val();
    let countryExchanged = $('#currencyCountryExchanged').val();
    let currencySendAmt = $('#currencySendAmt').val();
    updateRateFrom(countryBase, countryExchanged,currencySendAmt);
  });

  $('#currencySendAmt').change(function(){
    let countryBase = $('#currencyCountryBase').val();
    let countryExchanged = $('#currencyCountryExchanged').val();
    let currencySendAmt = $('#currencySendAmt').val();
    updateRateFrom(countryBase, countryExchanged,currencySendAmt);
  })


  $('#currencyCountryExchanged').click(function(){
    let countryBase = $('#currencyCountryBase').val();
    let countryExchanged = $('#currencyCountryExchanged').val();
    let currencySendAmt = $('#currencySendAmt').val();
    updateRateFrom(countryBase, countryExchanged,currencySendAmt);
  });
 
  // nav select tag
  $('#country').click(function(){
    console.log($('#country').val());
  });







});