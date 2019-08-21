import classnames from 'classnames'
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'
import { withRouter } from 'react-router'

import MatomoContainer from './components/matomo/MatomoContainer'

const App = ({ modalOpen, children, user }) => {
  const currentUser = user
  return (
    <React.Fragment>
      <div className={classnames('app', { 'modal-open': modalOpen })}>
        {children}
      </div>
      <MatomoContainer user={currentUser} />
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  return {
    modalOpen: state.modal.isActive,
    user: state.user,
  }
}

App.defaultProps = {
  user: {},
}

App.propTypes = {
  children: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  modalOpen: PropTypes.bool.isRequired,
  user: PropTypes.shape,
}

export default compose(
  withRouter,
  connect(mapStateToProps)
)(App)
