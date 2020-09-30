import classnames from 'classnames'
import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { NavLink, Route, Switch } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'

import { Icon, Modal, Spinner } from 'pass-culture-shared'

import HeaderContainer from '../components/layout/Header/HeaderContainer'
import NotificationContainer from '../components/layout/Notification/NotificationContainer'
import MatomoContainer from '../components/matomo/MatomoContainer'
import RedirectToMaintenance from './RedirectToMaintenance'


export const App = (props) => {
  const {
    layoutConfig,
    modalOpen,
    isMaintenanceActivated,
    children
  } = props

  const {
    backTo,
    fullscreen,
    header,
    pageName,
    whiteHeader,
    withLoading,
    loading,
  } = layoutConfig

  if (isMaintenanceActivated) {
    return <RedirectToMaintenance />
  }

  return (
    <div className={classnames('app', { 'modal-open': modalOpen })}>
      {!fullscreen && (
        <HeaderContainer
          whiteHeader={whiteHeader}
          {...header}
        />
      )}
      <ReactTooltip
        className="flex-center items-center"
        delayHide={500}
        effect="solid"
        html
      />

      <main
        className={classnames({
          page: true,
          [`${pageName}-page`]: true,
          'with-header': Boolean(header),
          'white-header': whiteHeader,
          container: !fullscreen,
          fullscreen,
          loading,
        })}
      >
        {fullscreen ? (
          <Fragment>
            <NotificationContainer isFullscreen />
            {children}
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
                {children}
                </div>
                {withLoading && loading && <Spinner />}
              </div>
            </div>
          </div>
        )}
      </main>

      <Modal key="modal" />
      <MatomoContainer />
    </div>
  )
}

App.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.shape()), PropTypes.shape()])
    .isRequired,
  isMaintenanceActivated: PropTypes.bool.isRequired,
  modalOpen: PropTypes.bool.isRequired,
}
