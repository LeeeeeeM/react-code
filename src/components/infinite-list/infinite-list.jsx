import React, { PureComponent } from 'react'
import classNames from 'classnames'

export default class InfiniteList extends PureComponent  {
  constructor() {
    super()
    this.state = {
      // 可视区域top
      top: 0,
      // 数据总高度
      contentHeight: 0,
      // 可见高度
      visibleHeight: 0,
      // 可见列表
      visibleData: [],
      list: [],
      offset: 10,
      interval: 2,
      startIndex: 0
    }
    this.scrollHandler = this.scrollHandler.bind(this)
  }

  componentDidMount() {
    const visibleHeight = this.wrapper.clientHeight
    this.setState({
      visibleHeight,
      ...this.calculateVisible(this.state.startIndex, this.state, true)
    })
  }

  componentWillReceiveProps(nextProps) {
    const { startIndex } = this.state
    const contentHeight = nextProps.list.reduce((p, c) => p + c.height, 0)
    const result = this.calculateVisible(startIndex, nextProps, true)
    this.setState({
      contentHeight,
      list: nextProps.list,
      offset: nextProps.offset,
      ...result
    })
  }

  scrollHandler(e) {
    const { interval } = this.state
    const startIndex = this.findStartIndex(e.target.scrollTop)
    if (startIndex % interval === 0) {
      const result = this.calculateVisible(startIndex, this.state)
      this.setState({
        startIndex,
        ...result
      })
    }
  }

  findStartIndex(top, recalc = false) {
    const { list } = this.state
    let index = 0

    while (index < list.length) {
      if (list[index] && !list[index].offset) {
        this.calculateOffset(index, recalc)
      }
      if (top < list[index].offsetTop) {
        break
      }
      index++
    }

    return index
  }

  calculateOffset(index, recalc = false) {
    const { list } = this.state
    // 取缓存
    if (!recalc && list[index] && list[index].offsetTop) { return list[index].offsetTop }

    let offsetTop = list[index].height

    if (index > 0) {
      offsetTop += this.calculateOffset(index - 1, recalc)
    }

    // 添加缓存
    list[index] = {
      ...list[index],
      offsetTop
    }

    this.setState({
      list
    })

    return offsetTop
  }

  calculateEndIndex(visibleHeight, index = 0) {
    const { list } = this.state
    while (visibleHeight > 0 && list.length) {
      visibleHeight = visibleHeight - list[index++].height
      if (index >= list.length) {
        break
      }
    }

    return index
  }

  findEndIndex(startIndex, recalc = false) {
    let { visibleHeight } = this.state
    const { list } = this.state

    if (list[startIndex] && list[startIndex].endIndex && !recalc) {
      return list[startIndex].endIndex
    }

    const endIndex = this.calculateEndIndex(visibleHeight, startIndex)

    if (list[startIndex]) {
      list[startIndex].endIndex = endIndex
    }
    
    this.setState({
      list
    })

    return endIndex
  }

  calculateVisible(startIndex, props, recalc = false) {
    const { list, offset } = props

    const innerOffset = startIndex = startIndex - offset

    startIndex = startIndex > 0 ? startIndex : 0

    let endIndex = this.findEndIndex(startIndex, recalc) + offset * 2

    endIndex = innerOffset < 0 ? endIndex + innerOffset : endIndex

    endIndex  = endIndex > list.length ? list.length : endIndex

    const visibleData = list.slice(startIndex, endIndex)

    const top = this.findTopByIndex(startIndex, recalc)

    return {
      visibleData,
      top
    }
  }

  findTopByIndex(index, recalc = false) {
    return index ? this.calculateOffset(index - 1, recalc) : 0
  }

  render() {
    const { visibleData, contentHeight, top } = this.state

    return (<div className="infinite-list infinite-list-wrapper" onScroll={this.scrollHandler} ref={node => {this.wrapper = node}}>
      <div className="infinite-list__ghost" style={{ height: contentHeight }}></div>
      <div className="infinite-list__content" style={{ transform: `translate3d(0, ${top}px, 0)` }}>
        {
          visibleData.map((item, index) => {
            const style = { height: `${ item.height }px`, lineHeight: `${ item.height }px`}
            const theme = index % 2 === 0 ? 'even' : 'odd'
            return <div className={classNames({'infinite-list__item': true, [`infinite-list__item--${theme}`] : true})} style={style} key={index} onClick={this.props.onChangeList}>{`item-${item.val}`}</div>
          })
        }
      </div>
    </div>)
  }
}