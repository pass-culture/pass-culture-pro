import { connect } from 'react-redux'

import Home from './Home'

export function mapStateToProps(state) {
  return {
    currentUser: state.users.currentUser,
  }
}

export default connect(mapStateToProps)(Home)
