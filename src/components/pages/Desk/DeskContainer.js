import { connect } from 'react-redux'
import { compose } from 'redux'

import { withTracking } from 'components/hocs'
import { fetchFromApiWithCredentials } from 'utils/fetch'

import Desk from './Desk'

export function mapStateToProps(state) {
  return {
    currentUser: state.users.currentUser,
  }
}

export const mapDispatchToProps = dispatch => ({
  getBooking: code =>
    fetchFromApiWithCredentials(`/v2/bookings/token/${code}`).then(booking => {
      dispatch({
        type: 'GET_DESK_BOOKINGS',
        payload: booking,
      })

      return booking
    }),
  validateBooking: code => fetchFromApiWithCredentials(`/v2/bookings/use/token/${code}`, 'PATCH'),
  invalidateBooking: code =>
    fetchFromApiWithCredentials(`/v2/bookings/keep/token/${code}`, 'PATCH'),
})

export const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  trackValidateBookingSuccess: code => {
    ownProps.tracking.trackEvent({ action: 'validateBooking', name: code })
  },
})

export default compose(
  withTracking('Desk'),
  connect(mapStateToProps, mapDispatchToProps, mergeProps)
)(Desk)
