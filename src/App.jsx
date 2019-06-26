import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './app.scss'

export default class App extends Component {
  componentDidMount() {
    this.$LoadingBar.start()
    setTimeout(() => {
      this.$LoadingBar.finish()
    }, 1000)
  }
  render() {
    return (<div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/infinite-list">infinite-list</Link></li>
        <li><Link to="/danmu-stage">danmu-stage</Link></li>
      </ul>
      {this.props.children}
    </div>)
  }
}