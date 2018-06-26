import get from 'lodash.get'
import { createSelector } from 'reselect'

export default selectOccasions => createSelector(
  selectOccasions,
  (state, ownProps) => get(ownProps, 'match.params.occasionId'),
  (state, ownProps) => get(ownProps, 'occasion.id'),
  (occasions, paramsOccasionId, propsOccasionId) => {
    if (!occasions) {
      return
    }
    return occasions.find(o => o.id === (paramsOccasionId || propsOccasionId))
  }
)
