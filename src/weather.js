import { createDataElements, changeBackground } from '.';

async function getWeather(location) {
  const response = await fetch(
    'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' +
      location +
      '?unitGroup=us&key=DBEL78GQRDBKP5JNA4PP2STRF&contentType=json'
  );
  const weatherData = await response.json();
  console.log(weatherData);
  changeBackground(weatherData)
  createDataElements(weatherData);
  
}

export { getWeather };
