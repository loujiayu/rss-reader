import React, { Component, PropTypes} from 'react'
import ReactDom from 'react-dom'
import { connect } from 'react-redux'

import * as authActions from 'redux/modules/auth';

@connect(state => ({
  user: state.auth.user,
  loginError: state.auth.loginError,
  regError: state.auth.regError
}), authActions)
export default class Login extends Component {
  constructor() {
    super()
    this.state = {
      needRegister: false,
      passwordIdential: true,
      errorMsg: false,
      regMsg: false
    }
  }
  static propTypes = {
    login: PropTypes.func.isRequired
    // error: PropTypes.Object
  }
  componentWillReceiveProps(nextProps) {
    nextProps.loginError ? this.setState({errorMsg: true}) : this.setState({errorMsg: false})
    nextProps.regError ? this.setState({regMsg: true}) : this.setState({regMsg: false})
  }
  handleLogin = (event) => {
    event.preventDefault()
    const user = this.refs.loginUsername
    const password = this.refs.loginPassword
    this.props.login(user.value, password.value)
  }
  checkPassword = () => {
    const {reUsername, rePassword, reCnfPassword} = this.refs
    if(rePassword.value !== reCnfPassword.value) {
      this.setState({passwordIdential: false})
    } else {
      this.setState({passwordIdential: true})
    }
  }
  handleRegister = (event) => {
    event.preventDefault()
    const {reUsername, rePassword, reCnfPassword} = this.refs
    this.checkPassword()
    if(this.state.passwordIdential) {
      this.props.register(reUsername.value, rePassword.value)
    }
  }
  handleFlipper = (event) => {
    var flipper = ReactDom.findDOMNode(this)
    this.state.needRegister ? flipper.setAttribute('style', 'transform: rotateY(0deg)') :
                              flipper.setAttribute('style', 'transform: rotateY(180deg)')
    this.state.needRegister = !this.state.needRegister

    // var identialStyle = this.state.passwordIdential ? styles.passwordError : styles.notShow
  }
  render() {
    const {user, loginError, regError} = this.props
    var {passwordIdential, errorMsg, regMsg} = this.state
    var shake
    const styles = require('./Login.scss')
    if(errorMsg || regMsg) {
      shake = styles.shake
    }
    console.log(passwordIdential)
    console.log(user)
    return (
      <div className={`${shake} ${styles.flipper} ${styles.bounceIn}`}>
        <div className={styles.login}>
          <form method="POST" className={styles.dialogForm} onSubmit={this.handleLogin}>
            <div className={styles.dialogHeader}>
              <h3>Login</h3>
            </div>
            <div className={styles.dialogInput + ' form-group'}>
              <input type="text" className="form-control" ref="loginUsername"
                     autofocus placeholder="user name"/>
            </div>
            <div className={styles.dialogInput+ " form-group"}>
              <input type="password" ref="loginPassword" className="form-control"
                     placeholder="password" />
                   {errorMsg && <span className={styles.errorMsg}>{loginError.message}</span>}
            </div>
            <div className={styles.continue}>
              <button type="submit" className="btn btn-default btn-block btn-lg">CONTUNUE</button>
            </div>
            <div className={styles.switch} onClick={this.flipper}><em onClick={this.handleFlipper}>new account</em></div>
          </form>
        </div>
        <div className={styles.register}>
          <form method="POST" className={styles.dialogForm} onSubmit={this.handleRegister}>
            {passwordIdential && <div className={styles.dialogHeader}>
              <h3>Register</h3>
            </div>}
            {!passwordIdential && <div className={styles.passwordError}>The passwords don't match</div>}
            <div className={styles.dialogInput+ " form-group"}>
              <input type="text" ref="reUsername" className="form-control"
                    autofocus placeholder="user name"/>
            </div>
            <div className={styles.dialogInput+ " form-group"}>
              <input type="password" ref="rePassword" className="form-control"  placeholder="password"/>
            </div>
            <div className={styles.dialogInput+ " form-group"}>
              <input type="password" ref="reCnfPassword" onBlur={this.checkPassword} className="form-control" placeholder="confirm password"/>
              {regMsg && <span className={styles.errorMsg}>{regError.message}</span>}
            </div>
            <div className={styles.continue}>
              <button type="submit" className="btn btn-default btn-block btn-lg">CONTUNUE</button>
            </div>
            <div className={styles.switch}>return to <em onClick={this.handleFlipper}>login page</em></div>
          </form>
        </div>
      </div>

    )
  }
}
