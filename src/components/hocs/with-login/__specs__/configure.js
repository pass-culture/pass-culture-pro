import { applyMiddleware, combineReducers, createStore } from 'redux'
import { createDataReducer } from 'redux-thunk-data'
import thunk from 'redux-thunk'


export function configureTestStore() {
  const storeEnhancer = applyMiddleware(thunk.withExtraArgument({ rootUrl: 'http://foo.com' }))

  const rootReducer = combineReducers({
    data: createDataReducer({ users: [] }),
  })

  const store = createStore(rootReducer, storeEnhancer)

  return store
}

export const configureFetchCurrentUserWithLoginFail = () =>
  fetch.mockResponse(
    JSON.stringify([{ global: ['Nobody is authenticated here'] }]),
    { status: 400 }
  )

export const configureFetchCurrentUserWithLoginSuccess = () =>
  fetch.mockResponse(JSON.stringify({ email: 'michel.marx@youpi.fr', hasOffers: false, hasPhysicalVenues: false }), {
    status: 200,
  })

export const configureFetchCurrentUserWithLoginSuccessAndOffers = () =>
  fetch.mockResponse(JSON.stringify({ email: 'michel.marx@youpi.fr', hasOffers: true, hasPhysicalVenues: true  }), {
    status: 200,
  })

export default configureTestStore
