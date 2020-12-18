import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { compose } from 'redux'

import Matomo from './Matomo'

export const mapStateToProps = state => {
  const user = state.users.currentUser
  let userId = user ? user.id : 'ANONYMOUS'

  return {
    userId,
  }
}

export default compose(withRouter, connect(mapStateToProps))(Matomo)
