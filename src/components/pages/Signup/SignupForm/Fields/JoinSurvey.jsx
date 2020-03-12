import React from "react"
import { Field } from 'react-final-form'

function JoinSurvey() {
  return (
    <Field
      name="contact"
    >
      {({ input }) => (
        <div className="field field-checkbox">
          <label
            className=""
            htmlFor="user-contact_ok"
          >
            <input
              {...input}
              aria-describedby="user-contact_ok-error"
              className="input"
              id="user-contact_ok"
              type="checkbox"
              value=""
            />
            {'J’accepte d\'être contacté par e-mail pour donner mon avis sur le pass Culture'}
          </label>
        </div>
      )}
    </Field>
  )
}

export default JoinSurvey
