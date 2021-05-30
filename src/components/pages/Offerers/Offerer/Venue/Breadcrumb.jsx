import PropTypes from 'prop-types'
import React from 'react'

import Breadcrumb, { STYLE_TYPE_TAB, STYLE_TYPE_DEFAULT } from 'components/layout/Breadcrumb'

export const STEP_ID_INFORMATIONS = 'informations'
export const STEP_ID_MANAGEMENT = 'management'


const VenueBreadcrumb = ({ activeStep, venueId, baseUrl }) => {
  let steps = []
  const isCreatingVenue = venueId === null

  if (!isCreatingVenue) {
    steps = [
      {
        id: STEP_ID_INFORMATIONS,
        label: "Type de lieu",
        url: `${baseUrl}/edition`,
      },
      {
        id: STEP_ID_MANAGEMENT,
        label: 'Gestion',
        url: `${baseUrl}/gestion`,
      },
    ]
  } else {
    steps = [
      {
        id: STEP_ID_INFORMATIONS,
        label: "Type de lieu",
      },
      {
        id: STEP_ID_MANAGEMENT,
        label: 'Gestion',
      },
    ]
  }

  return (
    <Breadcrumb
      activeStep={activeStep}
      steps={steps}
      styleType={isCreatingVenue ? STYLE_TYPE_DEFAULT : STYLE_TYPE_TAB}
    />
  )
}

VenueBreadcrumb.defaultProps = {
  venueId: null,
}

VenueBreadcrumb.propTypes = {
  activeStep: PropTypes.string.isRequired,
  baseUrl: PropTypes.string.isRequired,
  venueId: PropTypes.string,
}

export default VenueBreadcrumb
