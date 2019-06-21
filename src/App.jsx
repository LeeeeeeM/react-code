import React from 'react'

import './app.scss'

export default class App extends React.Component {
  constructor(...args) {
    super(...args)
    this.state = {
      name: 1
    }
  }

  componentDidMount() {
    this.$LoadingBar.start()
    setTimeout(() => {
      this.$LoadingBar.finish()
    }, 1000)
  }

  render() {
    return (<div></div>)
  }
}