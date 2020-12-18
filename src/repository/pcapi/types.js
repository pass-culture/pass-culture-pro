import { client } from 'repository/pcapi/pcapiClient'

export default {
  loadTypes: () => {
    return client.get('/types')
  },
}
