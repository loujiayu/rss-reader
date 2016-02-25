import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {Login} from 'components'
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';
import { routeActions } from 'react-router-redux';
import { asyncConnect } from 'redux-async-connect';

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    const promises = [];
    if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth()));
    }
    return Promise.all(promises);
  }
}])
@connect(state => ({user: state.auth.user}),
        {logout, pushState: routeActions.push})
export default class App extends Component {
  constructor() {
    super()
    this.state = {
      show: false
    }
  }
  static propTypes = {
    user: PropTypes.string,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired
    // logout: PropTypes.func
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      this.props.pushState('/loginSuccess');
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState('/');
    }
  }
  handleLogin = (event) => {
    event.preventDefault()
    this.setState({show:true})
  }

  render() {
    const styles = require('./App.less')
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
