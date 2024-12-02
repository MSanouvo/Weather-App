import './style.css';
import { getWeather } from './weather';
import Cloudy from './icons/cloud.png'
import Rain from './icons/rainy.png'
import Sun from './icons/sun.png'

let setting = 'F';
let currentLocation = 'Sacramento';

startApp();

const content = document.querySelector('#content');
const search = document.querySelector('#search');
const button = document.querySelector('button');

button.addEventListener('click', () => {
  // preventDefault()
  currentLocation = search.value;
  let newLocation = getWeather(currentLocation);
  console.log(newLocation);
});

function resetContent() {
  while (content.firstChild) {
    content.removeChild(content.lastChild);
  }
}

export function createDataElements(location) {
  resetContent();
  //Today's weather data
  const address = document.createElement('span');
  const description = document.createElement('span');
  const temp = document.createElement('span');

  address.textContent = location.address;
  address.className = 'location';
  description.textContent = location.description;
  description.className = 'description';
  temp.className = 'temp';

  const minMax = document.createElement('div');
  minMax.className = 'min-max-temp';
  const max = document.createElement('span');
  max.className = 'max-temp';
  const min = document.createElement('span');
  min.className = 'min-temp';
  minMax.appendChild(max);
  minMax.appendChild(min);
  

  if (setting === 'C') {
    max.textContent = 'H: ' + toCelsius(location.days[0].tempmax) + '°C';
    min.textContent = 'L: ' + toCelsius(location.days[0].tempmin) + '°C';
    temp.textContent = toCelsius(location.currentConditions.temp) + '°C';
  } else {
    temp.textContent = location.currentConditions.temp + '°F';
    max.textContent = 'H: ' + location.days[0].tempmax + '°F';
    min.textContent = 'L: ' + location.days[0].tempmin + '°F';
  }

  //Weekly data
  const weeklyDiv = document.createElement('div')
  weeklyDiv.classList = 'week-container'
  for(let i=1; i<location.days.length; i++){
    const day = document.createElement('div')
    day.className = 'days'
    const date = document.createElement('span')
    date.textContent = location.days[i].datetime
    const dayMinMax = document.createElement('div')
    dayMinMax.className = 'days-min-max'
    const dayTempMax = document.createElement('span')
    const dayTempMin = document.createElement('span')
    const dayIcon = document.createElement('img')
    dayIcon.className = 'days-icon'
    if(location.days[i].icon === 'cloudy'){
        dayIcon.src = Cloudy
    } 
    else if(location.days[i].icon === 'rain'){
        dayIcon.src = Rain
    } else{
        dayIcon.src = Sun
    }
        

    if(setting === 'C'){
        dayTempMax.textContent = toCelsius(location.days[i].tempmax)+ '°C'
        dayTempMin.textContent = toCelsius(location.days[i].tempmin)+ '°C'
    } else{
        dayTempMax.textContent = location.days[i].tempmax.toFixed(0) + '°F'
        dayTempMin.textContent = location.days[i].tempmin.toFixed(0) + '°F'
    }
    dayMinMax.appendChild(dayTempMax)
    dayMinMax.appendChild(dayTempMin)

    day.appendChild(date)
    day.appendChild(dayIcon)
    day.appendChild(dayMinMax)

    weeklyDiv.appendChild(day)
  }
  

  content.appendChild(address);
  content.appendChild(temp);
  content.appendChild(minMax);
  content.appendChild(description);
  content.appendChild(weeklyDiv)

  if (location.alerts.length > 0) {
    const alerts = document.createElement('span');
    alerts.textContent = location.alerts[0].event;
    alerts.className = 'alert';
    content.insertBefore(alerts, description);
  }
}

export function changeBackground(weather) {
  const background = document.querySelector('.background');
  const time = new Date();
  const currentTime = time.toLocaleTimeString();
  console.log(weather.currentConditions.datetime);
  console.log(weather.currentConditions.sunset);
  console.log(weather.currentConditions.icon);
  if (weather.currentConditions.icon === 'rain') {
    background.className = 'background';
    background.classList.add('rain');
    console.log('rainy');
  } else if (weather.currentConditions.icon === 'cloudy') {
    background.className = 'background';
    background.classList.add('cloudy');
    console.log('cloudy');
  } else if (
    weather.currentConditions.sunset > weather.currentConditions.datetime ||
    weather.currentConditions.datetime < weather.currentConditions.sunrise
  ) {
    background.className = 'background';
    background.classList.add('day');
    console.log('day');
  } else {
    background.className = 'background';
    background.classList.add('night');
    console.log('night');
  }
}

function toCelsius(temp) {
  let celsius = (5 / 9) * (temp - 32);
  return celsius.toFixed(1);
}

function startApp() {
  getWeather(currentLocation);

  const toggleF = document.querySelector('#F');
  toggleF.className = 'toggled';
  const toggleC = document.querySelector('#C');

  toggleC.addEventListener('click', () => {
    setting = 'C';
    changeToggle(toggleF, toggleC);
    getWeather(currentLocation);
  });

  toggleF.addEventListener('click', () => {
    setting = 'F';
    changeToggle(toggleF, toggleC);
    getWeather(currentLocation);
  });
}

function changeToggle(f, c) {
  if (setting === 'F') {
    f.className = 'toggled';
    c.className = '';
  } else {
    f.className = '';
    c.className = 'toggled';
  }
}
