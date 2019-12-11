import { compose } from 'redux'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { App } from './App'
import { isMaintenanceActivated } from '../selectors/isMaintenanceActivated'

export function mapStateToProps(state) {
  return {
    modalOpen: state.modal.isActive,
    isMaintenanceActivated: isMaintenanceActivated(state),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps)
)(App)
