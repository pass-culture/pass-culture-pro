import React from 'react'
import { Field } from 'react-final-form'
import classnames from 'classnames'
import FieldErrors from '../../../layout/form/FieldErrors'
import formatSiren from './formatSiren'

const required = value => {
  return value ? undefined : 'Ce champs est obligatoire'
}

const Siren = () => (
  <Field
    format={formatSiren}
    maxLength={11}
    name="siren"
    validate={required}
  >
    {({ input, meta }) => {
      return (
        <div className={classnames('field text-field', 'is-label-aligned')}>
          <label
            className={classnames('field-label')}
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
              <div className={classnames('field-inner flex-columns items-center')}>
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
