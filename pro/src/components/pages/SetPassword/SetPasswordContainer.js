/*
* @debt standard "Gaël: prefer hooks for routers (https://reactrouter.com/web/api/Hooks)"
* @debt standard "Gaël: prefer useSelector hook vs connect for redux (https://react-redux.js.org/api/hooks)"
*/

import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { compose } from 'redux'

import { showNotification } from 'store/reducers/notificationReducer'
import { selectCurrentUser } from 'store/selectors/data/usersSelectors'

import { SetPassword } from './SetPassword'

export const mapStateToProps = state => {
  return {
    currentUser: selectCurrentUser(state),
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
