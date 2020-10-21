import { lastTrackerMoment } from 'pass-culture-shared'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { requestData } from 'redux-saga-data'

import { withRequiredLogin } from 'components/hocs'
import { hideActionsBar, showActionsBar } from 'store/reducers/actionsBar'
import { saveSearchFilters, setSelectedOfferIds } from 'store/reducers/offers'
import { selectOffers } from 'store/selectors/data/offersSelectors'
import Offers from './Offers'
import { closeNotification, showNotificationV1 } from 'store/reducers/notificationReducer'
import pcapi from 'services/pcapi'

export const mapStateToProps = state => {
  return {
    lastTrackerMoment: lastTrackerMoment(state, 'offers'),
    notification: state.notification,
    offers: selectOffers(state),
    searchFilters: state.offers.searchFilters,
    selectedOfferIds: state.offers.selectedOfferIds,
  }
}

export const mapDispatchToProps = dispatch => {
  const showOffersActivationNotification = notificationMessage => {
    dispatch(
      showNotificationV1({
        tag: 'offers-activation',
        text: notificationMessage,
        type: 'success',
      })
    )
  }
  return {
    closeNotification: () => dispatch(closeNotification()),
    handleOnActivateAllVenueOffersClick: venueId => () => {
      dispatch(
        requestData({
          apiPath: `/venues/${venueId}/offers/activate`,
          method: 'PUT',
          stateKey: 'offers',
          handleSuccess: showOffersActivationNotification(
            'Toutes les offres de ce lieu ont été activées avec succès'
          ),
        })
      )
    },
    handleOnDeactivateAllVenueOffersClick: venueId => () => {
      dispatch(
        requestData({
          apiPath: `/venues/${venueId}/offers/deactivate`,
          method: 'PUT',
          stateKey: 'offers',
          handleSuccess: showOffersActivationNotification(
            'Toutes les offres de ce lieu ont été désactivées avec succès'
          ),
        })
      )
    },
    hideActionsBar: () => dispatch(hideActionsBar()),
    loadOffers: filters => {
      return pcapi.offers
        .loadFilteredOffers(filters)
        .then(({ offers, page, page_count: pageCount, total_count: offersCount }) => {
          dispatch({
            type: 'GET_PAGINATED_OFFERS',
            payload: offers,
          })

          return { page, pageCount, offersCount }
        })
    },
    saveSearchFilters: filters => dispatch(saveSearchFilters(filters)),
    setSelectedOfferIds: selectedOfferIds => dispatch(setSelectedOfferIds(selectedOfferIds)),
    showActionsBar: () => dispatch(showActionsBar()),
  }
}

export default compose(withRequiredLogin, connect(mapStateToProps, mapDispatchToProps))(Offers)
