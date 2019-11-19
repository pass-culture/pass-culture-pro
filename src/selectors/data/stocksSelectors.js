import createCachedSelector from 're-reselect'
import moment from 'moment'
import { selectOfferById } from './offersSelectors'

export const selectStocksByOfferId = createCachedSelector(
  state => state.data.stocks,
  (state, offerId) => offerId,
  selectOfferById,
  (stocks, offerId, offer) => {
    if (!stocks) {
      return []
    }
    let filteredStocks = stocks.filter(stock => stock.offerId === offerId)

    if (offer && offer.isEvent) {
      filteredStocks.sort(
        (s1, s2) => moment(s2.beginningDatetime).unix() - moment(s1.beginningDatetime).unix()
      )
    }

    return filteredStocks
  }
)((state, offerId = '') => offerId)

export const selectAggregatedStockByOfferId = createCachedSelector(selectStocksByOfferId, stocks =>
  stocks.reduce(
    (aggregatedStock, stock) => ({
      available: aggregatedStock.available + stock.available,
      groupSizeMin: aggregatedStock.groupSizeMin
        ? Math.min(aggregatedStock.groupSizeMin, stock.groupSize)
        : stock.groupSize,
      groupSizeMax: aggregatedStock.groupSizeMax
        ? Math.max(aggregatedStock.groupSizeMax, stock.groupSize)
        : stock.groupSize,
      priceMin: aggregatedStock.priceMin
        ? Math.min(aggregatedStock.priceMin, stock.price)
        : stock.price,
      priceMax: aggregatedStock.priceMax
        ? Math.max(aggregatedStock.priceMax, stock.price)
        : stock.price,
    }),
    {
      available: 0,
      groupSizeMin: 0,
      groupSizeMax: 0,
      priceMin: 0,
      priceMax: 0,
    }
  )
)((state, offerId) => offerId || '')

export const selectLatestDateByOfferId = createCachedSelector(selectStocksByOfferId, stocks => {
  return stocks.reduce(
    (latestDate, stock) =>
      latestDate && latestDate.isAfter(stock.beginningDatetimeMoment)
        ? latestDate
        : stock.beginningDatetimeMoment,
    null
  )
})((state, offerId = '') => offerId)
