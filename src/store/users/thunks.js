import * as pcapi from 'repository/pcapi/pcapi'

import { setCurrentUser } from './actions'

export function getCurrentUser() {
  return dispatch => {
    return pcapi.fetchCurrentUser().then(async currentUser => {
      dispatch(setCurrentUser(currentUser))
    })
  }
}

export function resetPasswordRequest(email) {
  return pcapi.resetPasswordRequest(email)
}

export function changePassword(newPassword, token) {
  return pcapi.resetPasswordRequest(newPassword, token)
}
