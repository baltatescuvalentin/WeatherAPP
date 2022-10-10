import { format, sub } from "date-fns";
import { floor } from "lodash";
import { getCoordinates, getWeatherData } from "../API/api";

let sign = '°C';
let windSpeed = 'm/s';
let id = 1;
let currentId = 1;
let hourlyBool = false;

function setSign(units) {
    if(units === 'metric')
        sign = '°C';
    else 
        sign = '°F';
}

function setWindSpeed(units) {
    if(units === 'metric')
        windSpeed = 'm/s';
    else
        windSpeed = 'm/h';
}

function setTime(time) {
    return format(new Date(time * 1000), "HH:mm EEEE, do MMM yyyy");
}

function getHour(time) {
    return format(new Date(time * 1000), "HH:mm");
}

function getDay(time) {
    return format(new Date(time * 1000), "EEEE");
}

const icons = {
    '01d': './icons/sun.png',
    '01n': './icons/crescent-moon.png',
    '02d': './icons/sun-cloudy.png',
    '02n': './icons/moon-cloudy.png',
    '03d': './icons/clouds.png',
    '03n': './icons/clouds.png',
    '04d': './icons/clouds.png',
    '04n': './icons/clouds.png',
    '09d': './icons/heavy-rain.png',
    '09n': './icons/heavy-rain.png',
    '10d': './icons/rain.png',
    '10n': './icons/rain.png',
    '11d': './icons/thunderstorm.png',
    '11n': './icons/thunderstorm.png',
    '13d': './icons/snow.png',
    '13n': './icons/snow.png',
    '50d': './icons/fog.png',
    '50n': './icons/fog.png',
}

async function searchCity(units) {
    hourlyBool = false;
    const search = document.querySelector('#search');
    console.log(`search: ${search}`)
    const name = search.value || 'Baltatesti';
    console.log(`name: ${name}`);
    const body = document.querySelector('body');
    const main = document.querySelector('main');
    const footer = document.querySelector('footer');

    body.removeChild(footer);
    body.removeChild(main);
    await setInfo(units, name);
    body.appendChild(footer);

    const celsius = document.querySelector('#celsius');
    const fahrenheit = document.querySelector('#fahrenheit');
    celsius.classList.add('temperature_chosen');
    fahrenheit.classList.remove('temperature_chosen');
    search.value = '';
}

async function changeUnits(units, cityName) {
    hourlyBool = false;
    const body = document.querySelector('body');
    const main = document.querySelector('main');
    const footer = document.querySelector('footer');

    body.removeChild(footer);
    body.removeChild(main);
    await setInfo(units, cityName);
    body.appendChild(footer);
}


async function setInfo(units, cityName) {

    let coord = await getCoordinates(cityName);
    let forecast = await getWeatherData(cityName, units);

    const body = document.querySelector('body');
    const main = document.createElement('main');

    setSign(units);
    setWindSpeed(units);

    const obj = {
        'name': coord.name,
        'country': coord.country,
        'lat': coord.lat,
        'lon': coord.lon,
        'description': forecast.current.weather[0].description,
        'icon': forecast.current.weather[0].icon,
        'temperature': floor(forecast.current.temp),
        'time': forecast.current.dt,
        'humidity': forecast.current.humidity,
        'feels_like': floor(forecast.current.feels_like),
        'cloudiness': forecast.current.clouds,
        'wind': forecast.current.wind_speed.toFixed(1),
        'sunrise': forecast.current.sunrise,
        'sunset': forecast.current.sunset,
        'uvi': forecast.current.uvi,
        'pressure': forecast.current.pressure,
        'wind_deg': forecast.current.wind_deg,
        'precipitations': forecast.hourly[0].pop*100
    }


    main.appendChild(createSummary(obj));
    main.appendChild(createAdditionalInfo(obj));
    main.appendChild(createMenu());
    main.appendChild(createDailyGrid(forecast.daily));
    main.appendChild(createHourlyGrid(forecast.hourly, 1));
    main.appendChild(createHourlyGrid(forecast.hourly, 2));
    main.appendChild(createHourlyGrid(forecast.hourly, 3));
    main.appendChild(createDetails(forecast.daily[1]));
    body.append(main);

    const dailies = document.querySelectorAll('.daily_elem');
    for(let i = 0; i < dailies.length; i++) {
        dailies[i].onclick = (e) => {
            populateDetails(e, forecast.daily);
            console.log(forecast.daily);
        }
    }

    const searchInput = document.querySelector('#search');
    searchInput.addEventListener('keydown', (e) => {
        if (e.keyCode === 13 || e.which === 13) {
            searchCity(units);
        }
    })

    const celsius = document.querySelector('#celsius');
    celsius.onclick = async () => {
        celsius.classList.add('temperature_chosen');
        fahrenheit.classList.remove('temperature_chosen');
        await changeUnits('metric', cityName);
    }

    const fahrenheit = document.querySelector('#fahrenheit');
    fahrenheit.onclick = async () => {
        celsius.classList.remove('temperature_chosen');
        fahrenheit.classList.add('temperature_chosen');
        await changeUnits('imperial', cityName);
    }
}

function createSummaryLeft(obj) {
    const left = document.createElement('div');
    left.classList.add('summary_left');

    const p = document.createElement('p');
    const description = obj.description.charAt(0).toUpperCase() + obj.description.slice(1);
    p.textContent = description;

    const img = document.createElement('img');
    img.src = icons[obj.icon];
    img.classList.add('summary_icon');

    left.appendChild(p);
    left.appendChild(img);

    return left;
}

function createCenterElem(src, info) {
    const elem = document.createElement('div');
    elem.classList.add('summary_elem');

    const img = document.createElement('img');
    img.src = src;

    const p = document.createElement('p');
    p.textContent = `${info}`;

    elem.appendChild(img);
    elem.appendChild(p);

    return elem;
}

function createSummaryCenter(obj) {

    const center = document.createElement('div');
    center.classList.add('summary_center');

    const elem = document.createElement('div');
    elem.classList.add('summary_elem');

    const p = document.createElement('p');
    p.textContent = `${obj.temperature}${sign}`;
    p.setAttribute('id', 'temperature');

    elem.appendChild(p);

    center.appendChild(elem);
    let location = obj.name + ', ' + obj.country;
    center.appendChild(createCenterElem('./icons/location.png', location));
    center.appendChild(createCenterElem('./icons/clock.png', setTime(obj.time)));

    return center;
}

function createRightElem(src, text, info) {
    const elem = document.createElement('div');
    elem.classList.add('summary_elem');

    const img = document.createElement('img');
    img.src = src;

    const summary_text = document.createElement('div');
    summary_text.classList.add('summary_text');

    const p = document.createElement('p');
    p.textContent = `${text}`;

    const p2 = document.createElement('p');
    p2.textContent = `${info}`;

    summary_text.appendChild(p);
    summary_text.appendChild(p2);

    elem.appendChild(img);
    elem.appendChild(summary_text);

    return elem;
}

function createSummaryRight(obj) {
    const right = document.createElement('div');
    right.classList.add('summary_right');

    right.appendChild(createRightElem('./icons/temperature.png', 'Feels Like', obj.feels_like + sign));
    right.appendChild(createRightElem('./icons/chance.png', 'Humidity', obj.humidity + '%'));
    right.appendChild(createRightElem('./icons/rain.png', 'Precipitations', obj.precipitations + '%'));
    right.appendChild(createRightElem('./icons/wind.png', 'Wind', obj.wind + windSpeed));

    return right;

}

function createSummary(obj) {
    const summary = document.createElement('div');
    summary.classList.add('summary');

    summary.appendChild(createSummaryLeft(obj));
    summary.appendChild(createSummaryCenter(obj));
    summary.appendChild(createSummaryRight(obj));

    return summary;
}

function createAdditionalElem(title_info, info) {
    const elem = document.createElement('div');
    elem.classList.add('additional_elem');

    const title = document.createElement('p');
    title.classList.add('additional_title');
    title.textContent = `${title_info}`;

    const text = document.createElement('p');
    text.classList.add('additional_text');
    text.textContent = `${info}`;

    elem.appendChild(title);
    elem.appendChild(text);

    return elem;
}

function createAdditionalInfo(obj) {
    const additional = document.createElement('div');
    additional.classList.add('additional');

    additional.appendChild(createAdditionalElem('SUNRISE', getHour(obj.sunrise)));
    additional.appendChild(createAdditionalElem('SUNSET', getHour(obj.sunset)));
    additional.appendChild(createAdditionalElem('CLOUDINESS', obj.cloudiness + '%'));
    additional.appendChild(createAdditionalElem('UV Index', obj.uvi));
    additional.appendChild(createAdditionalElem('PRESSURE', obj.pressure + 'hPa'));

    return additional;
}

function createDetails(chosen) {
    const details = document.createElement('div');
    details.classList.add('details');

    // details = putDetailsData(chosen);

    details.appendChild(createAdditionalElem('DAY', floor(chosen.feels_like.day) + sign));
    details.appendChild(createAdditionalElem('NIGHT', floor(chosen.feels_like.night) + sign));
    details.appendChild(createAdditionalElem('HUMIDITY', chosen.humidity + '%'));
    details.appendChild(createAdditionalElem('PRECIPITATIONS', (chosen.pop*100).toFixed(0) + '%'));
    details.appendChild(createAdditionalElem('WIND', chosen.wind_speed + windSpeed));
    details.appendChild(createAdditionalElem('SUNRISE', getHour(chosen.sunrise)));
    details.appendChild(createAdditionalElem('SUNSET', getHour(chosen.sunset)));
    details.appendChild(createAdditionalElem('CLOUDINESS', chosen.clouds + '%'));
    details.appendChild(createAdditionalElem('UV Index', chosen.uvi));
    details.appendChild(createAdditionalElem('PRESSURE', chosen.pressure + 'hPa'));


    details.style.display = 'none';
    return details;
}

function populateDetails(e, chosen) {
    const stringAux = e.target.parentNode.getAttribute('id') || e.target.getAttribute('id');
    const currIdString = stringAux.split('_')[1];
    const currId = parseInt(currIdString);
    const dailies = document.querySelectorAll('.daily_elem');
    for(let i = 0; i < dailies.length; i++) {
        dailies[i].classList.remove('daily_active');
    }
    document.querySelector(`#${stringAux}`).classList.add('daily_active');

    const details = document.querySelector('.details');
    details.style.display = 'grid';
    details.innerHTML = "";
    // details = putDetailsData(chosen, details);

    console.log(stringAux);
    console.log(chosen);

    details.appendChild(createAdditionalElem('DAY', floor(chosen[currId].feels_like.day) + sign));
    details.appendChild(createAdditionalElem('NIGHT', floor(chosen[currId].feels_like.night) + sign));
    details.appendChild(createAdditionalElem('HUMIDITY', chosen[currId].humidity + '%'));
    details.appendChild(createAdditionalElem('PRECIPITATIONS', (chosen[currId].pop*100).toFixed(0) + '%'));
    details.appendChild(createAdditionalElem('WIND', chosen[currId].wind_speed.toFixed(1) + windSpeed));
    details.appendChild(createAdditionalElem('SUNRISE', getHour(chosen[currId].sunrise)));
    details.appendChild(createAdditionalElem('SUNSET', getHour(chosen[currId].sunset)));
    details.appendChild(createAdditionalElem('CLOUDINESS', chosen[currId].clouds + '%'));
    details.appendChild(createAdditionalElem('UV Index', chosen[currId].uvi));
    details.appendChild(createAdditionalElem('PRESSURE', chosen[currId].pressure + 'hPa'));
}

function displayDaily() {
    hourlyBool = false;
    const hourly = document.querySelector('.hourly');
    const daily = document.querySelector('.daily');
    const hourlyBtn = document.querySelector('.hourly_btn');
    const dailyBtn = document.querySelector('.daily_btn');
    const submenu = document.querySelector('.submenu');
    const hourlies = document.querySelectorAll('.hourly');

    for(let i = 0; i < hourlies.length; i++) {
        hourlies[i].style.display = 'none';
    }

    hourly.style.display = 'none';
    if(window.innerWidth > 650)
        daily.style.display = 'grid';
    else daily.style.display = 'flex';
    submenu.style.display = 'none';

    hourlyBtn.classList.remove('active');
    dailyBtn.classList.add('active');

}

function displayHourly() {
    if(hourlyBool === true)
        return;
    hourlyBool = true;
    const hourly = document.querySelector('.hourly');
    const daily = document.querySelector('.daily');
    const hourlyBtn = document.querySelector('.hourly_btn');
    const dailyBtn = document.querySelector('.daily_btn');
    const submenu = document.querySelector('.submenu');
    const details = document.querySelector('.details');
    const dailies = document.querySelector('.daily_active');
    if(dailies)
        dailies.classList.remove('daily_active');

    details.style.display = 'none';

    daily.style.display = 'none';
    if(window.innerWidth > 500)
        hourly.style.display = 'grid';
    else hourly.style.display = 'flex';
    submenu.style.display = 'flex';

    dailyBtn.classList.remove('active');
    hourlyBtn.classList.add('active');

    const bullets = document.querySelectorAll('.bullet');
    for(let i = 0; i < bullets.length; i++) {
        bullets[i].classList.remove('active_bullet');
    }
    document.querySelectorAll('.bullet')[0].classList.add('active_bullet');
}

function displayWithBullet(e, id) {

    const bullets = document.querySelectorAll('.bullet');
    const show = document.querySelector(`#hourly_${id}`);
    const hourlies = document.querySelectorAll('.hourly');

    for(let i = 0; i < hourlies.length; i++) {
            hourlies[i].style.display = 'none';
    }

    for(let i = 0; i < bullets.length; i++) {
            bullets[i].classList.remove('active_bullet');
    }

    e.target.classList.add('active_bullet');
    if(window.innerWidth > 500)
        show.style.display = 'grid';
    else show.style.display = 'flex';

}

function displayWithArrows(value) {

    if(currentId + value > 3) 
        currentId = 0;
    if(currentId + value < 1)
        currentId = 4;

    currentId += value;

    const bullets = document.querySelectorAll('.bullet');
    const hourlies = document.querySelectorAll('.hourly');

    for(let i = 0; i < hourlies.length; i++) {
            hourlies[i].style.display = 'none';
    }

    for(let i = 0; i < bullets.length; i++) {
            bullets[i].classList.remove('active_bullet');
    }

    if(window.innerWidth > 500)
        hourlies[currentId-1].style.display = 'grid';
    else hourlies[currentId-1].style.display = 'flex';
    bullets[currentId-1].classList.add('active_bullet');
}

function createMenu() {
    const menu = document.createElement('div');
    menu.classList.add('menu');

    const daily = document.createElement('button');
    daily.classList.add('daily_btn');
    daily.classList.add('active');
    daily.textContent = 'Daily';
    daily.onclick = displayDaily;

    const hourly = document.createElement('button');
    hourly.classList.add('hourly_btn');
    hourly.textContent = 'Hourly';
    hourly.onclick = displayHourly;

    const submenu = document.createElement('div');
    submenu.classList.add('submenu');
    submenu.style.display = 'none';

    const leftarrow = document.createElement('div');
    leftarrow.classList.add('leftarrow');
    leftarrow.innerHTML =' &#x3c;';
    leftarrow.onclick = () => {
        displayWithArrows(-1);
    }

    const bullet1 = document.createElement('div');
    bullet1.classList.add('bullet');
    bullet1.classList.add('active_bullet');
    bullet1.onclick = (e) => {
        console.log(e);
        displayWithBullet(e, 1)
    }

    const bullet2 = document.createElement('div');
    bullet2.classList.add('bullet');
    bullet2.onclick = (e) => {
        displayWithBullet(e, 2)
    }

    const bullet3 = document.createElement('div');
    bullet3.classList.add('bullet');
    bullet3.onclick = (e) => {
        displayWithBullet(e, 3)
    }

    const rightarrow = document.createElement('div');
    rightarrow.classList.add('rightarrow');
    rightarrow.innerHTML = '&#x3e;';
    rightarrow.onclick = () => {
        displayWithArrows(+1);
    }

    submenu.appendChild(leftarrow);
    submenu.appendChild(bullet1);
    submenu.appendChild(bullet2);
    submenu.appendChild(bullet3);
    submenu.appendChild(rightarrow);

    menu.appendChild(daily);
    menu.appendChild(hourly);
    menu.appendChild(submenu);

    return menu;
}

function dailyGridElem(obj) {
    const elem = document.createElement('div');
    elem.classList.add('daily_elem');
    elem.setAttribute('id', `daily_${id}`);
    id += 1;
    if(id > 7)
        id = 1;
    const day = document.createElement('p');
    day.classList.add('daily_day');
    day.textContent = getDay(obj.dt);
    const sky = document.createElement('img');
    sky.src = icons[obj.weather[0].icon];
    sky.classList.add('daily_weather');
    const maxtemp = document.createElement('p');
    maxtemp.classList.add('daily_maxtemp');
    maxtemp.textContent = floor(obj.feels_like.day) + sign;
    const mintemp = document.createElement('p');
    mintemp.classList.add('daily_mintemp');
    mintemp.textContent = floor(obj.feels_like.night) + sign;
    const wind = document.createElement('img');
    wind.classList.add('daily_extra');
    wind.src = './icons/wind.png';
    const windText = document.createElement('p');
    windText.classList.add('daily_wind');
    windText.textContent = obj.wind_speed.toFixed(1) + windSpeed;
    const rain = document.createElement('img');
    rain.classList.add('daily_extra');
    rain.src = './icons/rain.png';
    const rainText = document.createElement('p');
    rainText.classList.add('daily_rain');
    rainText.textContent = (obj.pop*100).toFixed(0) + '%';

    elem.appendChild(day);
    elem.appendChild(sky);
    elem.appendChild(maxtemp);
    elem.appendChild(mintemp);
    elem.appendChild(wind);
    elem.appendChild(windText);
    elem.appendChild(rain);
    elem.appendChild(rainText);

    return elem;
}

function createDailyGrid(obj) {
    const daily = document.createElement('div');
    daily.classList.add('daily');

    for(let i = 1; i <= 7; i++) {
        daily.appendChild(dailyGridElem(obj[i]));
    }

    return daily;
}

function hourlyGridElem(hour, temp, src) {
    const elem = document.createElement('div');
    elem.classList.add('hourly_elem');

    const p = document.createElement('p');
    p.classList.add('hourly_hour');
    p.textContent = `${hour}`;

    const temperature = document.createElement('p');
    temperature.classList.add('hourly_temperature');
    temperature.textContent = `${floor(temp)}${sign}`;

    const img = document.createElement('img');
    img.src = src;

    elem.appendChild(p);
    elem.appendChild(temperature);
    elem.appendChild(img);

    return elem;
}

function createHourlyGrid(obj, id) {
    const hourly = document.createElement('div');
    hourly.classList.add('hourly');
    hourly.setAttribute('id', `hourly_${id}`);

    if(id === 1) {
        for(let i = 1; i <= 8; i++) {
            hourly.appendChild(hourlyGridElem(getHour(obj[i].dt), obj[i].temp, icons[obj[i].weather[0].icon]));
        }
    }
    else if(id === 2) {
        for(let i = 9; i <= 16; i++) {
            hourly.appendChild(hourlyGridElem(getHour(obj[i].dt), obj[i].temp, icons[obj[i].weather[0].icon]));
        }
    }
    else {
        for(let i = 17; i <= 24; i++) {
            hourly.appendChild(hourlyGridElem(getHour(obj[i].dt), obj[i].temp, icons[obj[i].weather[0].icon]));
        }
    }

    hourly.style.display = 'none';
    return hourly;
}


export {
    setInfo,
    changeUnits,
}