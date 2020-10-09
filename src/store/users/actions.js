export const SET_CURRENT_USER = 'SET_CURRENT_USER'
export const RESET_CURRENT_USER = 'RESET_CURRENT_USER'

export function setCurrentUser(currentUser) {
  return {
    type: SET_CURRENT_USER,
    currentUser,
  }
}

export function resetCurrentUser() {
  return {
    type: RESET_CURRENT_USER,
  }
}
