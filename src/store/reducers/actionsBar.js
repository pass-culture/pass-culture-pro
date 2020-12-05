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

/**
 * @deprecated Action bar no longer needs to take its state from redux :
 * It state can directly be controller at render
 */
export const hideActionsBar = () => {
  return {
    type: SET_ACTIONS_BAR_VISIBILITY,
    actionsBarVisibility: false,
  }
}
export const showActionsBar = () => {
  return {
    type: SET_ACTIONS_BAR_VISIBILITY,
    actionsBarVisibility: true,
  }
}

export default actionsBarReducers
