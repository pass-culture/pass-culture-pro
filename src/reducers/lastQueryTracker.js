import moment from 'moment'
// INITIAL STATE
const initialState = {}

// REDUCER
const track = (state = initialState, action) => {
  if (/SUCCESS_DATA_(DELETE|GET|POST|PUT|PATCH)_(.*)/.test(action.type) && action.method.toUpperCase() === 'GET') {
    return Object.assign({}, state, {
        [action.path]: moment()
      })
  }
  return state
}

// default
export default track
