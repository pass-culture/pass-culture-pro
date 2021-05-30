import PropTypes from 'prop-types'
import React from 'react'
import { useRouteMatch } from 'react-router-dom'

import Titles from 'components/layout/Titles/Titles'

import Breadcrumb, {
  STEP_ID_INFORMATIONS,
  STEP_ID_MANAGEMENT,
} from '../Breadcrumb'

const mapPathToStep = {
  creation: STEP_ID_INFORMATIONS,
  edition: STEP_ID_INFORMATIONS,
  gestion: STEP_ID_MANAGEMENT,
}

const VenueCreation = ({ isTemporary }) => {


  return (
    <>
      hello i'm creation form
    </>
  )
}

VenueCreation.defaultProps = {
  isTemporary: false,
}

VenueCreation.propTypes = {
  isTemporary: PropTypes.bool,
}

export default VenueCreation
