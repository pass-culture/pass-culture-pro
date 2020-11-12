import { form, loading, tracker } from 'pass-culture-shared'
import { combineReducers } from 'redux'

import { offersReducer } from '../offers/reducer'
import { usersReducer } from '../users/reducer'

import actionsBar from './actionsBar'
import bookingSummary from './bookingSummary/bookingSummary'
import data from './data'
import errors from './errors'
import maintenanceReducer from './maintenanceReducer'
import modal from './modal'
import { notificationReducer } from './notificationReducer'

const rootReducer = combineReducers({
  actionsBar,
  bookingSummary,
  data,
  errors,
  form,
  loading,
  modal,
  offers: offersReducer,
  notification: notificationReducer,
  tracker,
  users: usersReducer,
  maintenance: maintenanceReducer,
})

export default rootReducer
