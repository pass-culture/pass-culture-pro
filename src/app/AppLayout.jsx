import classnames from 'classnames'
import PropTypes from 'prop-types'
import React, { Fragment, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'

import HeaderContainer from 'components/layout/Header/HeaderContainer'
import Icon from 'components/layout/Icon'
import Modal from 'components/layout/Modal'
import NotificationV1Container from 'components/layout/NotificationV1/NotificationV1Container'
import NotificationV2Container from 'components/layout/NotificationV2/NotificationV2Container'

import PortalProvider from './PortalProvider'

const AppLayout = props => {
  const { children, layoutConfig } = props

  const portalContainerRef = useRef()

  const defaultConfig = {
    backTo: null,
    fullscreen: false,
    header: {},
    pageName: 'page',
    whiteHeader: false,
  }

  const { backTo, fullscreen, header, pageName, whiteHeader } = {
    ...defaultConfig,
    ...layoutConfig,
  }

  return (
    <PortalProvider value={portalContainerRef.current}>
      <div>
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
          })}
        >
          {fullscreen ? (
            <Fragment>
              <NotificationV1Container isFullscreen />
              {children}
            </Fragment>
          ) : (
            <div className="columns is-gapless">
              <div className="page-content column is-10 is-offset-1">
                <NotificationV1Container />
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
                </div>
              </div>
            </div>
          )}
          <NotificationV2Container />
          <Modal key="modal" />
          <div ref={portalContainerRef} />
        </main>
      </div>
    </PortalProvider>
  )
}

AppLayout.defaultProps = {
  layoutConfig: {},
}

AppLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.shape()), PropTypes.shape()])
    .isRequired,
  layoutConfig: PropTypes.shape(),
}

export default AppLayout
