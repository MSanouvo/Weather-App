import Cloudy from './icons/cloud.png';
import Rain from './icons/rainy.png';
import Sun from './icons/sun.png';
import { setting } from '.';

async function getWeather(location) {
  const error = document.querySelector('.error');
  try {
    const response = await fetch(
      'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' +
        location +
        '?unitGroup=us&key=DBEL78GQRDBKP5JNA4PP2STRF&contentType=json'
    );
    const weatherData = await response.json();
    console.log(weatherData);
    changeBackground(weatherData);
    createDataElements(weatherData);
    error.textContent = '';
  } catch (err) {
    console.log(err);
    error.textContent = 'Please Enter Valid Location.';
  }
}

function createDataElements(location) {
  const content = document.querySelector('#content');
  resetContent(content);
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
  const weeklyDiv = document.createElement('div');
  weeklyDiv.classList = 'week-container';
  showDailyTemp(weeklyDiv, location);

  //Hourly Data
  const hourlyDiv = document.createElement('div');
  hourlyDiv.className = 'hourly-container';
  showHourlyTemp(hourlyDiv, location);
  scrollWheel(hourlyDiv);

  content.appendChild(address);
  content.appendChild(temp);
  content.appendChild(minMax);
  content.appendChild(description);
  content.appendChild(weeklyDiv);
  content.appendChild(hourlyDiv);

  if (location.alerts.length > 0) {
    const alerts = document.createElement('span');
    alerts.textContent = location.alerts[0].event;
    alerts.className = 'alert';
    content.insertBefore(alerts, description);
  }
}

function showDailyTemp(week, location) {
  for (let i = 1; i < 6; i++) {
    const day = document.createElement('div');
    day.className = 'days';
    const date = document.createElement('span');
    date.textContent = location.days[i].datetime;
    const dayMinMax = document.createElement('div');
    dayMinMax.className = 'days-min-max';
    const dayTempMax = document.createElement('span');
    const dayTempMin = document.createElement('span');
    const dayIcon = document.createElement('img');
    dayIcon.className = 'days-icon';

    if (
      location.days[i].icon === 'cloudy' ||
      location.days[i].icon === 'partly-cloudy-day'
    ) {
      dayIcon.src = Cloudy;
    } else if (location.days[i].icon === 'rain') {
      dayIcon.src = Rain;
    } else {
      dayIcon.src = Sun;
    }

    if (setting === 'C') {
      dayTempMax.textContent = toCelsius(location.days[i].tempmax) + '°C';
      dayTempMin.textContent = toCelsius(location.days[i].tempmin) + '°C';
    } else {
      dayTempMax.textContent = location.days[i].tempmax.toFixed(0) + '°F';
      dayTempMin.textContent = location.days[i].tempmin.toFixed(0) + '°F';
    }

    dayMinMax.appendChild(dayTempMax);
    dayMinMax.appendChild(dayTempMin);

    day.appendChild(date);
    day.appendChild(dayIcon);
    day.appendChild(dayMinMax);

    week.appendChild(day);
  }
}

function showHourlyTemp(div, location) {
  for (let i = 0; i < location.days[0].hours.length; i++) {
    const hours = document.createElement('div');
    hours.className = 'hours';
    const hoursText = document.createElement('span');
    hoursText.textContent = location.days[0].hours[i].datetime;
    const hoursTemp = document.createElement('span');
    if (setting === 'C') {
      hoursTemp.textContent = toCelsius(location.days[0].hours[i].temp) + '°C';
    } else {
      hoursTemp.textContent = location.days[0].hours[i].temp.toFixed(0) + '°F';
    }
    const hoursIcon = document.createElement('img');
    hoursIcon.className = 'days-icon';
    if (
      location.days[0].hours[i].icon === 'cloudy' ||
      location.days[0].hours[i].icon === 'partly-cloudy-day'
    ) {
      hoursIcon.src = Cloudy;
    } else if (location.days[0].hours[i].icon === 'rain') {
      hoursIcon.src = Rain;
    } else {
      hoursIcon.src = Sun;
    }

    hours.appendChild(hoursText);
    hours.appendChild(hoursIcon);
    hours.appendChild(hoursTemp);

    div.appendChild(hours);
  }
}

function changeBackground(weather) {
  const background = document.querySelector('.background');
  if (weather.currentConditions.icon === 'rain') {
    background.className = 'background';
    background.classList.add('rain');
  } else if (
    weather.currentConditions.icon === 'cloudy' ||
    weather.currentConditions.icon === 'partly-cloudy-day'
  ) {
    background.className = 'background';
    background.classList.add('cloudy');
  } else if (
    weather.currentConditions.sunset > weather.currentConditions.datetime ||
    weather.currentConditions.datetime < weather.currentConditions.sunrise
  ) {
    background.className = 'background';
    background.classList.add('day');
  } else {
    background.className = 'background';
    background.classList.add('night');
  }
}

function toCelsius(temp) {
  let celsius = (5 / 9) * (temp - 32);
  return celsius.toFixed(1);
}

function resetContent(content) {
  while (content.firstChild) {
    content.removeChild(content.lastChild);
  }
}

function scrollWheel(container) {
  container.addEventListener('wheel', (e) => {
    if (e.deltaY > 0) {
      container.scrollLeft += 100;
      e.preventDefault();
    } else {
      container.scrollLeft -= 100;
      e.preventDefault();
    }
  });
}

export { getWeather };
