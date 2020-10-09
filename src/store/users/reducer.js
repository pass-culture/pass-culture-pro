import { SET_CURRENT_USER, RESET_CURRENT_USER } from './actions'

export const initialState = {
  currentUser: null,
}

export const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return { ...state, currentUser: action.currentUser }
    case RESET_CURRENT_USER:
      return { ...state, currentUser: initialState.currentUser }
    default:
      return state
  }
}
