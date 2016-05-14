import React, {Component, PropTypes} from 'react'

export default class TransitionItem extends Component {
  static propTypes = {
    easeInStyle: PropTypes.object.isRequired,
    easeOutStyle: PropTypes.object.isRequired,
    style: PropTypes.object,
    children: PropTypes.node,
    className: PropTypes.string
  }

  state = {
    style: {}
  }

  componentWillUnmount() {
    clearTimeout(this.enterTimeout);
    clearTimeout(this.leaveTimeout);
  }
  componentWillEnter(callback) {
    this.componentWillAppear(callback);
  }
  componentWillAppear(callback) {
    this.setState({style: this.props.easeInStyle})
    this.enterTimeout = setTimeout(callback, 500)
  }
  componentWillLeave(callback) {
    // TODO: animation disable
    this.setState({style: this.props.easeOutStyle})
    this.leaveTimeout = setTimeout(callback, 500)
  }

  render() {
    const {className, style, children, ...other} = this.props
    console.log(this.state.style)
    return (
      <div style={Object.assign({}, this.state.style, style)} className={className} {...other}>
        {children}
      </div>
    )
  }
}
