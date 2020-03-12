import { showNotification } from 'pass-culture-shared'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { requestData } from 'redux-thunk-data'

import OffererCreation from './OffererCreation'
import { makeOffererComponentValueObject } from './OffererFactory'

import { withRequiredLogin } from '../../hocs'
import withTracking from '../../hocs/withTracking'
import { offererNormalizer } from '../../../utils/normalizers'
import { selectOffererById } from '../../../selectors/data/offerersSelectors'
import { selectPhysicalVenuesByOffererId } from '../../../selectors/data/venuesSelectors'
import { selectUserOffererByOffererIdAndUserIdAndRightsType } from '../../../selectors/data/userOfferersSelectors'

export const mapStateToProps = (state, ownProps) => {
  const { currentUser, match } = ownProps
  const {
    params: { offererId },
  } = match
  const { id: currentUserId } = currentUser

  return {
    offerer: makeOffererComponentValueObject(
      selectUserOffererByOffererIdAndUserIdAndRightsType,
      selectOffererById,
      offererId,
      currentUserId,
      state
    ),
    venues: selectPhysicalVenuesByOffererId(state, offererId),
  }
}

export const mapDispatchToProps = (dispatch, ownProps) => {
  const {
    match: {
      params: { offererId },
    } = {}
  } = ownProps
  return {
    createNewOfferer: (payload, onHandleFail) => {
      dispatch(
        requestData({
          apiPath: `/offerers`,
          method: 'POST',
          body: payload,
          handleFail: onHandleFail
        })
      )
    },
    getOfferer: (handleFail, handleSuccess) => {
      dispatch(
        requestData({
          apiPath: `/offerers/${offererId}`,
          handleSuccess,
          handleFail,
          normalizer: offererNormalizer,
        })
      )
    },
    getUserOfferers: () => {
      dispatch(
        requestData({
          apiPath: `/userOfferers/${offererId}`,
        })
      )
    },
    showNotification: (message, type) => {
      dispatch(
        showNotification({
          text: message,
          type: type,
        })
      )
    },
  }
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    trackCreateOfferer: createdOffererId => {
      ownProps.tracking.trackEvent({ action: 'createOfferer', name: createdOffererId })
    },
    trackModifyOfferer: offererId => {
      ownProps.tracking.trackEvent({ action: 'modifyOfferer', name: offererId })
    },
  }
}

export default compose(
  withTracking('Offerer'),
  withRequiredLogin,
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )
)(OffererCreation)
