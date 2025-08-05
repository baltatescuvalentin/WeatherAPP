const KEY = import.meta.env.VITE_OWM_KEY;
let cityNameHolder = "Baltatesti";

function clearData(cityName) {
  if (cityName) {
    // remove whitespace for the api call

    return cityName
      .replace(/(\s+$|^\s+)/g, "") // remove whitespace from begining and end of string
      .replace(/(,\s+)/g, ",") // remove any white space that follows a comma
      .replace(/(\s+,)/g, ",") // remove any white space that preceeds a comma
      .replace(/\s+/g, "+"); // replace any remaining white space with +, so it works in api call
  }
  return "";
}

function buildCityRequestUrl(cityName) {
  return `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${KEY}`;
}

function buildDataRequestUrl(coordinates, units) {
  return `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,alerts&units=${units}&appid=${KEY}`;
}

async function getCoordinates(cityName = "Baltatesti") {
  let req = await fetch(buildCityRequestUrl(clearData(cityName)));

  if (req.status === 400 || req.status === 404) {
    req = await fetch(buildCityRequestUrl(clearData(cityNameHolder)));
  }

  let data = await req.json();
  console.log(data);
  cityNameHolder = data[0].name;

  const coord = {
    name: data[0].name,
    lat: data[0].lat,
    lon: data[0].lon,
    country: data[0].country,
  };

  console.log(coord);

  return coord;
}

async function getWeatherData(cityName = "Baltatesti", units = "metric") {
  let coord = await getCoordinates(clearData(cityName));
  let req = await fetch(buildDataRequestUrl(coord, units));
  let data = await req.json();

  console.log(data);

  return data;
}

export { getCoordinates, getWeatherData };
