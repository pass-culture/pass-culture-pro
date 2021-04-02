import { SET_USER } from './actions'

export const initialState = {
  currentUser: null,
}

export const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER: {
      return { ...state, currentUser: action.user }
    }
    default:
      return state
  }
}
