import { action } from '@storybook/addon-actions'
import { Formik } from 'formik'
import React from 'react'

import DurationPicker from './DurationPicker'

export default {
  title: 'ui-kit/DurationPicker',
  component: DurationPicker,
}

const Template = () => (
  <Formik
    initialValues={{ duration: null }}
    onSubmit={action('onSubmit')}
  >
    {({ values, setFieldValue }) => {
      return (
        <DurationPicker
          name='duration'
          onChange={(value: number | null) => setFieldValue('duration', value)}
          value={values.duration}
        />
      )}}
  </Formik>
)

export const Default = Template.bind({})

