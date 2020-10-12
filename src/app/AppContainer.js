import { compose } from 'redux'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { App } from './AppRenamed.jsx'
import { maintenanceSelector } from 'store/selectors/maintenanceSelector'

export function mapStateToProps(state) {
  return {
    modalOpen: state.modal.isActive,
    isMaintenanceActivated: maintenanceSelector(state),
  }
}

export default compose(withRouter, connect(mapStateToProps))(App)
