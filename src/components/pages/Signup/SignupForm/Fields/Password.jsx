import { Field } from "react-final-form"
import React from "react"
import isRequired from '../validators/isRequired'
import { composeValidators } from 'react-final-form-utils'
import classnames from 'classnames'

function Password() {
  return (
    <Field
      name="password"
      validate={composeValidators(isRequired)}
    >
      {({ input, meta }) => {
        return (
          <div className="field has-addons field-password with-subtitle">
            <label
              className="label"
              htmlFor="user-password"
            >
              <h3 className="required">
                {'Mot de passe'}
              </h3>
              <p>
                {'... pour se connecter'}
              </p>
            </label>
            <div className="control is-expanded">
              <input
                aria-describedby="user-email-error"
                className="input is-normal"
                id="user-password"
                name="password"
                placeholder="Mon mot de passe"
                required
                {...input}
              />
            </div>
            <div className="control with-info">
              <button
                className="button is-rounded"
                /*onClick={this.toggleHidden}*/
                type="button"
              >
                <img alt="ico-eye" src="/icons/ico-eye.svg" />
                &nbsp;
              </button>
            </div>
            {meta.error && meta.touched && (
              <ul
                className="help is-danger"
                id="user-email-error"
              >
                <p
                  className="help is-danger columns"
                  id="user-email-error"
                >
                  <span className="column is-narrow is-vcentered">
                    <img
                      alt="Attention"
                      src="/icons/picto-warning.svg"
                    />
                  </span>
                  <span className="column is-paddingless is-narrow">
                    {meta.error}
                  </span>
                </p>
              </ul>
            )}
          </div>
        )
      }}
    </Field>)
}

export default Password

/*
import classnames from 'classnames'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import BasicInput from './BasicInput'
import { Icon } from '../Icon'

class PasswordInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isPasswordHidden: true,
    }
  }

  toggleHidden = e => {
    e.preventDefault()
    this.setState(previousState => ({
      isPasswordHidden: !previousState.isPasswordHidden,
    }))
  }

  onInputChange = event => {
    const { onChange: fieldOnChange } = this.props
    event.persist()
    fieldOnChange(event.target.value, { event })
  }

  render() {
    const { noPasswordToggler, info, ...otherProps } = this.props
    const { isPasswordHidden } = this.state

    const input = (
      <BasicInput
        {...otherProps}
        type={isPasswordHidden ? 'password' : 'text'}
        onChange={this.onInputChange}
      />
    )
    if (noPasswordToggler) return input
    return (
      <div className="field has-addons field-password">
        <div className="control is-expanded">{input}</div>
        <div className={classnames("control", "with-info")}>
          <button
            className="button is-rounded"
            onClick={this.toggleHidden}
            type="button"
          >
            <Icon
              svg={isPasswordHidden ? 'ico-eye close' : 'ico-eye'}
            />
            &nbsp;
          </button>
        </div>
        {info && (
          <span
            className='column is-2'
            data-place='bottom'
            data-tip={info}
            data-type='info'
          >
            <Icon svg="picto-info" />
          </span>
        )}
      </div>
    )
  }
}

PasswordInput.defaultProps = {
  info: null,
  noPasswordToggler: false
}

PasswordInput.propTypes = {
  info: PropTypes.string,
  noPasswordToggler: PropTypes.bool
}

export default PasswordInput
*/
