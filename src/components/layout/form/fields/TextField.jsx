import classnames from 'classnames'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import { composeValidators, createParseNumberValue } from 'react-final-form-utils'

import FieldErrors from '../FieldErrors'
import getRequiredValidate from '../utils/getRequiredValidate'

function getInputValue(inputType, value) {
  const isStringifiedNumber = inputType === 'number' && typeof value === 'string'

  if (isStringifiedNumber) {
    return ''
  }

  return value
}

class TextField extends PureComponent {
  handleRef = _e => {
    this.inputElement = _e
  }

  renderField = ({ input, meta }) => {
    const {
      autoComplete,
      className,
      disabled,
      id,
      innerClassName,
      label,
      min,
      name,
      onBlur,
      placeholder,
      readOnly,
      renderInner,
      renderValue,
      required,
      step,
      title,
      type,
    } = this.props
    const inputType = readOnly ? 'text' : type
    const stepValue = inputType === 'number' ? step : undefined
    const inputValue = getInputValue(inputType, input.value)
    return (
      <div
        className={classnames('field text-field', className, {
          'is-label-aligned': label,
          'is-read-only': readOnly,
        })}
        id={id}
      >
        {label && (
          <label
            className={classnames('field-label')}
            htmlFor={name}
          >
            <span>
              <span>
                {label}
              </span>
              {required && !readOnly && (
                <span className="field-asterisk">
                  {'*'}
                </span>
              )}
            </span>
          </label>
        )}
        <div className="field-control">
          <div className="field-value flex-columns items-center">
            <div className={classnames('field-inner flex-columns items-center', innerClassName)}>
              <input
                id={name}
                {...input}
                autoComplete={autoComplete}
                className={`field-input field-${type}`}
                disabled={disabled || readOnly}
                min={min}
                onBlur={onBlur}
                placeholder={readOnly ? '' : placeholder}
                readOnly={readOnly}
                ref={this.handleRef}
                required={!!required}
                step={stepValue}
                title={title}
                type={inputType}
                value={inputValue}
              />
              {renderInner()}
            </div>
            {renderValue()}
          </div>
          <FieldErrors meta={meta} />
        </div>
        <div />
      </div>
    )
  }

  render() {
    const { format, name, parse, required, type, validate } = this.props

    return (
      <Field
        format={format}
        name={name}
        parse={parse || createParseNumberValue(type)}
        render={this.renderField}
        validate={composeValidators(validate, getRequiredValidate(required, type))}
      />
    )
  }
}

TextField.defaultProps = {
  autoComplete: null,
  className: '',
  disabled: false,
  format: null,
  id: null,
  innerClassName: null,
  label: '',
  onBlur: null,
  parse: null,
  placeholder: '',
  readOnly: false,
  renderInner: function () {
    return null
  },
  renderValue: function () {
    return null
  },
  required: false,
  step: 0.01,
  title: '',
  type: 'text',
  validate: null,
}

TextField.propTypes = {
  autoComplete: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  format: PropTypes.func,
  id: PropTypes.string,
  innerClassName: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  onBlur: PropTypes.func,
  parse: PropTypes.func,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  renderInner: PropTypes.func,
  renderValue: PropTypes.func,
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  step: PropTypes.number,
  title: PropTypes.string,
  type: PropTypes.string,
  validate: PropTypes.func,
}

export default TextField
