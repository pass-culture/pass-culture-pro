import { fetchFromApiWithCredentials } from 'utils/fetch'

import { ALL_OFFERERS } from '../components/pages/Offers/Offers/_constants'

export const fetchAllVenuesByProUser = offererId => {
  const apiUrl =
    offererId && offererId !== ALL_OFFERERS ? `/venues?offererId=${offererId}` : '/venues'

  return fetchFromApiWithCredentials(apiUrl)
    .then(response => response.venues)
    .catch(() => [])
}

export const computeVenueDisplayName = venue => {
  if (venue.isVirtual) {
    return `${venue.offererName} - Offre numérique`
  } else {
    return venue.publicName || venue.name
  }
}

export const formatAndOrderVenues = venues => {
  const sortAlphabeticallyByDisplayName = (a, b) => {
    let aDisplayName = a.displayName.toLowerCase()
    let bDisplayName = b.displayName.toLowerCase()
    return aDisplayName < bDisplayName ? -1 : aDisplayName > bDisplayName ? 1 : 0
  }

  return venues
    .map(venue => {
      const displayName = computeVenueDisplayName(venue)
      return { id: venue.id, displayName }
    })
    .sort(sortAlphabeticallyByDisplayName)
}
