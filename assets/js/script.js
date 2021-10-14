
let countryJSON = ('assets/js/countryBorders.geo.json');
let lat;
let lng;
let currentLocation = navigator.geolocation.getCurrentPosition((result)=>{
    result['coords']['latitude'];
})


var map = L.map("myMap").setView([0,0], 1);

L.tileLayer("https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=fKzuYDqbLK8jPu9bReiP",{
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
}).addTo(map);




$(document).ready(function(){
    $('nav').html('<label for="country">Choose a country:  </label>');
    $('nav').append('<select name="country" id="country" onmousedown="if(this.options.length > 5){this.size = 5}" onchange="this.size=0">');
    $.getJSON(countryJSON,function(countries){
            $(countries['features']).each(function(numb, data){
                // Cant add img beside option 
                // numb = '<img src="https://www.countryflags.io/'+ data['properties']['iso_a2']+'/shiny/16.png">'
                // console.log(numb);
                $('#country').append('<option class = "country" value='+data['properties']['name']+ '>'+ data['properties']['name']+'</option>')
            })
        })
    $('nav').append('</select>');
       
    
})