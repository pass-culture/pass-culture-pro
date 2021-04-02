import { connect } from 'react-redux'

import Styleguide from './Styleguide'

export function mapStateToProps(state) {
  return {
    currentUser: state.users.currentUser,
  }
}

export default connect(mapStateToProps)(Styleguide)
