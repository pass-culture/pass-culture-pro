import { compose } from 'redux'
import { connect } from 'react-redux'

import { SET_LAYOUT_CONFIG, RESET_LAYOUT_CONFIG } from 'store/reducers/app'
import { withRequiredLogin } from 'components/hocs'

import Home from './Home'

export const mapDispatchToProps = dispatch => ({
  setLayoutConfig: layoutConfig => {
    dispatch({
      type: SET_LAYOUT_CONFIG,
      layoutConfig,
    })
  },

  resetLayoutConfig: () => {
    dispatch({
      type: RESET_LAYOUT_CONFIG
    })
  },
})

export default compose(
  withRequiredLogin,
  connect(null, mapDispatchToProps)
)(Home)

