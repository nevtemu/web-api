let city, country, place, myMap
const date = new Date();
const year = date.getFullYear();
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const monthNumber = date.getMonth();
const month = monthNames[monthNumber];
const time = `${date.getHours()}:${date.getMinutes() >= 10 ? date.getMinutes() : "0"+date.getMinutes()}`;
const timezone = date.toTimeString().slice(9);
const language = window.navigator.language;
const key3 = '72db68aef9ac708d33aae403c85f16bb'
const key2 = '86341884ad721f2886a8f9b72ec443ad0114804a'

function loadData(url, myFunction) {
    $.ajax({
        // method: 'GET',
        dataType: "json",
        url: url,
        cache: false,
        success: myFunction
    });
}
function loadIp (data) {
    country = data.country_code
    city = data.city
    place = {lat:parseFloat(data.latitude), lng:parseFloat(data.longitude)}
    document.querySelector("#ipInfo").innerHTML= `
        <b>Your country:</b> <img id="flag" src="${data.country_flag}" alt=""> ${data.country} <br>
        <b>Your city:</b> ${data.city} <br>
        <b>Your IP address:</b> ${data.ip} <br>
        <b>Your currency: </b>${data.currency} <br>
        <b>Currency exchange rate to USD:</b> ${data.currency_rates}`;
    centerMap()
    loadData(`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${key3}`, loadWeather);
    loadData(`https://calendarific.com/api/v2/holidays?&api_key=${key2}&country=${country}&year=${year}&month=${monthNumber+1}`, loadHolidays);    
}
function loadWeather (data) {
    let sunrise = new Date(data.sys.sunrise*1000)
    let sunset = new Date(data.sys.sunset*1000)
    document.querySelector("#weatherInfo").innerHTML= `
        <img id="weatherPicture" src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt=""> <br>
        <b>Temperature:</b> ${data.main.temp}˚C <br>
        <b>Humidity:</b> ${data.main.humidity}% <br>
        <b>Sunrise:</b> ${sunrise.getHours()}:${sunrise.getMinutes() >= 10 ? sunrise.getMinutes() : "0"+sunrise.getMinutes()}  <br>
        <b>Sunset:</b> ${sunset.getHours()}:${sunset.getMinutes() >= 10 ? sunset.getMinutes() : "0"+sunset.getMinutes()}`;
}
function loadHolidays (data) {
    data.response.holidays.forEach(element => {document.querySelector("#holidaysInfo").innerHTML+=`<b>${element.date.datetime.day}.${monthNames[element.date.datetime.month-1]}.${element.date.datetime.year}</b> - ${element.name} <br>` 
    })
}
function drawMap(){
    let location = {lat:25.2048493, lng:55.2707828}
    let mapOptions = {zoom:13, center:location}      
    myMap = new google.maps.Map(document.getElementById('map'), mapOptions);
}
function centerMap(){
    let marker = new google.maps.Marker({
        position: {lat:place.lat,lng:place.lng}, 
        map: myMap,
        title: 'You are here'});
    marker.setMap(myMap);
    myMap.setCenter(marker.getPosition());
}
document.getElementById("system").innerHTML = `You are using <br><b>${platform.name} v${platform.version}</b> <br>on <b>${platform.os}</b>`;
document.getElementById("time").innerHTML = `Your browser language: <b>${language} </b><br> Your system time: <b>${time}</b><br> Time zone: <b>${timezone}</b>`;
$(document).ready(function(){
    loadData("https://ipwhois.app/json/", loadIp)
});