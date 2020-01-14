import React from 'react'
import { Field } from 'react-final-form'
import classnames from 'classnames'

const PostalCode = () => (
  <Field
    name="postalCode"
  >
    {({ input }) => {
      return (
        <div className={classnames('field text-field', 'is-label-aligned')}>
          <label
            className={classnames('field-label')}
            htmlFor="postalcode"
          >
            <span>
              {'Code postal : '}
            </span>
          </label>
          <div className="field-control">
            <div className="field-value flex-columns items-center">
              <div className={classnames('field-inner flex-columns items-center')}>
                <input
                  className="input is-normal"
                  id="postalcode"
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

export default PostalCode
