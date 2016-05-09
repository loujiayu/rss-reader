import React from 'react'
import {IndexRoute, Route} from 'react-router';
import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth'
import {
    New,
    Center,
    Home
  } from 'containers'
import {Login} from 'components'

export default (store) => {
  const requireLogin = (nextState, replace, cb) => {
    function checkAuth() {
      const { auth: { user }} = store.getState()
      if (!user) {
        replace('/')
      }
      cb()
    }

    if (!isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(checkAuth)
    } else {
      checkAuth()
    }
  }

  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={New}>
      <IndexRoute component={Login}/>
      <Route onEnter={requireLogin}>
        <Route path="loginSuccess" component={Center}/>
      </Route>
      <Route path="login" component={Login}/>
    </Route>
  )
}
