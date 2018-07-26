import React from 'react'
import classnames from 'classnames'

import BasicInput from './BasicInput'

const CheckboxInput = props => {

  const onInputChange = e => {
    e.preventDefault()
    this.setState({'checkedValue': !props.value})
    props.onChange(e.target.checked)
  }

  return (
      <BasicInput {...props} type='checkbox' className='input' disabled={props.readOnly} onChange={onInputChange} checked={this.state.checkedValue} />
    )

}

export default CheckboxInput
