import React from 'react'
import { Field } from 'react-final-form'
import FieldErrors from '../../../../../layout/form/FieldErrors'
import formatSiren from './formatSiren'
import { composeValidators } from 'react-final-form-utils'

const required = value => {
  return value ? undefined : 'Ce champs est obligatoire'
}

const mustHaveTheProperLength = value => {
  console.log(value)
  return value.length < 11 ? 'SIREN trop court' : undefined
}

const Siren = () => (
  <Field
    format={formatSiren}
    minLength={11}
    name="siren"
    validate={composeValidators(required, mustHaveTheProperLength)}
  >
    {({ input, meta }) => {
      return (
        <div className='field text-field is-label-aligned'>
          <label
            className='field-label'
            htmlFor="offerer__siren"
          >
            <span>
              {'SIREN : '}
            </span>
            <span className="field-asterisk">
              {'*'}
            </span>
          </label>
          <div className="field-control">
            <div className="field-value flex-columns items-center">
              <div className='field-inner flex-columns items-center'>
                <input
                  className="input is-normal"
                  id="offerer__siren"
                  type="text"
                  {...input}
                />
              </div>
            </div>
            <FieldErrors meta={meta} />
          </div>
        </div>
      )
    }}
  </Field>
)

export default Siren
