import * as pcapi from 'repository/pcapi'
import { formatAndOrderVenues } from 'repository/venuesService'

type GetOfferrerVenues = () => Promise<{venues: SelectOptions, requestStatus: 'error' | 'success'}>

const getOfferrerVenues: GetOfferrerVenues = async () => {
  try {
    const offerrerVenues = await pcapi.getVenuesForOfferer()
    return {
      requestStatus: 'success',
      venues: formatAndOrderVenues(offerrerVenues)
    }
  } catch(e) {
    return {
      requestStatus: 'error',
      venues: []
    }
  }
}

export default getOfferrerVenues
