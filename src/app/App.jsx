import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { matchPath } from 'react-router'
import { useHistory, useLocation } from 'react-router-dom'

import Spinner from 'components/layout/Spinner'
import { URL_FOR_MAINTENANCE } from 'utils/config'
import routes, { routesWithMain } from 'utils/routes_map'


export const App = props => {
  const { children, currentUser, getCurrentUser, isMaintenanceActivated } = props

  const [isBusy, setIsBusy] = useState(false)

  const history = useHistory()
  const location = useLocation()

  const currentPathname = window.location.pathname
  useEffect(() => {
    const publicRouteList = [...routes, ...routesWithMain].filter(
      route => route.meta && route.meta.public
    )
    const isPublicRoute = !!publicRouteList.find(route => matchPath(currentPathname, route))

    if (!currentUser) {
      setIsBusy(true)
      getCurrentUser()
        .then(() => {
          setIsBusy(false)
        })
        .catch(() => {
          if (!isPublicRoute) {
            const fromUrl = encodeURIComponent(`${location.pathname}${location.search}`)
            history.push(`/connexion?de=${fromUrl}`)
          }
          setIsBusy(false)
        })
    }
  }, [currentUser, currentPathname, getCurrentUser, history, location])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentPathname])

  if (isMaintenanceActivated) {
    history.push(URL_FOR_MAINTENANCE)
    return null
  }

  if (isBusy) {
    return (
      <main className="spinner-container">
        <Spinner />
      </main>
    )
  }

  return children
}

App.defaultProps = {
  currentUser: null,
}

App.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.shape()), PropTypes.shape()])
    .isRequired,
  currentUser: PropTypes.shape(),
  getCurrentUser: PropTypes.func.isRequired,
  isMaintenanceActivated: PropTypes.bool.isRequired,
}

export default App
