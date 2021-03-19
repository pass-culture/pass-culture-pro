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

export const signIn = (identifier, password) => {
  return dispatch => {
    return pcapi.signIn(identifier, password).then(rawUser => {
      const user = rawUser ? rawUser : null
      return dispatch(setCurrentUser(user))
    })
  }
}

export const setPassword = (identifier, password) => {
  return () => {
    return pcapi.setPassword(identifier, password).then(() => Promise.resolve())
  }
}

export const setPasswordRequest = ({ email, token }) => {
  return () => {
    return pcapi.setPassword(email, token).then(() => Promise.resolve())
  }
}
