import { Field } from 'react-final-form'
import React, { PureComponent } from 'react'
import isRequired from '../validators/isRequired'
import { composeValidators } from 'react-final-form-utils'
import Tooltip from '../../../../layout/Tooltip'

class Password extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      hiddenPassword: true,
    }
  }

  handleToggleHidden = () => {
    this.setState(state => ({
      hiddenPassword: !state.hiddenPassword,
    }))
  }

  render() {
    const { hiddenPassword } = this.state

    return (
      <Field
        name="password"
        type={hiddenPassword ? 'password' : 'text'}
        validate={composeValidators(isRequired)}
      >
        {({ input, meta }) => {
          return (
            <div className="field field-password with-subtitle">
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
              <div className="input-container">
                <input
                  className="password-input"
                  id="user-password"
                  name="password"
                  placeholder="Mon mot de passe"
                  required
                  type="password"
                  {...input}
                />
                <button
                  className=""
                  onClick={this.handleToggleHidden}
                  type="button"
                >
                  <img
                    alt="ico-eye"
                    src={hiddenPassword ? '/icons/ico-eye close.svg' : '/icons/ico-eye.svg'}
                  />
                  &nbsp;
                </button>
                <Tooltip className="tooltip">
                  <p>
                    {' Votre mot de passe doit contenir au moins :'}
                    <ul>
                      <li>
                        {'- 12 caractères'}
                      </li>
                      <li>
                        {'- une majuscule et une minuscule'}
                      </li>
                      <li>
                        {'- un chiffre'}
                      </li>
                      <li>
                        {
                          '- un caractère spécial (signe de ponctuation, symbole monétaire ou mathématique)'
                        }
                      </li>
                    </ul>
                  </p>
                </Tooltip>
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
      </Field>
    )
  }
}

export default Password
