import React, { Component } from 'react'
import classNames from 'classnames'
import debounce from 'lodash/debounce'

class DanmuStage extends Component {
  constructor() {
    super()
    this.state = {
      // 可视区域top
      top: 0,
      // 数据总高度
      contentHeight: 0,
      // 可见列表
      visibleData: [],
      // 以上参与到渲染

      // 以下不参与到渲染中
      // 可见高度
      visibleHeight: 0,
      startIndex: 0
    }

    this.scrollHandler = this.scrollHandler.bind(this)
    this.debounceFn = debounce(this.debounceScroll.bind(this), 10)
    this.wrapper = React.createRef()
  }

  componentDidMount() {
    const visibleHeight = this.wrapper.current.clientHeight
    const { startIndex } = this.state
    const result = this.calculateVisible(startIndex, false)
    this.setState({
      visibleHeight,
      ...result
    })
  }

  static getDerivedStateFromProps(props, state) {
    const contentHeight = props.list.reduce((p, c) => p + c.height, 0)
    return {
      contentHeight
    }
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    return null
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.list !== this.props.list) {
      const { startIndex } = this.state
      const result = this.calculateVisible(startIndex, false)
      this.setState({
        ...result
      })
    }
  }

  debounceScroll(scrollTop) {
    const startIndex = this.findStartIndex(scrollTop)
    const result = this.calculateVisible(startIndex, false)
    this.setState({
      startIndex,
      ...result
    })
  }

  scrollHandler(e) {
    const startIndex = this.findStartIndex(e.target.scrollTop)
    if (startIndex % this.props.dc === 1) {
      const result = this.calculateVisible(startIndex, false)
      this.setState({
        startIndex,
        ...result
      })
    }
    this.debounceFn(e.target.scrollTop)
  }

  findStartIndex(top, recalc = false) {
    const { list } = this.props
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
    const { list } = this.props
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

    return offsetTop
  }

  calculateEndIndex(visibleHeight, index = 0) {
    const { list } = this.props
    while (visibleHeight > 0 && list.length) {
      visibleHeight = visibleHeight - list[index++].height
      if (index === list.length - 1) {
        break
      }
    }

    return index
  }

  findEndIndex(startIndex, recalc = false) {
    let { visibleHeight } = this.state
    const { list } = this.props

    if (list[startIndex] && list[startIndex].endIndex && !recalc) {
      return list[startIndex].endIndex
    }

    const endIndex = this.calculateEndIndex(visibleHeight, startIndex)

    if (list[startIndex]) {
      list[startIndex].endIndex = endIndex
    }

    return endIndex
  }

  calculateVisible(startIndex, recalc = false) {
    const { list, offset } = this.props

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

    return (<div className="infinite-list infinite-list-wrapper" onScroll={this.scrollHandler} ref={this.wrapper}>
      <div className="infinite-list__ghost" style={{ height: contentHeight }}></div>
      <div className="infinite-list__content" style={{ transform: `translate3d(0, ${top}px, 0)` }}>
        {
          visibleData.map((item, index) => {
            const style = { height: `${ item.height }px`, lineHeight: `${ item.height }px`}
            const theme = item.val % 2 === 0 ? 'even' : 'odd'
            return <div className={classNames({'infinite-list__item': true, [`infinite-list__item--${theme}`] : true})} style={style} key={index} onClick={this.props.onChangeList}>{`item-${item.val}`}</div>
          })
        }
      </div>
    </div>)
  }
}

DanmuStage.defaultProps = {
  list: [],
  offset: 10,
  dc: 2 // debouceCount
}

export default DanmuStage