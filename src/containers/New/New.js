import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap';
import {Login} from 'components'
import { pushState } from 'redux-router';
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';
import connectData from 'helpers/connectData';

function fetchData(getState, dispatch) {
  const promises = [];
  // if (!isInfoLoaded(getState())) {
  //   promises.push(dispatch(loadInfo()));
  // }
  if (!isAuthLoaded(getState())) {
    promises.push(dispatch(loadAuth()));
  }
  return Promise.all(promises);
}
@connectData(fetchData)
@connect(state => ({user: state.auth.user}),{logout, pushState})
export default class App extends Component {
  constructor() {
    super()
    this.state = {
      show: false
    }
  }
  static propTypes = {
    // user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired
    // logout: PropTypes.func
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      this.props.pushState(null, '/loginSuccess');
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState(null, '/');
    }
  }
  // handleSubmit = (event) => {
  //   event.preventDefault();
  //   const input = this.refs.username;
  //   this.props.login(input.value);
  //   input.value = '';
  // }
  handleLogin = (event) => {
    event.preventDefault()
    this.setState({show:true})
  }

  render() {
    const styles = require('./New.less')
      // var showStyle = this.state.show ? styles.login : styles.normal
    var showStyle = styles.login
    var login = true

    return (
      <div className={styles.appWrapper}>
        {!login && <div className={styles.frame}>
          <div className={styles.navBar}>
            <div className={styles.navHeader}>
              <h3>Home</h3>
            </div>
            <div className={styles.navItem}>
              <button className="btn btn-default" onClick={this.handleLogin}></button>
            </div>
          </div>
        </div>}
        <div className={styles.appContent}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
