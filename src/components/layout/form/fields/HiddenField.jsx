import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Field } from 'react-final-form'

import FieldErrors from '../FieldErrors'

class HiddenField extends PureComponent {
  renderField = ({ input, meta }) => (
    <div>
      <input
        {...input}
        type="hidden"
      />
      <FieldErrors meta={meta} />
    </div>
  )

  render() {
    const { name, validator } = this.props

    return (
      <Field
        name={name}
        render={this.renderField}
        validate={validator}
      />
    )
  }
}

HiddenField.defaultProps = {
  validator: null,
}

HiddenField.propTypes = {
  name: PropTypes.string.isRequired,
  validator: PropTypes.func,
}

export default HiddenField
