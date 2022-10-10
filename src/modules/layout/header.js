import { changeUnits } from "./main";

function createHeader() {
    const header = document.createElement('header');
    
    const title = document.createElement('div');
    title.classList.add('title');
    const titleContainer = document.createElement('div');
    titleContainer.classList.add('title_container');
    const appTitle = document.createElement('p');
    appTitle.classList.add('app_title');
    appTitle.textContent = 'Weather App';
    const img = document.createElement('img');
    img.src = './icons/sun.png';
    img.alt = 'icon';
    img.classList.add('header_icon');

    titleContainer.appendChild(appTitle);
    titleContainer.appendChild(img);

    const OWM = document.createElement('a');
    OWM.href = 'https://openweathermap.org/';
    OWM.classList.add('openweathermap');
    OWM.textContent = 'OpenWeatherMap';

    const poweredBy = document.createElement('p');
    poweredBy.textContent = 'Powered By ';
    poweredBy.appendChild(OWM);

    title.appendChild(titleContainer);
    title.appendChild(poweredBy);

    const search = document.createElement('input');
    search.type = 'text';
    search.name = 'search';
    search.id = 'search';
    search.placeholder = 'Search...';

    const units = document.createElement('div');
    units.classList.add('units');

    const celsius = document.createElement('p');
    celsius.classList.add('temperature_chosen');
    celsius.setAttribute('id', 'celsius');
    celsius.textContent = 'Celsius';

    const slash = document.createElement('p');
    slash.textContent = '/';

    const fahrenheit = document.createElement('p');
    fahrenheit.setAttribute('id', 'fahrenheit');
    fahrenheit.textContent = 'Fahrenheit';

    units.appendChild(celsius);
    units.appendChild(slash);
    units.appendChild(fahrenheit);

    header.appendChild(title);
    header.appendChild(search);
    header.appendChild(units);

    return header;
}

export default createHeader;