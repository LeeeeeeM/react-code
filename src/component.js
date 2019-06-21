import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

import LoadingBar from './components/loading-bar'

React.Component.prototype.$LoadingBar = LoadingBar

const div = document.createElement('div')
document.body.appendChild(div)
ReactDOM.render(<App />, div)
