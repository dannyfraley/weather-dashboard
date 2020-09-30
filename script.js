$(document).ready(function () {
var APIKey = '4f91689b12bd745bc4138624dde692d8';
var locationList = [];
var date =  moment().format('dddd, MMMM Do');
$('#todaysDate').prepend(date);
init()


// Click event for entering location on search form
    $('form').on('submit', function (event) {
        event.preventDefault();
        var locationName = $('input').val();
        if (locationName === '') {
            return;
        }
        if (locationList.indexOf(locationName) === -1) {
            locationList.push(locationName);
        }
        storeLocations();
        renderButtons();
        call(locationName);
        $('form')[0].reset();
    });
    
 // Click event for search history buttons
 $('.searchHistory').on('click', '.searchHistoryButton', function (event) {
    event.preventDefault();
    var btnLocationName = $(this).text();
    call(btnLocationName);
});

function init() {
    var storedLocations = JSON.parse(localStorage.getItem('searchHistory'));
    if (storedLocations !== null) {
        locationList = storedLocations;
        call(locationList[locationList.length-1]);
    }
    renderButtons();
}

function storeLocations() {
    localStorage.setItem('searchHistory', JSON.stringify(locationList));
}


// Creates and displays buttons for each city that is searched.
function renderButtons() {
    $('.searchHistory').html('');
    for (var j = 0; j < locationList.length; j++) {
        var cityName1 = locationList[j];
        var searchHistoryButton = $(
            '<button type="button" class="btn btn-info btn-lg btn-block searchHistoryButton">'
        ).text(cityName1);
        $('.searchHistory').prepend(searchHistoryButton);
    }
}

function call(btnLocationName) {
    var locationName = btnLocationName || $('locationName').val();
    var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + locationName + '&units=imperial&appid=' + APIKey;
   
    $.ajax({
        url: queryURL,
        method: 'GET',
    }).then(function (response) {
        console.log(queryURL);
        console.log(response);

        var longitude = response.coord.lon;
        var latitude = response.coord.lat;

        var iconCode = response.weather[0].icon;
        var iconURL = 'http://openweathermap.org/img/wn/' + iconCode + '@2x.png';

        $('.locationName').text(response.name);
        $('#todayImg').attr('src', iconURL);
        $('#temperature').html(Math.round(response.main.temp) + ' &#8457;');
        $('#humidity').html(response.main.humidity + '%');
        $('#windSpeed').html(response.wind.speed + ' MPH');

        uvIndexFunc(longitude, latitude);
        fiveDay(longitude, latitude);
    });
}

function uvIndexFunc(longitude, latitude) {
    var uvQueryURL = 'https://api.openweathermap.org/data/2.5/uvi?lat=' + latitude + '&lon=' + longitude + '&appid=' + APIKey;

    $.ajax({
        url: uvQueryURL,
        method: 'GET',
    }).then(function (response) {
        console.log(response);

        $('#uvIndex').html(response.value);

        if (response.value <= 2.99) {
            $('.uvRating').css('background-color', 'green');
        } else if (response.value > 3 && response.value <= 5.99) {
            $('.uvRating').css('background-color', 'yellow');
        } else if (response.value > 6 && response.value <= 7.99) {
            $('.uvRating').css('background-color', 'orange');
        } else if (response.value > 8 && response.value <= 10.99) {
            $('.uvRating').css('background-color', 'red');
        } else {
            $('.uvRating').css('background-color', 'violet');
        }
    });
}
for (var i = 1; i < 6; i++) {
    $(`#day${i}`).html(moment().add(i, 'd').format('dddd'));
}
function fiveDay(longitude, latitude) {
    var fiveDayURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=minutely,hourly,alerts&units=imperial&appid=' + APIKey;

    $.ajax({
        url: fiveDayURL,
        method: 'GET',
    }).then(function (response) {
        console.log(response);

        $("#imgDay1").attr('src', 'http://openweathermap.org/img/wn/' + response.daily[0].weather[0].icon + "@2x.png");
        $("#high1").html("High: " + Math.round(response.daily[0].temp.max) + " &#8457;");
        $("#low1").html("Low: " + Math.round(response.daily[0].temp.min) + " &#8457;");
        $("#humidity1").html("Humidity: " +response.daily[0].humidity + "%");
        $("#uvIndex1").html("UV Index: " + response.daily[0].uvi);

        $("#imgDay2").attr('src', 'http://openweathermap.org/img/wn/' + response.daily[1].weather[0].icon + "@2x.png");
        $("#high2").html("High: " + Math.round(response.daily[1].temp.max) + " &#8457;");
        $("#low2").html("Low: " + Math.round(response.daily[1].temp.min) + " &#8457;");
        $("#humidity2").html("Humidity: " + response.daily[1].humidity + "%");
        $("#uvIndex2").html("UV Index: " + response.daily[1].uvi);

        $("#imgDay3").attr('src', 'http://openweathermap.org/img/wn/' + response.daily[2].weather[0].icon + "@2x.png");
        $("#high3").html("High: " + Math.round(response.daily[2].temp.max) + " &#8457;");
        $("#low3").html("Low: " + Math.round(response.daily[2].temp.min) + " &#8457;");
        $("#humidity3").html("Humidity: " + response.daily[2].humidity + "%");
        $("#uvIndex3").html("UV Index: " + response.daily[2].uvi);

        $("#imgDay4").attr('src', 'http://openweathermap.org/img/wn/' + response.daily[3].weather[0].icon + "@2x.png");
        $("#high4").html("High: " + Math.round(response.daily[3].temp.max) + " &#8457;");
        $("#low4").html("Low: " + Math.round(response.daily[3].temp.min) + " &#8457;");
        $("#humidity4").html("Humidity: " + response.daily[3].humidity + "%");
        $("#uvIndex4").html("UV Index: " +response.daily[3].uvi);

        $("#imgDay5").attr('src', 'http://openweathermap.org/img/wn/' + response.daily[4].weather[0].icon + "@2x.png");
        $("#high5").html("High: " + Math.round(response.daily[4].temp.max) + " &#8457;");
        $("#low5").html("Low: " + Math.round(response.daily[4].temp.min) + " &#8457;");
        $("#humidity5").html("Humidity: " + response.daily[4].humidity + "%");
        $("#uvIndex5").html("UV Index: " + response.daily[4].uvi);
    });
}



});
