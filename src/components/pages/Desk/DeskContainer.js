import Desk from './Desk'
import { compose } from 'redux'
import { connect } from 'react-redux'

import { requestData } from 'redux-saga-data'
import { SET_LAYOUT_CONFIG, RESET_LAYOUT_CONFIG } from 'store/reducers/app'
import { withRequiredLogin } from 'components/hocs'
import withTracking from 'components/hocs/withTracking'

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

    resetLayoutConfig: () => {
      dispatch({
        type: RESET_LAYOUT_CONFIG
      })
    },

    setLayoutConfig: layoutConfig => {
      dispatch({
        type: SET_LAYOUT_CONFIG,
        layoutConfig,
      })
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
