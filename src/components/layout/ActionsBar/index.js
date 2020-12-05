import { connect } from 'react-redux'

import ActionsBar from './ActionsBar'

/**
 * @todo ActionBar no longer needs to take its state from redux :
 * It state can directly be controller at render
 */
export const mapStateToProps = state => {
  return {
    isVisible: state.actionsBar.actionsBarVisibility,
  }
}

export default connect(mapStateToProps)(ActionsBar)
