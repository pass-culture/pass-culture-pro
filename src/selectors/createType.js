import get from 'lodash.get'
import { createSelector } from 'reselect'

import selectTypes from './types'

export default (selectEvent, selectThing, selectTypeLabel) => createSelector(
  selectTypes,
  selectEvent,
  selectThing,
  selectTypeLabel,
  (types, event, thing, typeLabel) => {
    // type in our state is an object like { model, tag, label }
    // so we need to retrieve from the event or thing.type (which is actually the tag)
    let type
    let tag = get(event, 'type')
    if (tag) {
      type = {
        model: 'EventType',
        tag
       }
    }
    tag = get(thing, 'type')
    if (tag) {
      type = {
        model: 'ThingType',
        tag
      }
    }
    if (typeLabel) {
      const [model, tag] = typeLabel.split('.')
      type = {
        model,
        tag
      }
    }
    // now find the matching ones in types
    return type && types && types.find(t =>
        t.model === type.model && t.tag === type.tag)
  }
)
