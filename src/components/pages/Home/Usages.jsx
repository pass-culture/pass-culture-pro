import React from 'react'

import ExpandableBox from './ExpandableBox/ExpandableBox'
import { steps, STEP_ID_USAGES } from './HomepageBreadcrumb'

const Usages = () => {
  return (
    <>
      <h2
        className="h-section-title"
        id={steps[STEP_ID_USAGES].hash}
      >
        {'Modalités d’usage'}
      </h2>

      <div className="h-section-row">
        <ExpandableBox
          tabIndex={0}
          title="1. Découvrir les offres éligibles pour votre structure"
        >
          {'Hello world'}
        </ExpandableBox>
      </div>

      <div className="h-section-row">
        <ExpandableBox
          tabIndex={-1}
          title="2. Comment créer ou synchroniser une offre physique"
        >
          {'Hello world'}
        </ExpandableBox>
      </div>
    </>
  )
}

export default Usages
