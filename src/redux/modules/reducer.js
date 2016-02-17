import { combineReducers } from 'redux'
import multireducer from 'multireducer'
import { routerStateReducer } from 'redux-router'

import auth from './auth'
import {reducer as form} from 'redux-form'
import feedly from './feedly'
import manage from './manage'
import stat from './stat'

export default combineReducers({
  router: routerStateReducer,
  auth,
  form,
  feedly,
  manage,
  stat,
})
