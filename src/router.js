import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route } from 'react-router-dom'

import App from './App'
import InfiniteList from './pages/infinite-list'

ReactDOM.render((
  <HashRouter>
    <App>
      <Route path="/" />
      <Route path="/infinite-list" component={InfiniteList} />
    </App>
  </HashRouter>
), document.getElementById('app'))