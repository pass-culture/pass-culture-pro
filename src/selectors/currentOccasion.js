import { createSelector } from 'reselect'

import { modelToPath } from '../utils/translate'

import selectOccasions from './occasions'

export default createSelector(
  selectOccasions,
  (state, ownProps) => ownProps.match.params.occasionPath,
  (state, ownProps) => ownProps.match.params.occasionId,
  (occasions, occasionPath, occasionId) => {
    console.log('ON RESELECTE', occasionPath, occasionId, occasions)
    if (!occasions) { return }
    const currentOccasion = occasions.find(o =>
        occasionPath === modelToPath(o.modelName) &&
        o.id === occasionId
    )
    return currentOccasion
  }
)
