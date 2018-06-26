import { createSelector } from 'reselect'

import selectTypes from './types'

export default selectTypeTag => createSelector(
  selectTypes,
  selectType,
  (types, type) => type && types && types.find(t =>
      t.model === type.model && t.tag === type.tag)
)
