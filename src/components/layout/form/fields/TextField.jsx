import classnames from 'classnames'
import React, { Component } from 'react'
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

class TextField extends Component {
  componentDidMount() {
    const { type } = this.props

    if (type === 'number') {
      this.hasEnteredPlusOrMinusAfterNumbers()
    }
  }

  componentWillUnmount() {
    if (this.keypressListener) {
      this.inputElement.removeEventListener(this.keypressListener)
    }
  }

  hasEnteredPlusOrMinusAfterNumbers = () => {
    this.keypressListener = this.inputElement.addEventListener('keypress', event => {
      const hasEnteredEKeys = event.which === 69 || event.which === 101
      const eventWhichForMinusKey = 45
      const eventWhichForPlusKey = 43
      const hasEnteredPlusOrMinusAfterNumbers =
        this.inputElement.value && (event.keyCode === eventWhichForMinusKey || event.keyCode === eventWhichForPlusKey)

      if (hasEnteredEKeys || hasEnteredPlusOrMinusAfterNumbers) {
        event.preventDefault()
      }
    })
  }

  renderField = ({ input, meta }) => {
    const {
      className,
      disabled,
      id,
      innerClassName,
      label,
      min,
      name,
      placeholder,
      readOnly,
      renderInner,
      renderValue,
      required,
      type,
      ...inputProps
    } = this.props
    const inputType = readOnly ? 'text' : type
    const inputValue = getInputValue(inputType, input.value)

    return (
      <div
        className={classnames('field text-field', className, {
          'is-label-aligned': label,
          'is-read-only': readOnly,
        })}
        id={id}
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
              {required && !readOnly &&
              <span className="field-asterisk">
                {'*'}
              </span>}
            </span>
          )}
        </label>
        <div className="field-control">
          <div className="field-value flex-columns items-center">
            <div className={classnames('field-inner flex-columns items-center', innerClassName)}>
              <input
                id={name}
                {...input}
                {...inputProps}
                className={`field-input field-${type}`}
                disabled={disabled || readOnly}
                min={min}
                placeholder={readOnly ? '' : placeholder}
                readOnly={readOnly}
                ref={_e => {
                  this.inputElement = _e
                }}
                required={!!required}
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
        validate={composeValidators(validate, getRequiredValidate(required))}
      />
    )
  }
}

TextField.defaultProps = {
  className: '',
  disabled: false,
  format: null,
  id: null,
  innerClassName: null,
  label: '',
  parse: null,
  placeholder: '',
  readOnly: false,
  renderInner: () => null,
  renderValue: () => null,
  required: false,
  type: 'text',
  validate: null,
}

TextField.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  format: PropTypes.func,
  id: PropTypes.string,
  innerClassName: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  parse: PropTypes.func,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  renderInner: PropTypes.func,
  renderValue: PropTypes.func,
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  type: PropTypes.string,
  validate: PropTypes.func,
}

export default TextField
