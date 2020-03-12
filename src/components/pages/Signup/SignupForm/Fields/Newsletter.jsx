import React from 'react'
import { Field } from 'react-final-form'

function Newsletter() {
  return (
    <Field
      name="newsletter"
    >
      {({input}) => (
        <div className="field field-checkbox">
          <label
            className=""
            htmlFor="user-newsletter_ok"
          >
            <input
              {...input}
              aria-describedby="user-newsletter_ok-error"
              className="input"
              id="user-newsletter_ok"
              type="checkbox"
              value=""
            />
            {'Je souhaite recevoir les actualités du pass Culture'}
          </label>
        </div>
      )}
    </Field>
  )
}

export default Newsletter
