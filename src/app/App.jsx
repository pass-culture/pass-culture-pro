import classnames from 'classnames'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'

import routes from 'utils/routes_map'

import RedirectToMaintenance from './RedirectToMaintenance'

export const App = ({ modalOpen, isMaintenanceActivated, children, getCurrentUser }) => {
  useEffect(() => {
    const publicPathList = routes.map(route => {
      if (route.meta && route.meta.public) {
        return route.path
      }
    })
    if (publicPathList.includes(window.location.path)) {
      return
    }

    getCurrentUser()
    // TODO (rlecellier) : if fail => redirect to login
  }, [getCurrentUser])

  if (isMaintenanceActivated) {
    return <RedirectToMaintenance />
  } else return (
    <div className={classnames('app', { 'modal-open': modalOpen })}>
      {children}
    </div>
  )
}

App.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.shape()), PropTypes.shape()])
    .isRequired,
  getCurrentUser: PropTypes.func.isRequired,
  isMaintenanceActivated: PropTypes.bool.isRequired,
  modalOpen: PropTypes.bool.isRequired,
}
