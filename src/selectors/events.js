import get from 'lodash.get'
import { createSelector } from 'reselect'

export default createSelector(
  state => state.data.events,
  state => state.data.searchedEvents,
  (events, searchedEvents) => {
    if (!events && !searchedEvents) return
    const filteredEvents = [...(searchedEvents || events)]
    return filteredEvents
      .sort((o1, o2) => o1.dehumanizedId - o2.dehumanizedId)
  }
)
