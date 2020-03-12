import React from "react"
import { Field } from 'react-final-form'

function ConditionGeneralUtilisation() {
  return (
    <Field
      name="cgu_ok"
    >
      {({ input }) => (
        <div
          className="field field-checkbox cgu-field"
        >
          <label
            className="required"
            htmlFor="user-cgu_ok"
          >
            <input
              {...input}
              aria-describedby="user-cgu_ok-error"
              className="input"
              id="user-cgu_ok"

              required=""
              type="checkbox"
              value=""
            />
            {'J’ai lu et j’accepte les '}
            <a
              href="https://docs.passculture.app/textes-normatifs"
              id="accept-cgu-link"
              rel="noopener noreferrer"
              target="_blank"
            >
              {'Conditions Générales d’Utilisation'}
            </a>
          </label>
        </div>
      )}
    </Field>
  )
}

export default ConditionGeneralUtilisation
