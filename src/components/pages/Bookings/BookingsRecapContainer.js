import { connect } from 'react-redux'

import BookingsRecap from './BookingsRecap'

export function mapStateToProps(state) {
  return {
    currentUser: state.users.currentUser,
  }
}

export default connect(mapStateToProps)(BookingsRecap)
