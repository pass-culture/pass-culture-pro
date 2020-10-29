import { combineReducers } from "redux"

import * as actions from 'store/entities/actions'
import { normalizeRelations } from 'store/entities/helpers'

export const initialState = {
  byId: {},
  allIds: [],
}

function addOfferEntries (state, action) {
  const { offers } = action
  return offers.reduce((newState, offer) => {
    return addOfferEntry(newState, { offer })
  }, state)
}

function addOfferEntry (state, action) {
  const { offerId, offer } = action
  const nestedFields = [
    'mediations',
    'venue',
    'stocks',
  ]
  return {
    ...state,
    [offerId]: normalizeRelations(offer, nestedFields),
  }
}

function offersByIdReducers(state = initialState.byId, action) {
  switch (action.type) {
    case actions.RESET_OFFERS:
      return {}
    case actions.ADD_OFFERS:
      // INFO REVIEW : on entities.[mediations|stocks|venues].reducers,
      // this actions.ADD_OFFERS will trigger add[Mediations|Stocks|Venues]Entries(state, action)
      return addOfferEntries(state, action)
    case actions.ADD_OFFER:
      // INFO REVIEW : same
      return addOfferEntry(state, action)
    default:
      return state
  }
}

function addOfferIds (state, action) {
  const { offerIds } = action
  return state.concat(offerIds)
}

function addOfferId (state, action) {
  const { offerId } = action
  return state.concat(offerId)

}

function allOffersReducers(state = initialState.allIds, action) {
  switch (action.type) {
    case actions.ADD_OFFERS:
      // INFO REVIEW : on entities.[mediations|stocks|venues].reducers,
      // this actions.ADD_OFFERS will trigger add[Mediations|Stocks|Venues]Ids(state, action)
      return addOfferIds(state, action)
    case actions.ADD_OFFER:
      // INFO REVIEW : same
      return addOfferId(state, action)
    default:
      return state
  }
}

export const offersReducers = combineReducers({
  byId: offersByIdReducers,
  allIds: allOffersReducers,
})

