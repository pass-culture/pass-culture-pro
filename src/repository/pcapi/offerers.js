import { client } from 'repository/pcapi/pcapiClient'

export default {
  getValidatedOfferers: () => {
    return client.get('/offerers?validated=true')
  },
}
