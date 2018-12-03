const originCreateElement = document.createElement;
document.createElement = function () {
  return originCreateElement.apply(document, arguments);
};

class Child extends React.Component {
  constructor(props) {
    console.log(`child constructor`);
    super(props);
    this.state = {
      v: 'child'
    };
  }
  componentWillMount() {
    console.log(`child componentWillMount`);
    this.setState({ v: 'componentWillMount' });
  }
  componentDidMount() {
    console.log(`child componentDidMount`);
    this.setState({ v: 'componentDidMount' });
  }
  componentWillReceiveProps(nextProps) {
    console.log(`child componentWillReceiveProps`);
    this.setState({ v: 'componentWillReceiveProps' });
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log(`child shouldComponentUpdate`);
    return true;
  }
  componentWillUpdate(nextProps, nextState) {
    console.log(`child componentWillUpdate`);
  }
  componentDidUpdate() {
    console.log(`child componentDidUpdate`);
  }
  render() {
    console.log(`child render`);
    return React.createElement(
      'div',
      null,
      'state: ',
      this.state.v,
      React.createElement('hr', null),
      'props: ',
      this.props.value
    );
  }
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    console.log(`Parent constructor`);
    this.state = {
      val: 'constructor',
      count: 0
    };
  }
  componentWillMount() {
    console.log(`parent componentWillMount`);
    this.setState({ val: 'componentWillMount' });
  }
  componentDidMount() {
    console.log(`parent componentDidMount`);
    this.setState({ val: 'componentDidMount' });
  }
  componentWillReceiveProps(nextProps) {
    console.log(`parent componentWillReceiveProps`);
    this.setState({ val: 'componentWillReceiveProps' });
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log(`parent shouldComponentUpdate`);
    return true;
  }
  componentWillUpdate(nextProps, nextState) {
    console.log(`parent componentWillUpdate`);
  }
  componentDidUpdate() {
    console.log(`parent componentDidUpdate`);
  }
  show() {
    console.log(`show`);
    this.setState({
      val: 'eventValue'
    });
  }
  add() {
    setTimeout(() => {
      this.setState({
        count: ++this.state.count
      });
      this.setState({
        count: ++this.state.count
      });
    });
  }
  render() {
    console.log(`parent render`);
    return React.createElement(
      'div',
      { className: 'container', onClick: this.show.bind(this) },
      React.createElement(
        'div',
        { onClick: this.add.bind(this) },
        this.state.count
      ),
      React.createElement(Child, { value: this.state.val })
    );
  }
}

ReactDOM.render(React.createElement(Parent, null), document.getElementById('app'));