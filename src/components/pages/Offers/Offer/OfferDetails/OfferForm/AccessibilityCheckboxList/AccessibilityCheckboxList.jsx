import PropTypes from 'prop-types'
import React, { useCallback } from 'react'

import { CheckboxInput } from 'components/layout/inputs/CheckboxInput/CheckboxInput'
import InputError from 'components/layout/inputs/Errors/InputError'
import { ReactComponent as AudioDisabilitySvg } from 'icons/audio-disability.svg'
import { ReactComponent as MentalDisabilitySvg } from 'icons/mental-disability.svg'
import { ReactComponent as MotorDisabilitySvg } from 'icons/motor-disability.svg'
import { ReactComponent as VisualDisabilitySvg } from 'icons/visual-disability.svg'


export const getAccessibilityValues = values => {
  const accessibility = {
    audioDisabilityCompliant: values.audioDisabilityCompliant,
    mentalDisabilityCompliant: values.mentalDisabilityCompliant,
    motorDisabilityCompliant: values.motorDisabilityCompliant,
    visualDisabilityCompliant: values.visualDisabilityCompliant,
  }
  return Object.keys(accessibility).reduce((acc, fieldName) => {
    let fieldValue = accessibility[fieldName]
    if (fieldValue === undefined) {
      fieldValue = null
    } 
    return { ...acc, [fieldName]: fieldValue }
  }, {})
}

const checkHasNoDisabilityCompliance = values => {
  const disabilityCompliantValues = Object.values(getAccessibilityValues(values))
  const unknownDisabilityCompliance = disabilityCompliantValues.includes(null)
  const hasDisabilityCompliance = disabilityCompliantValues.includes(true)
  if (hasDisabilityCompliance || unknownDisabilityCompliance) {
    return false
  }

  return true
}

export const getAccessibilityInitialValues = ({ offer = null, venue = null }) => {
  const emptyAccessibility = {
    audioDisabilityCompliant: null,
    mentalDisabilityCompliant: null,
    motorDisabilityCompliant: null,
    visualDisabilityCompliant: null,
  }

  let accessibility = offer ? getAccessibilityValues(offer) : { ...emptyAccessibility }
  if (Object.values(accessibility).includes(null)) {
    accessibility = venue ? getAccessibilityValues(venue) : { ...emptyAccessibility }
  }
  accessibility.noDisabilityCompliant = checkHasNoDisabilityCompliance(accessibility)
  accessibility = Object.keys(accessibility).reduce((acc, fieldName) => ({ ...acc, [fieldName]: !!accessibility[fieldName] }), {})
  return accessibility
}

const autoFillValues = function (formValues, field, value) {
  let noDisabilityCompliant = formValues.noDisabilityCompliant
  let disabilityCompliantValues = getAccessibilityValues(formValues)
  // normalize null value as false
  disabilityCompliantValues = Object.keys(disabilityCompliantValues).reduce(
    (acc, field) => ({ ...acc, [field]: !!disabilityCompliantValues[field] }),
    {}
  )

  if (field === 'noDisabilityCompliant') {
    noDisabilityCompliant = value

    if (noDisabilityCompliant) {
      disabilityCompliantValues = Object.keys(disabilityCompliantValues).reduce(
        (acc, field) => ({ ...acc, [field]: false }),
        {}
      )
    } else if (!Object.values(disabilityCompliantValues).includes(true)) {
      noDisabilityCompliant = true
    }
  } else {
    disabilityCompliantValues[field] = value
    noDisabilityCompliant = checkHasNoDisabilityCompliance(disabilityCompliantValues)
  }

  return { ...disabilityCompliantValues, noDisabilityCompliant }
}

const AccessibilityCheckboxList = ({ onChange, formValues, isInError, isDisabled, readOnly }) => {
  const handleChange = useCallback(
    event => {
      onChange(autoFillValues(formValues, event.target.name, event.target.checked))
    },
    [formValues, onChange]
  )

  return (
    <>
      <CheckboxInput
        SvgElement={VisualDisabilitySvg}
        checked={formValues.visualDisabilityCompliant}
        disabled={readOnly}
        isInError={isInError}
        isLabelDisable={isDisabled}
        label="Visuel"
        name="visualDisabilityCompliant"
        onChange={handleChange}
      />
      <CheckboxInput
        SvgElement={MentalDisabilitySvg}
        checked={formValues.mentalDisabilityCompliant}
        disabled={readOnly}
        isInError={isInError}
        isLabelDisable={isDisabled}
        label="Psychique ou cognitif"
        name="mentalDisabilityCompliant"
        onChange={handleChange}
      />
      <CheckboxInput
        SvgElement={MotorDisabilitySvg}
        checked={formValues.motorDisabilityCompliant}
        disabled={readOnly}
        isInError={isInError}
        isLabelDisable={isDisabled}
        label="Moteur"
        name="motorDisabilityCompliant"
        onChange={handleChange}
      />
      <CheckboxInput
        SvgElement={AudioDisabilitySvg}
        checked={formValues.audioDisabilityCompliant}
        disabled={readOnly}
        isInError={isInError}
        isLabelDisable={isDisabled}
        label="Auditif"
        name="audioDisabilityCompliant"
        onChange={handleChange}
      />
      <CheckboxInput
        checked={formValues.noDisabilityCompliant}
        disabled={readOnly}
        isInError={isInError}
        isLabelDisable={isDisabled}
        label="Non accessible"
        name="noDisabilityCompliant"
        onChange={handleChange}
      />

      {isInError && (
        <InputError>
          Vous devez cocher l’une des options ci-dessus
        </InputError>
      )}
    </>
  )
}

AccessibilityCheckboxList.defaultProps = {
  isDisabled: false,
  isInError: false,
  readOnly: false,
}

AccessibilityCheckboxList.propTypes = {
  formValues: PropTypes.shape().isRequired,
  isDisabled: PropTypes.bool,
  isInError: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
}

export default AccessibilityCheckboxList
