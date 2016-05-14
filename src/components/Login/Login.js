import React, { Component, PropTypes} from 'react'
import ReactDom from 'react-dom'
import { connect } from 'react-redux'
import EventListener from 'react-event-listener';
import { TransitionItem } from 'components'
import {login} from 'redux/modules/auth';
import {closeLogin} from 'redux/modules/stat'
import RenderToLayer from 'components/common/RenderToLayer'

import ReactTransitionGroup from 'react-addons-transition-group';

@connect(state => ({
  user: state.auth.user,
  loginError: state.auth.loginError,
  regError: state.auth.regError,
  show: state.stat.show
}), {login, closeLogin})
class LoginInline extends Component {
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
    login: PropTypes.func.isRequired,
    closeLogin: PropTypes.func.isRequired,
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
    const flipper = this.refs.panel.parentElement
    console.log(flipper);
    // var flipper = ReactDom.findDOMNode(this)
    this.state.needRegister ? flipper.setAttribute('style', 'transform: rotateY(0deg)') :
                              flipper.setAttribute('style', 'transform: rotateY(180deg)')
    this.state.needRegister = !this.state.needRegister

    // var identialStyle = this.state.passwordIdential ? styles.passwordError : styles.notShow
  }
  clickaway = (event) => {
    const node = this.refs.panel.parentElement
    if (!node.contains(event.target)) {
      this.props.closeLogin()
    }
  }
  render = () => {

    const {user, loginError, regError, show} = this.props
    var {passwordIdential, errorMsg, regMsg} = this.state
    var shake
    const styles = require('./Login.scss')
    if(errorMsg || regMsg) {
      shake = styles.shake
    }
    const easeInStyle = {
      animationName: styles.bounceIn,
      animationDuration: '0.5s'
    }
    const easeOutStyle = {
      animationName: styles.bousceOut,
      animationDuration: '0.5s'
    }
    const rootStyle = {
      position: 'fixed',
      boxSizing: 'border-box',
      WebkitTapHighlightColor: 'rgba(0,0,0,0)', // Remove mobile color flashing (deprecated)
      top: 0,
      left: show ? 0 : -10000,
      width: '100%',
      height: '100%',
    }
    return (
      <div style={rootStyle}>
        {show &&
          <EventListener
            target="window"
            onClick={this.clickaway}
          />
        }
        <ReactTransitionGroup>
          {show &&
            <TransitionItem
              easeInStyle={easeInStyle}
              easeOutStyle={easeOutStyle}
              className={`${shake} ${styles.flipper}`}
            >
              <div className={styles.login} ref="panel">
                <form method="POST" className={styles.dialogForm} onSubmit={this.handleLogin}>
                  <div className={styles.dialogHeader}>
                    <h3>Login</h3>
                  </div>
                  <div className={styles.dialogInput}>
                    <input type="text" ref="loginUsername" className={styles.input}
                           autofocus placeholder="user name"/>
                  </div>
                  <div className={styles.dialogInput}>
                    <input type="password" ref="loginPassword" className={styles.input}
                           placeholder="password" />
                         {errorMsg && <span className={styles.errorMsg}>{loginError.message}</span>}
                  </div>
                  <div className={styles.continue}>
                    <button type="submit">
                      CONTUNUE
                    </button>
                  </div>
                  <div className={styles.switch} onClick={this.flipper}><em onClick={this.handleFlipper}>new account</em></div>
                </form>
              </div>
              <div className={styles.register} >
                <form method="POST" className={styles.dialogForm} onSubmit={this.handleRegister}>
                  {passwordIdential && <div className={styles.dialogHeader}>
                    <h3>Register</h3>
                  </div>}
                  {!passwordIdential && <div className={styles.passwordError}>The passwords don't match</div>}
                  <div className={styles.dialogInput}>
                    <input type="text" ref="reUsername" className={styles.input}
                          autofocus placeholder="user name"/>
                  </div>
                  <div className={styles.dialogInput}>
                    <input type="password" ref="rePassword" className={styles.input}  placeholder="password"/>
                  </div>
                  <div className={styles.dialogInput}>
                    <input type="password" ref="reCnfPassword" onBlur={this.checkPassword} className={styles.input} placeholder="confirm password"/>
                    {regMsg && <span className={styles.errorMsg}>{regError.message}</span>}
                  </div>
                  <div className={styles.continue}>
                    <button type="submit">CONTUNUE</button>
                  </div>
                  <div className={styles.switch}>return to <em onClick={this.handleFlipper}>login page</em></div>
                </form>
              </div>
            </TransitionItem>
          }

        </ReactTransitionGroup>
      </div>
    )
  }
}

export default class Login extends Component {
  renderLayer = () => {
    return (
      <LoginInline />
    )
  }
  render() {
    // return null
    return (
      <RenderToLayer render={this.renderLayer} open={true} />
    )
  }
}
