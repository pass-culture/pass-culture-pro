import { connect } from 'react-redux'

import { maintenanceSelector } from 'store/selectors/maintenanceSelector'
import { getCurrentUser } from 'store/users/thunks'

import App from './App'

export function mapStateToProps(state) {
  return {
    currentUser: state.users.currentUser,
    isMaintenanceActivated: maintenanceSelector(state),
  }
}

export const mapDispatchToProps = {
  getCurrentUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
