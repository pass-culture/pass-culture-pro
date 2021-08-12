import React from 'react'

import VenueSync from './VenueSync'

export default {
  title: 'sandbox/VenueSync',
  component: VenueSync,
}

const Template = args => <VenueSync {...args} />

export const Default = Template.bind({})

const defaultArgs = {}

Default.args = defaultArgs
