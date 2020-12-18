import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { compose } from 'redux'

import { maintenanceSelector } from 'store/selectors/maintenanceSelector'
import { getCurrentUser } from 'store/users/thunks'

import { App } from './App'

export function mapStateToProps(state) {
  return {
    currentUser: state.users.currentUser,
    modalOpen: state.modal.isActive,
    isMaintenanceActivated: maintenanceSelector(state),
  }
}

export const mapDispatchToProps = {
  getCurrentUser,
}

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(App)
