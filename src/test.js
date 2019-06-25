import React from 'react'
import ReactDOM from 'react-dom'

const originCreateElement = document.createElement
document.createElement = function () {
  return originCreateElement.apply(document, arguments)
}

class Child extends React.Component {
  constructor(props) {
    console.log(`child constructor`)
    super(props);
    this.state = {
      v: 'child'
    }
  }
  componentWillMount() {
    console.log(`child componentWillMount`)
    this.setState({ v: 'componentWillMount' })

  }
  componentDidMount() {
    console.log(`child componentDidMount`)
    this.setState({ v: 'componentDidMount' })
  }
  componentWillReceiveProps(nextProps) {
    console.log(`child componentWillReceiveProps`)
    this.setState({ v: 'componentWillReceiveProps' })
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log(`child shouldComponentUpdate`)
    return true
  }
  componentWillUpdate(nextProps, nextState) {
    console.log(`child componentWillUpdate`)
  }
  componentDidUpdate() {
    console.log(`child componentDidUpdate`)

  }
  render() {
    console.log(`child render`)
    return (
      <div>
        state: {this.state.v}
        <hr />
        props: {this.props.value}
      </div>
    )
  }
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    console.log(`Parent constructor`)
    this.state = {
      val: 'constructor',
      count: 0,
      content: '',
      upperCase: false
    }
  }
  componentWillMount() {
    console.log(`parent componentWillMount`)
  }
  componentDidMount() {
    this.setState(state => ({
      count: ++state.count
    }))
    console.log(this.state.count)
    this.setState(state => ({
      count: ++state.count
    }))
    console.log(this.state.count)
    console.log(`parent componentDidMount`)
  }
  componentWillReceiveProps(nextProps) {
    console.log(`parent componentWillReceiveProps`)
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log(`parent shouldComponentUpdate`)
    return true
  }
  componentWillUpdate(nextProps, nextState) {
    console.log(`parent componentWillUpdate`)
  }
  componentDidUpdate() {
    console.log(`parent componentDidUpdate`)
  }
  add() {
    console.log(this.state)
    setTimeout(() => {
      this.setState(state => ({
        count: ++state.count
      }))
      console.log(this.state.count)
      this.setState(state => ({
        count: ++state.count
      }))
      console.log(this.state.count)
    })
  }
  inputChange(e) {
    console.log(e)
    this.setState({
      content: e.target.value
    })
    // 单向数据流，可控 not setState
  }
  toggleCase() {
    const upper = this.state.upperCase

    this.setState(state => ({
      upperCase: !state.upperCase
    }))
    const value = this.inputRef.value

    window.it = this.inputRef // 留给控制台一个钩子可以引用该DOM
    // 这里也充分说明了setState的执行是同步的，只不过存在事务使得state入栈之后做了合并看起来像是异步，这里和Vue不一样，所以react引入了fiber
    
    //这里setState入栈enqueueState，下面代码先执行，所以添加一个异步操作等DOM渲染之后再改变DOM的props
    // this.refs.inputRef.value = upper ? value.toLowerCase() : value.toUpperCase()
    // setTimeout(() => {
    //   this.refs.inputRef.value = upper ? value.toLowerCase() : value.toUpperCase()
    // })

    Promise.resolve().then(() => {
      this.inputRef.value = upper ? value.toLowerCase() : value.toUpperCase()
    })

    // 这里不要setState否则进入render重新刷新view，或者我们的upperCase不进入state中，直接挂载在component实例上
    // this.setState({
    //   upperCase: !upper
    // })
  }
  render() {
    console.log(`parent render`)
    return (
      <div className="container">
        <div onClick={this.add.bind(this)}>{this.state.count}</div>
        <input ref={ele => { this.inputRef = ele }} type="text" value={this.state.content} onChange={this.inputChange.bind(this)}/>
        <div onClick={this.toggleCase.bind(this)}>Toggle Case</div>
        <Child value={this.state.val} />
      </div>
    )
    }
}

ReactDOM.render(
  <Parent />,
  document.getElementById('app')
)