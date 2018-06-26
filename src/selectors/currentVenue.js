import selectCurrentVenues from './currentVenues'
import createSelectVenue from './createVenue'

export default createSelectVenue(
  selectCurrentVenues,
)
