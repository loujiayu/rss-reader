import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'

import { reMark } from 'redux/modules/manage'

@connect(state => ({
  markall: state.manage.markall
}),{reMark})
export default class SnackBar extends Component {
  constructor() {
    super()
    this.state = {
      show: false
    }
  }
  static propTypes = {
    markall: PropTypes.bool.isRequired
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.markall && nextProps.markall) {
      // mark success
      this.setState({show: true})
      setTimeout(() => {
        this.props.reMark()
        this.setState({show: false})
      } ,5000)
    } else if (!this.props.markall && !nextProps.markall) {
      // mark fail
    }
  }
  render () {
    const styles = require('./SnackBar.less')
    const {message} = this.props
    var popStyle = this.state.show ? styles.snack : ''
    return (
      <div className={`${styles.origin} ${popStyle}`}>
        <span>{message}</span>
      </div>
    )
  }
}
