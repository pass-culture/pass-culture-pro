/*
* @debt deprecated "Gaël: deprecated usage of redux-saga-data"
*/

import { createDataReducer } from 'redux-saga-data'

const GET_DESK_BOOKINGS = 'GET_DESK_BOOKINGS'
const SET_MEDIATIONS = 'SET_MEDIATIONS'
const SET_STOCKS = 'SET_STOCKS'
const SET_VENUES = 'SET_VENUES'
const SET_USERS = 'SET_USERS'

export const initialState = {
  bookings: [],
  events: [],
  features: [],
  mediations: [],
  offerers: [],
  stocks: [],
  things: [],
  types: [],
  users: [],
  userOfferers: [],
  venues: [],
  'venue-types': [],
}

const dataReducer = createDataReducer(initialState)

export const setMediations = mediations => ({
  mediations,
  type: SET_MEDIATIONS,
})

export const setStocks = stocks => ({
  stocks,
  type: SET_STOCKS,
})

export const setVenues = venues => ({
  venues,
  type: SET_VENUES,
})

export const setUsers = users => ({
  users,
  type: SET_USERS,
})

const dataAndOffersRecapReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DESK_BOOKINGS:
      return { ...state, ...{ deskBookings: [action.payload] } }
    case SET_MEDIATIONS:
      return { ...state, ...{ mediations: action.mediations } }
    case SET_STOCKS:
      return { ...state, ...{ stocks: action.stocks } }
    case SET_VENUES:
      return { ...state, ...{ venues: action.venues } }
    case SET_USERS:
      return { ...state, ...{ users: action.users } }
    default:
      return dataReducer(state, action)
  }
}

export default dataAndOffersRecapReducer
