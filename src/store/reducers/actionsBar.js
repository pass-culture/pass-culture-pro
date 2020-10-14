export const SET_ACTIONS_BAR_VISIBILITY = 'SET_ACTIONS_BAR_VISIBILITY'

export const initialState = {
  actionsBarVisibility: false,
}

const actionsBarReducers = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACTIONS_BAR_VISIBILITY:
      return { ...state, actionsBarVisibility: action.actionsBarVisibility }
    default:
      return state
  }
}

export default actionsBarReducers
