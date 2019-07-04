import React, { Component } from 'react'
import DanmuStage from '../components/danmu-stage'


export default class extends Component {
  constructor() {
    super()
    this.state = {
      list: []
    }
  }

  componentDidMount() {
    let order = 0
    const list = []

    function produceList(n) {
      const g = order
      while (order < n + g) {
        const i = order
  
        const height = Math.random() > 0.5 ? 100 : 50
  
        const obj = { val: i, height }
  
        if (i === 0) {
          obj.offsetTop = height
        }
  
        list.push(obj)
        order++
      }
      return list
    }

    this.setState({
      list: produceList(10000).slice()
    })

    // this.intervalTimer = setInterval(() => {
    //   this.setState({
    //     list: produceList(5).slice()
    //   })
    // }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.intervalTimer)
  }

  render() {
    const { list } = this.state
    const styles = {
      position: 'fixed',
      top: '100px',
      bottom: 0,
      width: '100%'
    }
    return (
      <div style={styles}>
        <DanmuStage list={list}/>
      </div>
    )
  }
}
