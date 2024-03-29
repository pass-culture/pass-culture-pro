import { action } from '@storybook/addon-actions'
import { Formik } from 'formik'
import React from 'react'

import Checkbox from './Checkbox'

export default {
  title: 'ui-kit/Checkbox',
  component: Checkbox,
}

const Template = () => (
  <Formik
    initialValues={{ accessibility: null }}
    onSubmit={action('onSubmit')}
  >
    {({ getFieldProps }) => {
      return (
        <Checkbox
          {...getFieldProps('accessibility')}
          label="Accessible"
          name='accessibility'
          value="accessible"
        />
      )}}
  </Formik>
)

export const Default = Template.bind({})
