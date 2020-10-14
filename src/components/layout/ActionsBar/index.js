import { connect } from 'react-redux'

import ActionsBar from './ActionsBar'

export const mapStateToProps = state => {
  return {
    actionsBarVisibility: state.actionsBar.actionsBarVisibility,
  }
}

export default connect(mapStateToProps)(ActionsBar)
