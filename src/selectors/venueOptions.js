import { createSelector } from 'reselect'

import selectCurrentVenues from './currentVenues'

export default createSelector(
  selectCurrentVenues,
  venues => venues && venues.map(v =>
      ({ label: v.name, value: v.id }))
)
