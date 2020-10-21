import classnames from 'classnames'
import PropTypes from 'prop-types'
import get from 'lodash.get'
import React, { PureComponent } from 'react'
import ReactTooltip from 'react-tooltip'

import Icon from '../../layout/Icon'
import { closeNotification } from 'store/reducers/notificationReducer'

class NotificationV1 extends PureComponent {
  componentDidUpdate() {
    const { notification } = this.props
    if (get(notification, 'tooltip')) {
      ReactTooltip.rebuild()
    }
  }

  handleDispatchCloseNotification = () => {
    const { dispatch } = this.props
    dispatch(closeNotification())
  }

  render() {
    const { isFullscreen, notification } = this.props
    const { text, tooltip, type, url, urlLabel } = notification || {}

    let png
    let svg
    if (type === 'success') {
      svg = 'ico-notification-success-green'
    } else if (type === 'warning') {
      png = 'picto-warning-solid-orange-S'
    } else if (type === 'info') {
      png = 'picto-info-solid-blue-S'
    } else if (type === 'tip') {
      svg = 'picto-tip'
    } else {
      png = 'picto-error-solid-red-S'
    }

    if (!notification) {
      return <div />
    }

    return (
      <div
        className={classnames(`notification is-${type || 'info'}`, {
          fullscreen: isFullscreen,
        })}
      >
        <div
          className={classnames('is-flex fullscreen', {
            'small-padding': !isFullscreen,
          })}
        >
          <div className="notification-description">
            <Icon
              png={png}
              svg={svg}
            />
            <span>
              {text}
            </span>
          </div>
          <div className="notification-action-links">
            {url && (
              <a
                className="close"
                href={url}
              >
                {urlLabel}
              </a>
            )}
            {tooltip ? (
              <span
                className={classnames({
                  'has-text-weight-semibold tooltip small-padding is-2': !isFullscreen,
                })}
                data-place={tooltip.place}
                data-tip={tooltip.tip}
                data-type={tooltip.type}
              >
                {tooltip.children}
              </span>
            ) : (
              <button
                className="close"
                onClick={this.handleDispatchCloseNotification}
                type="button"
              >
                {url ? 'Fermer' : 'OK'}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }
}

NotificationV1.defaultProps = {
  isFullscreen: false,
  notification: null,
}

NotificationV1.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isFullscreen: PropTypes.bool,
  notification: PropTypes.shape(),
}

export default NotificationV1
