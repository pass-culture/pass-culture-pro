import merge from 'lodash.merge'

import configureStore from 'store'
import { initialState as offersInitialState } from 'store/offers/reducer'
import { initialState as bookingSummaryInitialState } from 'store/reducers/bookingSummary/bookingSummary'
import { initialState as dataInitialState } from 'store/reducers/data'
import { initialState as errorsInitialState } from 'store/reducers/errors'
import { initialState as maintenanceInitialState } from 'store/reducers/maintenanceReducer'
import { initialState as notificationInitialState } from 'store/reducers/notificationReducer'
import { initialState as usersInitialState } from 'store/users/reducer'

export const configureTestStore = overrideData => {
  const initialData = {
    bookingSummary: bookingSummaryInitialState,
    data: dataInitialState,
    errors: errorsInitialState,
    maintenance: maintenanceInitialState,
    notification: notificationInitialState,
    offers: offersInitialState,
    users: usersInitialState,
  }

  return configureStore(merge({}, initialData, overrideData)).store
}
