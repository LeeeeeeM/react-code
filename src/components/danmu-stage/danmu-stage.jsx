import React, { Component } from 'react'

class DanmuStage extends Component {
  constructor() {
    super()
    this.state = {
      count: 1
    }
  }

  $mount() {

  }

  render() {
    return (
      <div>this is the danmu stage{this.state.count}</div>
    )
  }
}

DanmuStage.defaultProps = {
  // 弹幕列表
  list: [],
  width: 200,
  height: 200,
  lines: 10
}

export default DanmuStage