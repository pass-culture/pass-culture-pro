import { client } from 'repository/pcapi/pcapiClient'

export default {
  getURLErrors: url => {
    return client.post('/offers/thumbnail-url-validation', { url: url })
  },
}
