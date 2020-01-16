import { showNotification } from 'pass-culture-shared'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { requestData } from 'redux-thunk-data'

import OffererCreation from './OffererCreation'

import { withRequiredLogin } from '../../../hocs'
import withTracking from '../../../hocs/withTracking'

export const mapDispatchToProps = (dispatch) => ({
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
  showNotification: (message, type) => {
    dispatch(
      showNotification({
        text: message,
        type: type,
      })
    )
  },
})

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    trackCreateOfferer: createdOffererId => {
      ownProps.tracking.trackEvent({ action: 'createOfferer', name: createdOffererId })
    },
  }
}

export default compose(
  withTracking('Offerer'),
  withRequiredLogin,
  connect(
    mapDispatchToProps,
    mergeProps
  )
)(OffererCreation)
