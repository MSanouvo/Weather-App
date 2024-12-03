import './style.css';
import { getWeather } from './weather';


export let setting = 'F';
let currentLocation = 'Sacramento';
renderContent();


function renderContent() {
  getWeather(currentLocation);

  const search = document.querySelector('#search');
  const button = document.querySelector('button');

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

  button.addEventListener('click', () => {
    // preventDefault()
    currentLocation = search.value;
    let newLocation = getWeather(currentLocation);
    console.log(newLocation);
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
