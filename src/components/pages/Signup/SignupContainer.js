import { connect } from 'react-redux'

import Signup from './Signup'

export function mapStateToProps(state) {
  return {
    currentUser: state.users.currentUser,
  }
}

export default connect(mapStateToProps)(Signup)
