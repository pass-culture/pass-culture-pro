import classnames from 'classnames'
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'
import { Redirect, withRouter } from 'react-router'
import { URL_FOR_MAINTENANCE } from "./utils/config"

export const App = ({ modalOpen, isMaintenanceActivated, children }) => {
  console.log({URL_FOR_MAINTENANCE})
  if (isMaintenanceActivated) {
    return (<Redirect to={URL_FOR_MAINTENANCE} />)
  } else
    return (
      <div className={classnames('app', { 'modal-open': modalOpen })}>
        {children}
      </div>
    )
}


function mapStateToProps(state) {
  return {
    modalOpen: state.modal.isActive,
  }
}

App.propTypes = {
  children: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  modalOpen: PropTypes.bool.isRequired,
}

export default compose(
  withRouter,
  connect(mapStateToProps)
)(App)
