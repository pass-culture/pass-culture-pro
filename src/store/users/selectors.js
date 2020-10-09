import { createSelector } from 'reselect'

export const selectCurrentUser = state => {
  return state.users.currentUser
}

export const selectIsUserAdmin = createSelector(selectCurrentUser, currentUser => {
  if (!currentUser) {
    return false
  }
  return currentUser.isAdmin
})
