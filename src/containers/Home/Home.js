import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loginPanel, closeLogin} from 'redux/modules/stat'
import {Login} from 'components'

@connect(state => ({
  show: state.stat.show
}), {loginPanel, closeLogin})
export default class Home extends Component {
  handleLogin = () => {
    this.props.loginPanel()
  }
  render() {
    const styles = require('./Home.scss')

    return(
      <div className={styles.home}>
        <div className={styles.wrapper}>
          <div>
            simple RSS reader
          </div>
          <button className={styles.login} onClick={this.handleLogin}>Get started</button>
        </div>
        <Login />
      </div>
    )
  }
}
