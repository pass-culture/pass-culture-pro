/*
 * @debt directory "Gaël: this file should be migrated within the new directory structure"
 * @debt deprecated "Gaël: deprecated usage of react-final-form"
 */

import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import { Field } from 'react-final-form'

const CheckboxField = ({
  SvgElement,
  className,
  disabled,
  id,
  label,
  labelAligned,
  onChange,
  name,
}) => {
  const handleOnChange = useCallback(
    inputOnChange => {
      return event => {
        if (onChange) {
          onChange(event)
        }
        inputOnChange(event)
      }
    },
    [onChange]
  )

  const renderCheckbox = useCallback(
    inputProps => {
      return (
        <label
          className={cx('checkbox-field', className)}
          htmlFor={id}
        >
          <input
            {...inputProps}
            id={id}
            type="checkbox"
          />
          {SvgElement && <SvgElement aria-hidden />}
          <span className="input-checkbox-label">
            {label}
          </span>
        </label>
      )
    },
    [SvgElement, className, id, label]
  )

  const renderLabelAlignedField = useCallback(
    inputProps => (
      <div className="field is-label-aligned">
        <div className="field-label" />
        <div className="field-control">
          {renderCheckbox(inputProps)}
        </div>
      </div>
    ),
    [renderCheckbox]
  )

  const renderField = useCallback(
    ({ input }) => {
      let inputProps = { ...input }
      inputProps.onChange = handleOnChange(inputProps.onChange)

      if (disabled) {
        inputProps.disabled = disabled
      }

      if (labelAligned) {
        return renderLabelAlignedField(inputProps)
      }

      return renderCheckbox(inputProps)
    },
    [disabled, handleOnChange, labelAligned, renderCheckbox, renderLabelAlignedField]
  )

  return (
    <Field
      name={name}
      render={renderField}
      type="checkbox"
    />
  )
}

CheckboxField.defaultProps = {
  SvgElement: null,
  className: '',
  disabled: false,
  label: '',
  labelAligned: false,
  onChange: null,
}

CheckboxField.propTypes = {
  SvgElement: PropTypes.elementType,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelAligned: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
}

export default CheckboxField
