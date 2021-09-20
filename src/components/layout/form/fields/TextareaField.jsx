/*
 * @debt directory "Gaël: this file should be migrated within the new directory structure"
 * @debt deprecated "Gaël: deprecated usage of react-final-form"
 * @debt standard "Gaël: migration from classes components to function components"
 */

import classnames from 'classnames'
import PropTypes from 'prop-types'
import React, { PureComponent, Fragment } from 'react'
import Textarea from 'react-autosize-textarea'
import { Field } from 'react-final-form'
import { composeValidators } from 'react-final-form-utils'

import FieldErrors from '../FieldErrors'
import getRequiredValidate from '../utils/getRequiredValidate'

function formatInputValueIfTooLong(value, maxLength) {
  const valueLength = value.length
  const valueIsTooLong = valueLength > maxLength - 1
  return valueIsTooLong ? value.slice(0, maxLength - 1) : value
}

class TextareaField extends PureComponent {
  renderField = ({ input, meta }) => {
    const {
      autoComplete,
      className,
      disabled,
      label,
      maxLength,
      name,
      placeholder,
      readOnly,
      required,
      // see https://github.com/buildo/react-autosize-textarea
      ...ReactAutosizeProps
    } = this.props

    const value = formatInputValueIfTooLong(input.value, maxLength)

    return (
      <div
        className={classnames('field textarea-field', className, {
          'is-label-aligned': label,
          'is-read-only': readOnly,
        })}
      >
        <label
          className={classnames('field-label', { empty: !label })}
          htmlFor={name}
        >
          {label && (
            <span>
              <span>
                {label}
              </span>
              {required && !readOnly && (
                <span className="field-asterisk">
                  *
                </span>
              )}
              {!readOnly && (
                <Fragment>
                  <br />
                  <span className="character-count">
                    {` (${input.value.length} / ${maxLength}) `}
                  </span>
                </Fragment>
              )}
            </span>
          )}
        </label>
        <div className="field-control">
          <div className="field-value flex-columns items-center">
            <span className="field-inner">
              <Textarea
                {...input}
                autoComplete={autoComplete ? 'on' : 'off'}
                className="field-textarea"
                disabled={disabled || readOnly}
                id={name}
                placeholder={readOnly ? '' : placeholder}
                readOnly={readOnly}
                required={!!required}
                value={value}
                {...ReactAutosizeProps}
              />
            </span>
          </div>
          <FieldErrors meta={meta} />
        </div>
      </div>
    )
  }

  render() {
    const { name, required, validate } = this.props

    return (
      <Field
        name={name}
        render={this.renderField}
        validate={composeValidators(validate, getRequiredValidate(required))}
      />
    )
  }
}

TextareaField.defaultProps = {
  autoComplete: false,
  className: '',
  disabled: false,
  label: '',
  maxLength: 1000,
  placeholder: '',
  readOnly: false,
  required: false,
  validate: null,
  validating: false,
}

TextareaField.propTypes = {
  autoComplete: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  maxLength: PropTypes.number,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  validate: PropTypes.func,
  validating: PropTypes.bool,
}

export default TextareaField
