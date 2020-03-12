import Desk from './Desk'
import { compose } from 'redux'
import { connect } from 'react-redux'

import { withRequiredLogin } from '../../hocs'
import { requestData } from 'redux-thunk-data'
import withTracking from '../../hocs/withTracking'

export const mapDispatchToProps = dispatch => {
  return {
    getBookingFromCode: (code, handleSuccess, handleFail) => {
      dispatch(
        requestData({
          apiPath: `/bookings/token/${code}`,
          handleSuccess: handleSuccess,
          handleFail: handleFail,
          stateKey: 'deskBookings',
          method: 'GET',
        })
      )
    },
    validateBooking: (code, handleSuccess, handleFail) => {
      dispatch(
        requestData({
          apiPath: `/bookings/token/${code}`,
          handleFail: handleFail,
          handleSuccess: handleSuccess,
          stateKey: 'deskBookings',
          method: 'PATCH',
        })
      )
    },
  }
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...stateProps,
    ...dispatchProps,
    trackValidateBookingSuccess: code => {
      ownProps.tracking.trackEvent({ action: 'validateBooking', name: code })
    },
  }
}

export default compose(
  withTracking('Desk'),
  withRequiredLogin,
  connect(
    null,
    mapDispatchToProps,
    mergeProps
  )
)(Desk)
