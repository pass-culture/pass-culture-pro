import omit from 'lodash.omit'

import { ALL_OFFERS, ALL_VENUES } from 'components/pages/Offers/_constants'
import { client } from '../pcapi'

export async function loadFilteredOffers(filters = {}) {
  const omitedFields = Object.keys(filters).filter(field => {
    const omitedValues = {
      nameSearchValue: ALL_OFFERS,
      selectedVenueId: ALL_VENUES,
    }
    if (filters[field]) {
      return !!omitedValues[field] && filters[field] === omitedValues[field]
    }
    return !filters[field]
  })
  const queryString = new URLSearchParams(omit(filters, omitedFields)).toString()
  return client.get(`/offers?${queryString}`)
}

export async function activateOffers(ids) {
  return client.patch('/offers/active-status', { ids, isActive: true })
}

export async function deactivateOffers(ids) {
  return client.patch('/offers/active-status', { ids, isActive: false })
}
