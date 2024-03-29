import { action } from '@storybook/addon-actions'
import { Story } from '@storybook/react'
import { Formik } from 'formik'
import React from 'react'

import TextInput from './TextInput'

export default {
  title: 'ui-kit/TextInput',
  component: TextInput,
}

const Template: Story<{label?: string}> = ({ label }) => (
  <Formik
    initialValues={{ email: '' }}
    onSubmit={action('onSubmit')}
  >
    {({ getFieldProps }) => (
      <TextInput
        {...getFieldProps('email')}
        label={label}
      />
    )}
  </Formik>
)

export const WithoutLabel = Template.bind({})
export const WithLabel = Template.bind({})
WithLabel.args = { label: 'Email' }
