import get from 'lodash.get'
import { createSelector } from 'reselect'

import selectCurrentEvent from './currentEvent'
import selectFormOccasion from './formOccasion'
import selectCurrentThing from './currentThing'

export default createSelector(
  selectCurrentEvent,
  selectCurrentThing,
  selectFormOccasion,
  (event, thing, formOccasion) => {
    let tag = get(event, 'type')
    if (tag) {
      return {
        model: 'EventType',
        tag
       }
    }
    tag = get(thing, 'type')
    if (tag) {
      return {
        model: 'ThingType',
        tag
      }
    }
    const label = get(formOccasion, 'type')
    if (label) {
      [model, tag] = label.split('.')
      return {
        model,
        tag
      }
    }
  }
)
