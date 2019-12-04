import { applyMiddleware, compose, createStore } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import { API_URL } from '../utils/config'
import thunk from 'redux-thunk'

import persist from './persist'
import rootReducer from '../reducers'

const buildStoreEnhancer = (middlewares = []) => {
  const enhancers = []

  const useDevTools = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  if (useDevTools) {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    return composeEnhancers(...enhancers, applyMiddleware(...middlewares))
  }

  return compose(
    ...enhancers,
    applyMiddleware(...middlewares)
  )
}

const configureStore = (initialState = {}) => {
  const thunkMiddleware = thunk.withExtraArgument({ rootUrl: API_URL })
  const storeEnhancer = buildStoreEnhancer([thunkMiddleware])

  const persistedReducer = persistReducer(persist, rootReducer)

  const store = createStore(persistedReducer, initialState, storeEnhancer)

  const persistor = persistStore(store)

  return { persistor, store }
}

export default configureStore
