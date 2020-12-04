import get from 'lodash.get'
import PropTypes from 'prop-types'
import React from 'react'

import { resetForm } from 'store/reducers/form'
import { showNotificationV1 } from 'store/reducers/notificationReducer'

class Main extends React.PureComponent {
  componentDidMount() {
    const { currentUser } = this.props
    if (currentUser) {
      this.handleDataRequest()
    }
  }

  componentDidUpdate(prevProps) {
    const { currentUser, location } = this.props
    const { search } = location
    const userChanged = !prevProps.currentUser && currentUser // User just loaded
    const searchChanged = search !== prevProps.location.search

    if (userChanged || searchChanged) {
      this.handleDataRequest()
    }
  }

  componentWillUnmount() {
    this.unblock && this.unblock()
    const { dispatch } = this.props
    dispatch(resetForm())
  }

  handleDataSuccess = () => {}

  handleDataRequest = () => {
    const { handleDataRequest } = this.props
    if (handleDataRequest) {
      handleDataRequest(this.handleDataSuccess, this.handleDataFail)
    }
  }

  handleDataFail = (state, action) => {
    const { dispatch, payload } = action
    dispatch(
      showNotificationV1({
        type: 'danger',
        text: get(payload, 'errors.0.global') || 'Erreur de chargement',
      })
    )
  }

  render() {
    return null
  }
}

Main.defaultProps = {
  handleDataRequest: null,
}

Main.propTypes = {
  currentUser: PropTypes.shape().isRequired,
  dispatch: PropTypes.func.isRequired,
  handleDataRequest: PropTypes.func,
  location: PropTypes.shape().isRequired,
}

export default Main
