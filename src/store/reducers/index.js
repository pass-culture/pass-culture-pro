import { combineReducers } from 'redux'

import { tracker } from 'store/reducers/tracker'

import { offersReducer } from '../offers/reducer'
import { usersReducer } from '../users/reducer'

import bookingSummary from './bookingSummary/bookingSummary'
import data from './data'
import errors from './errors'
import maintenanceReducer from './maintenanceReducer'
import { notificationReducer } from './notificationReducer'

const rootReducer = combineReducers({
  bookingSummary,
  data,
  errors,
  maintenance: maintenanceReducer,
  notification: notificationReducer,
  offers: offersReducer,
  tracker,
  users: usersReducer,
})

export default rootReducer
