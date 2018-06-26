import get from 'lodash.get'
import { createSelector } from 'reselect'

export default selectVenues => createSelector(
  state => state.data.occasions,
  state => state.data.searchedOccasions,
  (state, ownProps) => get(ownProps, 'match.params.venueId'),
  selectVenues || (() => null),
  (occasions, searchedOccasions, venueId, venues) => {
    if (!occasions && !searchedOccasions) return

    let filteredOccasions = [...(searchedOccasions || occasions)]

    if (venueId) {
      filteredOccasions = filteredOccasions.filter(o =>
        o.venueId === venueId)
    }
    if (venues) {
      const venueIds = venues.map(v => v.id)
      filteredOccasions = filteredOccasions.filter(o =>
        venueIds.includes(o.venueId))
    }

    return filteredOccasions
      .sort((o1, o2) => o1.dehumanizedId - o2.dehumanizedId)
  }
)
