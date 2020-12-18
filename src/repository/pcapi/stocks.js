import { client } from 'repository/pcapi/pcapiClient'

export default {
  updateStock: stock => {
    const { stockId, ...stockWithoutId } = stock
    return client.patch(`/stocks/${stockId}`, stockWithoutId)
  },

  deleteStock: stockId => {
    return client.delete(`/stocks/${stockId}`)
  },

  createStock: stock => {
    return client.post('/stocks', stock)
  },
}
