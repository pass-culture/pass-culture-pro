import { Field } from "react-final-form"
import React from "react"
import isRequired from '../validators/isRequired'
import isValidEmail from '../validators/isValidEmail'
import { composeValidators } from 'react-final-form-utils'

function Email() {
  return (
    <Field
      name="email"
      validate={composeValidators(isRequired, isValidEmail)}
    >
      {({ input, meta }) => {
        return (
          <div className="field field-email with-subtitle">
            <label
              className="label"
              htmlFor="user-email"
            >
              <h3 className="required">
                {'Adresse e-mail'}
              </h3>
              <p>
                {'... pour se connecter et récupérer son mot de passe en cas d’oubli :'}
              </p>
            </label>
            <div className="control">
              <input
                aria-describedby="user-email-error"
                autoComplete="email"
                className="input is-normal"
                id="user-email"
                name="email"
                placeholder="nom@exemple.fr"
                required
                type="email"
                {...input}
              />
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

export default Email
