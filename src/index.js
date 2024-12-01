import "./style.css"

const content = document.querySelector('#content')
const child = document.createElement('span')
child.textContent = 'Hello'

content.appendChild(child)