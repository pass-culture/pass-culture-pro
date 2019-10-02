import { compose } from 'redux'
import { connect } from 'react-redux'
import { requestData } from 'redux-saga-data'
import { withRouter } from 'react-router'

import OfferItem from './OfferItem'
import selectAggregatedStockByOfferId from '../../../../selectors/selectAggregatedStockByOfferId'
import selectMaxDateByOfferId from '../../../../selectors/selectMaxDateByOfferId'
import selectMediationsByOfferId from '../../../../selectors/selectMediationsByOfferId'
import selectProductById from '../../../../selectors/selectProductById'
import selectStocksByOfferId from '../../../../selectors/selectStocksByOfferId'
import selectVenueById from '../../../../selectors/selectVenueById'
import selectOffererById from '../../../../selectors/selectOffererById'
import { getOfferTypeLabel } from '../../../../utils/offerItem'
import { offerNormalizer } from '../../../../utils/normalizers'
import withTracking from '../../../hocs/withTracking'

export const mapDispatchToProps = dispatch => ({
  updateOffer: (id, status) => {
    dispatch(
      requestData({
        apiPath: `/offers/${id}`,
        body: {
          isActive: status,
        },
        isMergingDatum: true,
        isMutatingDatum: true,
        isMutaginArray: false,
        method: 'PATCH',
        normalizer: offerNormalizer,
      })
    )
  },
})

export const mapStateToProps = (state, ownProps) => {
  const { offer } = ownProps
  const { id: offerId, productId, venueId } = offer
  const product = selectProductById(state, productId)
  const venue = selectVenueById(state, venueId)
  const offerer = selectOffererById(state, venue.managingOffererId)

  const stockAlertMessage = offer.stockAlertMessage

  return {
    aggregatedStock: selectAggregatedStockByOfferId(state, offerId),
    maxDate: selectMaxDateByOfferId(state, offerId),
    mediations: selectMediationsByOfferId(state, offerId),
    product,
    stocks: selectStocksByOfferId(state, offerId),
    offerer,
    offerTypeLabel: getOfferTypeLabel(product),
    stockAlertMessage,
    venue,
  }
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    trackActivateOffer: offerId => {
      ownProps.tracking.trackEvent({ action: 'activateOffer', name: offerId })
    },
    trackDeactivateOffer: offerId => {
      ownProps.tracking.trackEvent({ action: 'deactivateOffer', name: offerId })
    },
  }
}

export default compose(
  withTracking('OfferItem'),
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )
)(OfferItem)
