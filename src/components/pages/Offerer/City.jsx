import React from 'react'
import { Field } from 'react-final-form'
import classnames from 'classnames'

const City = () => (
  <Field
    name="city"
  >
    {({ input }) => {
      return (
        <div className={classnames('field text-field', 'is-label-aligned')}>
          <label
            className={classnames('field-label')}
            htmlFor="city"
          >
            <span>
              {'Ville : '}
            </span>
          </label>
          <div className="field-control">
            <div className="field-value flex-columns items-center">
              <div className={classnames('field-inner flex-columns items-center')}>
                <input
                  className="input is-normal"
                  id="city"
                  readOnly
                  type="text"
                  {...input}
                />
              </div>
            </div>
          </div>
        </div>
      )
    }}
  </Field>
)

export default City
