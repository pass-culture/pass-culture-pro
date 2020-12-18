import { connect } from 'react-redux'

import { selectCurrentUser } from 'store/selectors/data/usersSelectors'

import Home from './Home'

export function mapStateToProps(state) {
  return {
    currentUser: state.users.currentUser,
  }
}

export default connect(mapStateToProps)(Home)
