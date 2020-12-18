import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { compose } from 'redux'

import SignupValidation from './SignupValidation'

export function mapStateToProps(state) {
  return {
    currentUser: state.users.currentUser,
  }
}

export default compose(withRouter, connect(mapStateToProps))(SignupValidation)
