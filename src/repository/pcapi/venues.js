import { client } from 'repository/pcapi/pcapiClient'

export default {
  getVenuesForOfferer: offererId => {
    if (offererId) {
      return client.get(`/venues?offererId=${offererId}`)
    } else {
      return client.get('/venues')
    }
  },
}
