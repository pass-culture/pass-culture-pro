import classnames from 'classnames'
import get from 'lodash.get'
import { Icon, Modal, resetForm, showNotification, Spinner } from 'pass-culture-shared'
import PropTypes from 'prop-types'
import React, { PureComponent, Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'

import HeaderContainer from '../Header/HeaderContainer'
import NotificationContainer from '../Notification/NotificationContainer'

class Main extends PureComponent {
  constructor() {
    super()
    this.state = {
      loading: false,
    }
  }

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

  handleDataSuccess = () => {
    this.setState({
      loading: false,
    })
  }

  handleDataRequest = () => {
    const { handleDataRequest } = this.props
    if (handleDataRequest) {
      // possibility of the handleDataRequest to return
      // false in order to not trigger the loading
      this.setState({
        loading: true,
      })
      handleDataRequest(this.handleDataSuccess, this.handleDataFail)
    }
  }

  handleDataFail = (state, action) => {
    const { dispatch, payload } = action
    this.setState({ loading: false })

    dispatch(
      showNotification({
        type: 'danger',
        text: get(payload, 'errors.0.global') || 'Erreur de chargement',
      })
    )
  }

  render() {
    const {
      children,
    } = this.props
    const { loading } = this.state
    const $content = []
      .concat(children)
      .filter(e => e && e.type !== 'header' && e.type !== 'footer')

    return (<Fragment>{$content}</Fragment>)
  }
}

Main.defaultProps = {
  Tag: 'main',
  backTo: null,
  fullscreen: false,
  handleDataRequest: null,
  header: {},
  redBg: null,
  whiteHeader: null,
  withLoading: null,
}

Main.propTypes = {
  Tag: PropTypes.string,
  backTo: PropTypes.shape(),
  children: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  currentUser: PropTypes.shape().isRequired,
  dispatch: PropTypes.func.isRequired,
  fullscreen: PropTypes.bool,
  handleDataRequest: PropTypes.func,
  header: PropTypes.shape(),
  location: PropTypes.shape().isRequired,
  name: PropTypes.string.isRequired,
  redBg: PropTypes.string,
  whiteHeader: PropTypes.string,
  withLoading: PropTypes.bool,
}

export default Main
