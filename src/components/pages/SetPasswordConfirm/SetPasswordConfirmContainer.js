import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { compose } from 'redux'

import { SetPasswordConfirm } from './SetPasswordConfirm'

export const mapStateToProps = state => {
  return {
    currentUser: state.users.currentUser,
  }
}

export default compose(connect(mapStateToProps))(withRouter(SetPasswordConfirm))
