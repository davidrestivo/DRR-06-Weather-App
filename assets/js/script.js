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
    pastSearches();
    getWeather();
} else if (storedCoordinates) {
    stored();
} else {
    storedCoordinates = [];
    lat = 30.2672;
    lon = -97.7431;
    getWeather();
};







