import { createSelector } from 'reselect'

import { resolveRelations } from 'store/entities/helpers'
// INFO REVIEW: These entities modules doesn't existe yet
import mediationsSelectors from 'store/entities/mediations/selectors'
import stocksSelectors from 'store/entities/stocks/selectors'
import venuesSelectors from 'store/entities/venues/selectors'

const selectors = {
  mediations: mediationsSelectors,
  stocks: stocksSelectors,
  venues: venuesSelectors,
}

const getOffersById = state => state.offers.byId
const getOfferIds = state => state.offers.allIds

const findById = createSelector(
  [getOffersById],
  (_state, offerId) => offerId,
  (offersById, offerId) => {
    const fields = Object.keys(selectors)
    return resolveRelations(offersById[offerId], fields, selectors)
  },
)

const list = createSelector(
  [getOfferIds],
  (offerIds) => {
    return offerIds.map((offerId) => findById(offerId))
  }
)

export default {
  findById,
  list,
}
