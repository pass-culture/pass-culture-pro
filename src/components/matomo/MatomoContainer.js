import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { compose } from 'redux'

import { selectCurrentUser } from 'store/users/selectors'

import Matomo from './Matomo'

export const mapStateToProps = state => {
  const user = selectCurrentUser(state)
  let userId = user ? user.id : 'ANONYMOUS'

  return {
    userId,
  }
}

export default compose(withRouter, connect(mapStateToProps))(Matomo)
