import { closeNotification, lastTrackerMoment, showNotification } from 'pass-culture-shared'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { assignData, requestData } from 'redux-saga-data'

import Offers from './Offers'
import { withRequiredLogin } from '../../hocs'
import { selectOffererById } from '../../../selectors/data/offerersSelectors'
import selectOffersByOffererIdAndVenueId from '../../../selectors/selectOffersByOffererIdAndVenueId'
import { selectVenueById } from '../../../selectors/data/venuesSelectors'
import { offerNormalizer } from '../../../utils/normalizers'
import { translateQueryParamsToApiParams } from '../../../utils/translate'

export const mapStateToProps = (state, ownProps) => {
  const { query } = ownProps
  const queryParams = query.parse()
  const apiQueryParams = translateQueryParamsToApiParams(queryParams)
  const { offererId, venueId } = apiQueryParams

  return {
    lastTrackerMoment: lastTrackerMoment(state, 'offers'),
    notification: state.notification,
    offers: selectOffersByOffererIdAndVenueId(state, offererId, venueId),
    offerer: selectOffererById(state, offererId),
    types: state.data.types,
    venue: selectVenueById(state, venueId),
  }
}

export const mapDispatchToProps = dispatch => {
  const showOffersActivationNotification = notificationMessage => {
    dispatch(
      showNotification({
        tag: 'offers-activation',
        text: notificationMessage,
        type: 'success',
      })
    )
  }
  return {
    closeNotification: () => dispatch(closeNotification()),

    handleOnActivateAllVenueOffersClick: () => venue => {
      dispatch(
        requestData({
          apiPath: `/venues/${venue.id}/offers/activate`,
          method: 'PUT',
          stateKey: 'offers',
          handleSuccess: showOffersActivationNotification(
            'Toutes les offres de ce lieu ont été activées avec succès'
          ),
        })
      )
    },

    handleOnDeactivateAllVenueOffersClick: () => venue => {
      dispatch(
        requestData({
          apiPath: `/venues/${venue.id}/offers/deactivate`,
          method: 'PUT',
          stateKey: 'offers',
          handleSuccess: showOffersActivationNotification(
            'Toutes les offres de ce lieu ont été désactivées avec succès'
          ),
        })
      )
    },

    loadOffers: config =>
      dispatch(
        requestData({
          ...config,
          normalizer: offerNormalizer,
        })
      ),

    loadTypes: () => dispatch(requestData({ apiPath: '/types' })),

    resetLoadedOffers: () => dispatch(assignData({ offers: [] })),
  }
}

export default compose(
  withRequiredLogin,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Offers)
