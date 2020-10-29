import {
  ALL_OFFERS,
  ALL_OFFERERS,
  ALL_VENUES,
  DEFAULT_PAGE,
} from 'components/pages/Offers/_constants'
import { client } from 'repository/pcapi/pcapiClient'

export const loadOffer = async offerId => {
  return client.get(`/offers/${offerId}`)
}

export const loadFilteredOffers = async ({
  nameSearchValue = ALL_OFFERS,
  offererId = ALL_OFFERERS,
  selectedVenueId = ALL_VENUES,
  statusFilters,
  page = DEFAULT_PAGE,
}) => {
  const queryParams = []
  if (nameSearchValue !== ALL_OFFERS) {
    queryParams.push(`name=${nameSearchValue}`)
  }
  if (offererId !== ALL_OFFERERS) {
    queryParams.push(`offererId=${offererId}`)
  }
  if (selectedVenueId !== ALL_VENUES) {
    queryParams.push(`venueId=${selectedVenueId}`)
  }
  if (page) {
    queryParams.push(`page=${page}`)
  }
  if (statusFilters && statusFilters.active === false) {
    queryParams.push(`active=false`)
  }
  if (statusFilters && statusFilters.inactive === false) {
    queryParams.push(`inactive=false`)
  }
  if (statusFilters && statusFilters.soldOut === false) {
    queryParams.push(`sold-out=false`)
  }
  if (statusFilters && statusFilters.expired === false) {
    queryParams.push(`expired=false`)
  }

  return client.get(`/offers?${queryParams.join('&')}`)
}

export const setAllVenueOffersActivate = async venueId => {
  return client.put(`/venues/${venueId}/offers/activate`)
}

export const setAllVenueOffersInactivate = async venueId => {
  return client.put(`/venues/${venueId}/offers/deactivate`)
}
