import { Field } from "react-final-form"
import React from "react"
import isRequired from '../validators/isRequired'

function PhoneNumber() {
  return (
    <Field
      name="phoneNumber"
      validate={isRequired}
    >
      {({ input, meta }) => {
        return (
          <div className="field field-phoneNumber with-subtitle">
            <label
              className="label"
              htmlFor="user-phoneNumber"
            >
              <h3 className="required">
                {'Téléphone'}
              </h3>
              <p>
                {'... utilisé uniquement par l\'équipe du pass Culture :'}
              </p>
            </label>
            <div className="control">
              <input
                aria-describedby="user-phoneNumber-error"
                autoComplete="email"
                className="input is-normal"
                id="user-phoneNumber"
                name="email"
                placeholder="nom@exemple.fr"
                required
                {...input}
              />
            </div>
            {meta.error && meta.touched && (
              <ul
                className="help is-danger"
                id="user-phoneNumber-error"
              >
                <p
                  className="help is-danger columns"
                  id="user-phoneNumber-error"
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

export default PhoneNumber
