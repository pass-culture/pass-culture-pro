import { Field } from "react-final-form"
import React from "react"
import isRequired from '../validators/isRequired'
import { composeValidators } from 'react-final-form-utils'

function Password() {
  return (
    <Field
      name="password"
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
            <div className="control">
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
