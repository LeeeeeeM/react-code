import React from 'react'
import ReactDOM from 'react-dom'

import CSSModules from 'react-css-modules'
import styles from './loading-bar.scss'
import classNames from 'classnames'

class LoadingBar extends React.PureComponent {
  constructor(...args) {
    super(...args)
  }

  render () {
    const { show, status, height, percent } = this.props
    return (
      <div
        styleName="lui-loading-bar"
        className={classNames({ [`lui-loading-bar--${status}`]: show, 'lui-loading-bar--show' : show, 'lui-loading-bar--hide': !show })}
        style={{ height: height + 'px' }}>
        <div 
          styleName="lui-loading-bar__inner"
          style={{ width: percent + '%' }}>
        </div>
      </div>
    )
  }
}

LoadingBar = CSSModules(LoadingBar, styles)

LoadingBar.defaultProps = {
  show: false,
  status: 'success',
  height: 2,
  percent: 0
}

export default class WrapperLoadingBar extends React.PureComponent {
  constructor(...args) {
    super(...args)
    this.state = Object.assign({}, LoadingBar.defaultProps, this.props)
  }

  hide() {
    setTimeout(() => {
      this.updateOptions({
        show: false
      })
      setTimeout(() => {
        this.updateOptions({
          percent: 0
        })
      }, 200)
    }, 800)
  }

  clearTimeout() {
    if (this.runTimer) {
      clearTimeout(this.runTimer)
      this.runTimer = null
    }
  }

  start() {
    if (this.runTimer) return
    let percent = 0
    function updater() {
      percent += Math.floor((Math.random() * 3) + 6)
      if (percent > 90) {
        this.clearTimeout()
        return
      }
      this.updateOptions({
        percent,
        status: 'success',
        show: true
      })
      this.runTimer = setTimeout(updater.bind(this), 1000 / this.state.speed)
    }
    this.runTimer = setTimeout(updater.bind(this), 1000 / this.state.speed)
  }

  finish() {
    this.clearTimeout()
    this.updateOptions({
      percent: 100,
      status: 'success',
      show: true
    })
    this.hide()
  }

  error() {
    this.clearTimeout()
    this.updateOptions({
      percent: 100,
      status: 'error',
      show: true
    })
    this.hide()
  }

  updateOptions(options) {
    this.setState({
      ...options
    })
  }

  render() {
    const { show, status, height, percent } = this.state
    return (
      <LoadingBar show={show} status={status} height={height} percent={percent}/>
    )
  }
}

let loadingBarInstance
let div

WrapperLoadingBar.getInstance = () => {
  if (!loadingBarInstance || !div) {
    div = document.createElement('div')
    document.body.appendChild(div)
    loadingBarInstance = ReactDOM.render(<WrapperLoadingBar />, div)
  }
  return loadingBarInstance
}

WrapperLoadingBar.defaultProps = {
  speed: 10
}
