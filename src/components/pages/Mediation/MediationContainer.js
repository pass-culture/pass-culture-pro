import get from 'lodash.get'
import { connect } from 'react-redux'
import { requestData } from 'redux-saga-data'

import { selectOfferById } from 'store/offers/selectors'
import { loadOffer } from 'store/offers/thunks'
import { showNotificationV1 } from 'store/reducers/notificationReducer'
import { selectMediationById } from 'store/selectors/data/mediationsSelectors'
import { selectOffererById } from 'store/selectors/data/offerersSelectors'
import { selectCurrentUser } from 'store/selectors/data/usersSelectors'
import { selectVenueById } from 'store/selectors/data/venuesSelectors'
import { mediationNormalizer, offererNormalizer } from 'utils/normalizers'


import Mediation from './Mediation'

export const mapStateToProps = (state, ownProps) => {
  const {
    match: {
      params: { mediationId, offerId },
    },
  } = ownProps
  const offer = selectOfferById(state, offerId)
  const venue = selectVenueById(state, get(offer, 'venueId'))
  return {
    currentUser: state.users.currentUser,
    offer,
    offerer: selectOffererById(state, venue.managingOffererId),
    venue,
    mediation: selectMediationById(state, mediationId),
  }
}

export const mapDispatchToProps = dispatch => {
  return {
    getMediation: (mediationId, handleSuccess, handleFail) => {
      dispatch(
        requestData({
          apiPath: `/mediations/${mediationId}`,
          handleSuccess,
          handleFail,
          normalizer: mediationNormalizer,
        })
      )
    },
    getOfferer: (offererId, handleSuccess, handleFail) => {
      dispatch(
        requestData({
          apiPath: `/offerers/${offererId}`,
          handleSuccess,
          handleFail,
          normalizer: offererNormalizer,
        })
      )
    },
    loadOffer: offerId => dispatch(loadOffer(offerId)),
    showOfferModificationErrorNotification: error => {
      dispatch(
        showNotificationV1({
          text: error,
          type: 'fail',
        })
      )
    },
    showOfferModificationValidationNotification: () => {
      dispatch(
        showNotificationV1({
          tag: 'mediations-manager',
          text:
            'Votre offre a bien été modifiée. Cette offre peut mettre quelques minutes pour être disponible dans l’application.',
          type: 'success',
        })
      )
    },
    createOrUpdateMediation: (isNew, mediation, body, handleFailData, handleSuccessData) => {
      dispatch(
        requestData({
          apiPath: `/mediations${isNew ? '' : `/${get(mediation, 'id')}`}`,
          body,
          encode: 'multipart/form-data',
          handleFail: handleFailData,
          handleSuccess: handleSuccessData,
          method: isNew ? 'POST' : 'PATCH',
          stateKey: 'mediations',
        })
      )
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Mediation)
