import React from 'react'
import { Route, Switch, useRouteMatch, useParams } from 'react-router-dom'

import NotFound from 'components/pages/Errors/NotFound/NotFound'
import Titles from 'components/layout/Titles/Titles'

import Breadcrumb, {
  STEP_ID_INFORMATIONS,
  STEP_ID_MANAGEMENT,
} from './Breadcrumb'
import VenueCreation from './VenueCreation/VenueCreation'
import VenueEdition from './VenueEdition/VenueEdition'


const mapPathToStep = {
  creation: STEP_ID_INFORMATIONS,
  edition: STEP_ID_INFORMATIONS,
  gestion: STEP_ID_MANAGEMENT,
}

const VenueLayout = () => {
  const match = useRouteMatch()
  const routeParams = useParams()
  // TODO move all layout to creation or edition cause we don't have venueId in route params yet here.
  console.log('routeParams', routeParams)

  const pageTitle = 'TODO page title'

  const stepName = location.pathname.match(/[a-z]+$/)
  const activeStep = stepName ? mapPathToStep[stepName[0]] : null

  const venueId = ''

  return (
    <div className="venue-page">
      <Titles
        // action={offerHeader}
        title={pageTitle}
      />

      <Breadcrumb
        activeStep={activeStep}
        baseUrl={match.url}
        venueid={venueId}
      />

      <Switch>
        <Route
          exact
          path={`${match.path}/creation`}
        >
          <VenueCreation />
        </Route>
        <Route
          exact
          path={`${match.path}/temporaire/creation`}
        >
          <VenueCreation isTemporary />
        </Route>
        <Route
          exact
          path={`${match.path}/:venueId([A-Z0-9]+)/edition`}
        >
          <VenueEdition />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </div>
  )
}

export default VenueLayout
