import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { compose } from 'redux'

import { showNotification } from 'store/reducers/notificationReducer'

import { SetPassword } from './SetPassword'

export const mapStateToProps = state => {
  return {
    currentUser: state.users.currentUser,
  }
}

export const mapDispatchToProps = dispatch => ({
  showNotification: (type, text) =>
    dispatch(
      showNotification({
        type: type,
        text: text,
      })
    ),
})

export default compose(connect(mapStateToProps, mapDispatchToProps))(withRouter(SetPassword))
