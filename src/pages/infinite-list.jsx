import React, { Component } from 'react'
import InfiniteList from '../components/infinite-list'

export default class extends Component {
  constructor() {
    super()
    this.state = {
      list: [],
      offset: 10
    }
    this.changeList = this.changeList.bind(this)
    this.order = 0
  }

  componentDidMount() {
    const list = this.produceData(this.order + 1000)
    this.setState({ list })
  }

  produceData(n) {
    const list = []
    while (this.order < n) {
      const i = this.order

      const height = Math.random() > 0.5 ? 100 : 50

      const obj = { val: i, height }

      if (i === 0) {
        obj.offsetTop = height
      }

      list.push(obj)
      this.order++
    }
    return list
  }

  changeList() {
    const list = this.state.list.concat(this.produceData(this.order + 5))
    this.setState({
      list
    })
  }

  render() {
    const { list, offset } = this.state
    console.log(list)
    const styles = {
      position: 'fixed',
      top: '100px',
      bottom: 0,
      width: '100%'
    }
    return (
      <div style={styles}>
        <InfiniteList list={list} offset={offset} onChangeList={this.changeList}></InfiniteList>
      </div>
    )
  }
}