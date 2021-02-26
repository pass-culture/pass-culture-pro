import * as pcapi from 'repository/pcapi/pcapi'

import { setCurrentUser } from './actions'

export const getCurrentUser = () => {
  return dispatch => {
    return pcapi.getCurrentUser().then(rawUser => {
      const user = rawUser ? rawUser : null
      dispatch(setCurrentUser(user))
    })
  }
}
