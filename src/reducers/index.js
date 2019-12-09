import { form, loading, notification, tracker } from 'pass-culture-shared'
import { combineReducers } from 'redux'

import data from './data'
import errors from './errors'
import modal from './modal'
import bookingSummary from './bookingSummary/bookingSummary'
import maintenanceErrors from './maintenanceErrors';

const rootReducer = combineReducers({
  bookingSummary,
  data,
  errors,
  form,
  loading,
  modal,
  notification,
  tracker,
  maintenanceErrors
})

export default rootReducer
