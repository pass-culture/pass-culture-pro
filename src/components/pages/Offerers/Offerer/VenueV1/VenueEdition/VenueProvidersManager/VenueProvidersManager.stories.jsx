import React from 'react'

import VenueProvidersManager from './VenueProvidersManager'

export default {
  title: 'components/VenueProvidersManager',
  component: VenueProvidersManager,
}

const mockApiLoadProviders = async () => [
  {
    enabledForPro: true,
    id: 'BE',
    isActive: true,
    localClass: 'TiteLiveThings',
    name: 'TiteLive (Epagine / Place des libraires.com)',
  },
]

const venueProvider = {
  lastSyncDate: '2021-01-01',
  nOffers: 12,
  provider: {
    enabledForPro: true,
    id: 'BE',
    isActive: true,
    localClass: 'TiteLiveThings',
    name: 'TiteLive (Epagine / Place des libraires.com)',
  },
  venueIdAtOfferProvider: 'test IdAtOfferProvider',
}
const mockApiCreateVenueProvider = async () => venueProvider

const Template = args => (
  <main>
    <div className="venue-providers-manager section">
      <VenueProvidersManager {...args} />
    </div>
  </main>
)

export const Default = Template.bind({})

const defaultArgs = {
  notifyError: () => true,
  notifySuccess: () => true,
  loadProviders: mockApiLoadProviders,
  loadVenueProviders: async () => [],
  postVenueProvider: mockApiCreateVenueProvider,
  venue: {
    id: 'ABCD',
    managingOffererId: 'DCBA',
    siret: '123456798',
  },
}

Default.args = defaultArgs

export const WithVenueProvider = Template.bind({})
WithVenueProvider.args = {
  ...defaultArgs,
  loadVenueProviders: async () => [venueProvider],
}
