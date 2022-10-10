
const KEY = '5047df05258eb3b2fbbfcdc8184018a7';
let cityNameHolder = "Baltatesti";

function clearData(cityName) {
    if (cityName) {
        // remove whitespace for the api call
    
        return cityName
          .replace(/(\s+$|^\s+)/g, '') // remove whitespace from begining and end of string
          .replace(/(,\s+)/g, ',') // remove any white space that follows a comma
          .replace(/(\s+,)/g, ',') // remove any white space that preceeds a comma
          .replace(/\s+/g, '+'); // replace any remaining white space with +, so it works in api call
      }
      return '';
}

function buildCityRequestUrl(cityName) {
    return `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=${KEY}`;
}

function buildDataRequestUrl(coordinates, units) {
    return `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,alerts&units=${units}&appid=${KEY}`;
}

async function getCoordinates(cityName = 'Baltatesti') {
    
    let req = await fetch(buildCityRequestUrl(clearData(cityName)));

    if(req.status === 400 || req.status === 404) {
        req = await fetch(buildCityRequestUrl(clearData(cityNameHolder)));
    }

    let data = await req.json();

    let { coord } = data;
    coord.name = data.name;
    cityNameHolder = data.name;
    coord.country = data.sys.country;

    console.log(coord);

    return coord;
}

async function getWeatherData(cityName = 'Baltatesti', units='metric') {
    let coord = await getCoordinates(clearData(cityName));
    let req = await fetch(buildDataRequestUrl(coord, units));
    let data = await req.json();

    console.log(data);

    return data;
}

export {
    getCoordinates,
    getWeatherData,
}