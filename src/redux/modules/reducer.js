import { combineReducers } from 'redux'
import multireducer from 'multireducer'
import { routerReducer } from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-async-connect';


import auth from './auth'
import {reducer as form} from 'redux-form'
import feedly from './feedly'
import manage from './manage'
import stat from './stat'
import media from './media'

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  auth,
  form,
  feedly,
  manage,
  media,
  stat,
})
