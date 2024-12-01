import './style.css';
import { getWeather } from './weather';

getWeather('Sacramento')


const content = document.querySelector('#content')
const search = document.querySelector('#search')
const button = document.querySelector('button')

button.addEventListener('click', ()=>{
    // preventDefault()
    let newLocation = getWeather(search.value)
    console.log(newLocation)
    resetContent()
})

function resetContent(){
    while(content.firstChild){
        content.removeChild(content.lastChild)
    }
}

export function createDataElements(location){
    const address = document.createElement('span')
    const description = document.createElement('span')
    const temp = document.createElement('span')
    
    address.textContent = location.address
    address.className = 'location'
    
    description.textContent = location.description
    description.className = 'description'
    temp.textContent = location.currentConditions.temp
    temp.className = 'temp'

    content.appendChild(address)
    content.appendChild(temp)
    content.appendChild(description)

    if(location.alerts.length > 0){
        const alerts = document.createElement('span')
        alerts.textContent = location.alerts[0].event
        alerts.className = 'alert'
        content.insertBefore(alerts, description)
    }
}


