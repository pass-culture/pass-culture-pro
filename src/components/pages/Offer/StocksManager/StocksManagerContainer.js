import { connect } from 'react-redux'
import { compose } from 'redux'
import get from 'lodash.get'

import StocksManager from './StocksManager'
import withFrenchQueryRouter from '../../../hocs/withFrenchQueryRouter'
import { selectProductById } from '../../../../selectors/data/productsSelectors'
import { selectStocksByOfferId } from '../../../../selectors/data/stocksSelectors'
import { selectProviderById } from '../../../../selectors/data/providersSelectors'
import { selectOfferById } from '../../../../selectors/data/offersSelectors'

export const mapStateToProps = state => {
  const offerId = state.modal.config.offerId
  const offer = selectOfferById(state, offerId)

  // wtf
  if (!offer) {
    return {}
  }

  const product = selectProductById(state, get(offer, 'productId'))
  const stocks = selectStocksByOfferId(state, offerId)
  const isCreationOfSecondStockPrevented = offer.isThing && stocks.length > 0
  const provider = selectProviderById(state, product && product.lastProviderId)

  return {
    isEvent: offer.isEvent,
    offer,
    product,
    provider,
    isCreationOfSecondStockPrevented,
    stocks,
  }
}

export default compose(
  withFrenchQueryRouter,
  connect(mapStateToProps)
)(StocksManager)
