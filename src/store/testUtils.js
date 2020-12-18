import merge from 'lodash.merge'

import configureStore from 'store'
import rootReducer from 'store/reducers'

export const configureTestStore = overrideState => {
  const emptyAction = { type: '' }
  const initialState = rootReducer(undefined, emptyAction)

  return configureStore(merge(initialState, overrideState)).store
}
