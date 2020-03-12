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
      backTo,
      children,
      fullscreen,
      header,
      name,
      redBg,
      Tag,
      whiteHeader,
      withLoading,
    } = this.props
    const { loading } = this.state
    const footer = [].concat(children).find(e => e && e.type === 'footer')
    const $content = []
      .concat(children)
      .filter(e => e && e.type !== 'header' && e.type !== 'footer')

    return (
      <Fragment>
        {!fullscreen && <HeaderContainer
          whiteHeader={whiteHeader}
          {...header}
                        />}
        <ReactTooltip
          className="flex-center items-center"
          delayHide={500}
          effect="solid"
          html
        />
        <Tag
          className={classnames({
            page: true,
            [`${name}-page`]: true,
            'with-header': Boolean(header),
            'red-bg': redBg,
            'white-header': whiteHeader,
            container: !fullscreen,
            fullscreen,
            loading,
          })}
        >
          {fullscreen ? (
            <Fragment>
              <NotificationContainer isFullscreen />
              {$content}
            </Fragment>
          ) : (
            <div className="columns is-gapless">
              <div className="page-content column is-10 is-offset-1">
                <NotificationContainer />
                <div
                  className={classnames('after-notification-content', {
                    'with-padding': backTo,
                  })}
                >
                  {backTo && (
                    <NavLink
                      className="back-button has-text-primary has-text-weight-semibold"
                      to={backTo.path}
                    >
                      <Icon svg="ico-back" />
                      {` ${backTo.label}`}
                    </NavLink>
                  )}
                  <div className="main-content">
                    {$content}
                  </div>
                  {withLoading && loading && <Spinner />}
                </div>
              </div>
            </div>
          )}
          {footer}
        </Tag>
        <Modal key="modal" />
      </Fragment>
    )
  }
}

Main.defaultProps = {
  Tag: 'main',
  backTo: null,
  currentUser: null,
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
  currentUser: PropTypes.shape(),
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
