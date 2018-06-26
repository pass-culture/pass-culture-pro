import get from 'lodash.get'
import { createSelector } from 'reselect'

import { NEW } from '../utils/config'

export default createSelector(
  (state, ownProps) => get(state, 'form.occasionsById'),
  (state, ownProps) => get(ownProps, 'occasion.id'),
  (occasionsById, occasionId, ) =>
    get(occasionsById, occasionId || NEW)
)
