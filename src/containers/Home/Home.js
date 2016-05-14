import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loginPanel } from 'redux/modules/stat'

@connect(state => ({}), {loginPanel})
export default class Home extends Component {
  constructor() {
    super()
    this.state = {
      show: false
    }
  }
  handleLogin = () => {
    loginPanel()
  }
  render() {
    const styles = require('./Home.scss')

    return(
      <div className={styles.home}>
        <div className={styles.wrapper}>
          <div>
            simple RSS reader
          </div>
          <button className={styles.login} onClick={this.handleLogin}>LOGIN</button>
        </div>
      </div>
    )
  }
}
