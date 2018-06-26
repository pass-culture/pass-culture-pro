import get from 'lodash.get'
import { createSelector } from 'reselect'

import selectOfferers from './offerers'
import selectFormOccasion from './formOccasion'

export default createSelector(
  selectOfferers,
  selectFormOccasion,
  (state, ownProps) => get(ownProps, 'occasion.offererId'),
  (offerers, formOccasion, offererId) => {
    return get(formOccasion, 'offererId') ||
      offererId ||
      (get(offerers, 'length') === 1 && get(offerers, '0.id'))
  }
)
