import classnames from 'classnames'
import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'

import HeaderContainer from 'components/layout/Header/HeaderContainer'
import Icon from 'components/layout/Icon'
import NotificationV2Container from 'components/layout/NotificationV2/NotificationV2Container'
import TutorialDialogContainer from 'components/layout/Tutorial/TutorialDialogContainer'

const AppLayout = props => {
  const { children, layoutConfig } = props

  const defaultConfig = {
    backTo: null,
    fullscreen: false,
    header: {},
    pageName: 'Accueil',
  }

  const { backTo, fullscreen, header, pageName } = {
    ...defaultConfig,
    ...layoutConfig,
  }

  return (
    <>
      {!fullscreen && <HeaderContainer {...header} />}

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
          container: !fullscreen,
          fullscreen,
        })}
      >
        {fullscreen ? (
          children
        ) : (
          <div className="page-content">
            <div
              className={classnames('after-notification-content', {
                'with-padding': backTo,
              })}
            >
              {backTo && (
                <NavLink
                  className="back-button has-text-primary"
                  to={backTo.path}
                >
                  <Icon svg="ico-back" />
                  {` ${backTo.label}`}
                </NavLink>
              )}
              {children}
            </div>
          </div>
        )}
        <TutorialDialogContainer />
        <NotificationV2Container />
      </main>
    </>
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
