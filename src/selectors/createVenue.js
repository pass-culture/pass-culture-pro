import get from 'lodash.get'
import { createSelector } from 'reselect'


export default selectVenues => createSelector(
  selectVenues,
  (state, ownProps) => get(ownProps, 'match.params.venueId'),
  (state, ownProps) => get(ownProps, 'occasion.venueId'),
  (venues, paramVenueId, occasionVenueId) => {
    if (!venues) {
      return
    }
    return venues.find(v =>
      v.id === (paramVenueId || occasionVenueId))
  }
)
