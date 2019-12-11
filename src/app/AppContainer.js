import { compose } from 'redux'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { App } from './App'
import selectIsMaintenanceActivated from "./selectIsMaintenanceActivated";

function mapStateToProps(state) {
  return {
    modalOpen: state.modal.isActive,
    isMaintenanceActivated: selectIsMaintenanceActivated(state),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps)
)(App)
