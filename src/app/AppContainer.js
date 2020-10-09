import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { compose } from 'redux'

import { maintenanceSelector } from 'store/selectors/maintenanceSelector'
import { getCurrentUser } from 'store/users/thunks'

import { App } from './App'

export function mapStateToProps(state) {
  return {
    modalOpen: state.modal.isActive,
    isMaintenanceActivated: maintenanceSelector(state),
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    getCurrentUser: () => dispatch(getCurrentUser()),
  }
}

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(App)
