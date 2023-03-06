let searchInp;
let storedCoordinates = JSON.parse(localStorage.getItem('storedCoordinates'));
let pastSelect = JSON.parse(localStorage.getItem('pastSelect'));
let lat;
let lon;
let cnt = 0;

const requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

for (let i = 1; i < 6; i++) { 
    let div1 = $('<div>').addClass('col card mx-1 bg-dark');
    let h6 = $('<h6>').addClass('card-header text-info text-center').attr('id', 'h6' + i);
    let div2 = $('<div>').addClass('card-body text-light bg-secondary');
    let sun = $('<img>').attr('id', 'sun' + i);
    let temp = $('<p>').attr('id', 'temp' + i);
    let wind = $('<p>').attr('id', 'wind' + i);
    let hum = $('<p>').attr('id', 'hum' + i);
    div2.append(sun, temp, wind, hum);
    div1.append(h6, div2);
    $('#5dayBody').append(div1);
}

if (pastSelect) {
    console.log(pastSelect);
    lat = pastSelect[0].lat;
    lon = pastSelect[0].lon;
    oldSearches();
    getAllWeather();
} else if (storedCoordinates) {
    stored();
} else {
    //default coordinates if none exist (set for Austin, TX)
    storedCoordinates = [];
    lat = 30.2672;
    lon = -97.7431;
    getAllWeather();
};

function stored() {
   
    lat = storedCoordinates[0].lat;
    lon = storedCoordinates[0].lon;

    oldSearches();
    getAllWeather();
};

//search button click
$('#searchBtn').on('click', searchNow);

function searchNow() { // city search
    searchInp = $('#searchInp').val();
    if (searchInp.length) { 
        cnt = storedCoordinates.length;
        console.log(cnt);
        getCoord();
    }
};

function oldSearches() { //old search buttons
    for (cnt; cnt < storedCoordinates.length; cnt++) {
        let li = $('<li>').addClass('add-project-btn');
        let btn = $('<button>').addClass('btn btn-secondary px-5 py-1 my-1 text-light');
        btn.attr('id', cnt);
        console.log('button ' + cnt + ' created');
        li.append(btn);
        $('#ul-custom').append(li);
        $('#' + cnt).on('click', function () {
            const id = this.id;
            console.log(id);
            lat = storedCoordinates[id].lat;
            lon = storedCoordinates[id].lon;
            console.log(lat);
            console.log(lon);
            getAllWeather();
        });
    };

    for (let cnt2 = 0; cnt2 < storedCoordinates.length; cnt2++) { $('#' + cnt2).text(storedCoordinates[cnt2].city) };
};


function getCoord() { //city search
    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + searchInp + ',US&limit=1&appid=d08b1379cfe23a7e58b700d18c0903c9', requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.length < 1) {
                alert('Did not find this city');
                throw 'This city does not exist as entered';
            } else {
                lat = result[0].lat;
                lon = result[0].lon;

                let coordinates = { city: result[0].name, lat: lat, lon: lon };
                storedCoordinates.unshift(coordinates);
                storedCoordinates.splice(8);
                localStorage.setItem('storedCoordinates', JSON.stringify(storedCoordinates));
            };
        })
        .then(stored)
        .catch(error => console.log('error', error));
};

function getAllWeather() { //current weather and forecast

    fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=d08b1379cfe23a7e58b700d18c0903c9&units=imperial', requestOptions)
        .then(response => response.json())
        .then(result => {

            $('#cityName').text(result.name + ' (' + dayjs(result.dt * 1000).format('MM/DD/YYYY') + ') ');
            $('#emoji').attr('src', 'http://openweathermap.org/img/w/' + result.weather[0].icon + '.png');
            $('#temp0').text('Temp: ' + result.main.temp + ' ºF');
            $('#wind0').text('Speed: ' + result.wind.speed + ' mph');
            $('#hum0').text('Humidity: ' + result.main.humidity + ' %');
            $('#sunR0').text('Sunrise: ' + new Date(result.sys.sunrise * 1000).toLocaleTimeString());
            $('#sunS0').text('Sunset: ' + new Date(result.sys.sunset * 1000).toLocaleTimeString());

        })
        .then(
            fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=d08b1379cfe23a7e58b700d18c0903c9&units=imperial', requestOptions)
                .then(response => response.json())
                .then(result => {
                    for (var i = 1; i < 6; i++) {
                        var iPlus = (i-1) * 8;
                        $('#h6' + i).text(dayjs(result.list[iPlus].dt_txt).format('MM/DD/YYYY'));
                        $('#sun' + i).attr('src', 'http://openweathermap.org/img/w/' + result.list[iPlus].weather[0].icon + '.png');
                        $('#temp' + i).text('Temp: ' + result.list[iPlus].main.temp + ' ºF');
                        $('#wind' + i).text('Wind: ' + result.list[iPlus].wind.speed + ' mph');
                        $('#hum' + i).text('Humidity: ' + result.list[iPlus].main.humidity + ' %');
                    }
                })
            .catch(error => console.log('error', error))

        )
    .catch(error => console.log('error', error));
};





