import createDecorator from 'final-form-calculate'
import PropTypes from 'prop-types'
import React from 'react'

import { ReactComponent as AudioDisabilitySvg } from 'icons/audio-disability.svg'
import { ReactComponent as MentalDisabilitySvg } from 'icons/mental-disability.svg'
import { ReactComponent as MotorDisabilitySvg } from 'icons/motor-disability.svg'
import { ReactComponent as VisualDisabilitySvg } from 'icons/visual-disability.svg'
import { CheckboxField } from 'ui-kit'

const checkNoDisabilityCompliant = (_value, allValues) => {
  const hasAccesibility = [
    allValues.audioDisabilityCompliant,
    allValues.mentalDisabilityCompliant,
    allValues.motorDisabilityCompliant,
    allValues.visualDisabilityCompliant,
  ].includes(true)
  if (!hasAccesibility) {
    return true
  }
  return false
}

export const autoFillNoDisabilityCompliantDecorator = createDecorator(
  {
    field: 'noDisabilityCompliant',
    updates: {
      audioDisabilityCompliant: (value, allValues) => {
        if (value) return false
        return allValues.audioDisabilityCompliant
      },
      mentalDisabilityCompliant: (value, allValues) => {
        if (value) return false
        return allValues.mentalDisabilityCompliant
      },
      motorDisabilityCompliant: (value, allValues) => {
        if (value) return false
        return allValues.motorDisabilityCompliant
      },
      visualDisabilityCompliant: (value, allValues) => {
        if (value) return false
        return allValues.visualDisabilityCompliant
      },
    },
  },
  {
    field: 'audioDisabilityCompliant',
    updates: {
      noDisabilityCompliant: checkNoDisabilityCompliant,
    },
  },
  {
    field: 'mentalDisabilityCompliant',
    updates: {
      noDisabilityCompliant: checkNoDisabilityCompliant,
    },
  },
  {
    field: 'motorDisabilityCompliant',
    updates: {
      noDisabilityCompliant: checkNoDisabilityCompliant,
    },
  },
  {
    field: 'visualDisabilityCompliant',
    updates: {
      noDisabilityCompliant: checkNoDisabilityCompliant,
    },
  }
)

const AccesibilityFields = ({ readOnly }) => {
  return (
    <div className="section bank-information vp-content-section">
      <div className="main-list-title title-actions-container">
        <h2 className="main-list-title-text">
          Accessiblités
        </h2>
      </div>
      <p className="bi-subtitle">
        Les modalités d’accessibilité s’appliqueront par défaut à la création de vos offres. Vous
        pourrez modifier cette information à l’échelle de l’offre.
      </p>

      <p className="bi-subtitle">
        Cette offre est-elle accessible aux publics en situation de handicaps :
      </p>

      <CheckboxField
        SvgElement={VisualDisabilitySvg}
        className="field field-checkbox"
        disabled={readOnly}
        id="visualDisabilityCompliant"
        label="Visuel"
        name="visualDisabilityCompliant"
      />
      <CheckboxField
        SvgElement={MentalDisabilitySvg}
        className="field field-checkbox"
        disabled={readOnly}
        id="mentalDisabilityCompliant"
        label="Psychique ou cognitif"
        name="mentalDisabilityCompliant"
      />
      <CheckboxField
        SvgElement={MotorDisabilitySvg}
        className="field field-checkbox"
        disabled={readOnly}
        id="motorDisabilityCompliant"
        label="Moteur"
        name="motorDisabilityCompliant"
      />
      <CheckboxField
        SvgElement={AudioDisabilitySvg}
        className="field field-checkbox"
        disabled={readOnly}
        id="audioDisabilityCompliant"
        label="Auditif"
        name="audioDisabilityCompliant"
      />
      <CheckboxField
        className="field field-checkbox"
        disabled={readOnly}
        id="noDisabilityCompliant"
        label="Non accessible"
        name="noDisabilityCompliant"
      />

      {/* {Boolean(getErrorMessage('disabilityCompliant')) && (
        <InputError>
          Vous devez cocher l’une des options ci-dessus
        </InputError>
      )} */}
    </div>
  )
}

AccesibilityFields.defaultProps = {
  readOnly: false,
}

AccesibilityFields.propTypes = {
  readOnly: PropTypes.bool,
}

export default AccesibilityFields
