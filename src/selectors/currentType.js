import { createSelector } from 'reselect'

import createSelectType from './createType'
import selectCurrentTypeTag from './currentTypeTag'

export default createSelectType(selectCurrentTypeTag)
