let weatherInfo, ipInfo, holiInfo, city, country, place, myMap
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
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            myFunction(this);
        } 
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}
function loadIp (xhttp) {
    ipInfo = JSON.parse(xhttp.responseText);
    country = ipInfo.country_code
    city = ipInfo.city
    place = {lat:parseFloat(ipInfo.latitude), lng:parseFloat(ipInfo.longitude)}
    document.querySelector("#ipInfo").innerHTML= `<b>Your country:</b> <img id="flag" src="${ipInfo.country_flag}" alt=""> ${ipInfo.country} <br><b>Your city:</b> ${ipInfo.city} <br><b>Your IP address:</b> ${ipInfo.ip} <br><b>Your currency: </b>${ipInfo.currency} <br><b>Currency exchange rate to USD:</b> ${ipInfo.currency_rates}`;
    loadData(`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${key3}`, loadWeather);
    centerMap()
}
function loadWeather (xhttp) {
    weatherInfo = JSON.parse(xhttp.responseText);
    let sunrise = new Date(weatherInfo.sys.sunrise*1000)
    let sunset = new Date(weatherInfo.sys.sunset*1000)
    document.querySelector("#weatherInfo").innerHTML= `<img id="weatherPicture" src="http://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@2x.png" alt=""> <br><b>Temperature:</b> ${weatherInfo.main.temp}˚C <br><b>Humidity:</b> ${weatherInfo.main.humidity}% <br><b>Sunrise:</b> ${sunrise.getHours()}:${sunrise.getMinutes()}  <br><b>Sunset:</b> ${sunset.getHours()}:${sunset.getMinutes()}`;
    loadData(`https://calendarific.com/api/v2/holidays?&api_key=${key2}&country=${country}&year=${year}&month=${monthNumber+1}`, loadHolidays);
}
function loadHolidays (xhttp) {
    holiInfo = JSON.parse(xhttp.responseText);
    holiInfo.response.holidays.forEach(element => {document.querySelector("#holidaysInfo").innerHTML+=`<b>${element.date.datetime.day}.${monthNames[element.date.datetime.month-1]}.${element.date.datetime.year}</b> - ${element.name} <br>` 
    })
  }
function drawMap(){
    let location = {lat:25.2048493, lng:55.2707828}
    let mapOptions = {zoom:4, center:location}      
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
loadData("http://ipwhois.app/json/", loadIp);

document.getElementById("system").innerHTML = `You are using <br><b>${platform.name} v${platform.version}</b> <br>on <b>${platform.os}</b>`;
document.getElementById("time").innerHTML = `Your browser language: <b>${language} </b><br> Your system time: <b>${time}</b><br> Time zone: <b>${timezone}</b>`;
