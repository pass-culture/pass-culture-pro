import get from 'lodash.get'
import { createSelector } from 'reselect'

import selectFormOccasion from './formOccasion'

export default createSelector(
  selectFormOccasion,
  formOccasion => get(formOccasion, 'type')
)
