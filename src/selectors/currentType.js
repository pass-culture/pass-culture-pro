import { createSelector } from 'reselect'

import selectCurrentEvent from './currentEvent'
import selectCurrentThing from './currentThing'
import createSelectType from './createType'
import selectCurrentTypeLabel from './currentTypeLabel'

export default createSelectType(
  selectCurrentEvent,
  selectCurrentThing,
  selectCurrentTypeLabel
)
