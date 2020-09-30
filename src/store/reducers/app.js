export const SET_LAYOUT_CONFIG = 'SET_LAYOUT_CONFIG'
export const RESET_LAYOUT_CONFIG = 'RESET_LAYOUT_CONFIG'

const initialState = {
  layoutConfig: {
    loading: false,
    backTo: null,
    fullscreen: false,
    header: {},
    pageName: 'Acceuil',
    redBg: false,
    whiteHeader: true,
    withLoading: false, // FIXME (rlecellier): this is never used !
  },
}

const app = (state = initialState, action) => {
  switch (action.type) {
    case SET_LAYOUT_CONFIG:
      return Object.assign({}, state, {
        layoutConfig: { ...initialState.layoutConfig, ...action.layoutConfig },
      })
    case RESET_LAYOUT_CONFIG:
      return Object.assign({}, state, {
        layoutConfig: { ...initialState.layoutConfig },
      })
    default:
      return state
  }
}

export default app
