import {
  errors,
  form,
  loading,
  notification,
  tracker,
  user,
} from 'pass-culture-shared'
import { combineReducers } from 'redux'
import { modals } from 'redux-react-modals'

import data from './data'

const rootReducer = combineReducers({
  data,
  errors,
  form,
  loading,
  modals,
  notification,
  tracker,
  user,
})

export default rootReducer
