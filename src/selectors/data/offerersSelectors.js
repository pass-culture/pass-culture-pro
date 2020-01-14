import createCachedSelector from 're-reselect'
import get from 'lodash.get'

export const selectOfferers = state => get(state, 'data.offerers', [])

export const selectOffererById = createCachedSelector(
  selectOfferers,
  (state, offererId) => offererId,
  (offerers, offererId) => offerers.find(offerer => offerer.id === offererId)
)((state, offererId = '') => offererId)
