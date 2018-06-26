import get from 'lodash.get'
import { createSelector } from 'reselect'

import selectFormOccasion from './formOccasion'
import selectCurrentType from './currentType'

export default createSelector(
  selectCurrentType,
  selectFormOccasion,
  (type, formOccasion) =>
    type || get(formOccasion, 'type')
)
