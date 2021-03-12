import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

import { showNotification } from 'store/reducers/notificationReducer'
import { isAPISireneAvailable, selectIsFeatureActive } from 'store/selectors/data/featuresSelectors'
import { signIn } from 'store/users/thunks'

import Signin from './Signin'

export const mapStateToProps = state => {
  return {
    currentUser: state.users.currentUser,
    isAccountCreationAvailable: isAPISireneAvailable(state),
    isNewHomepageActive: selectIsFeatureActive(state, 'PRO_HOMEPAGE'),
  }
}

export const mapDispatchToProps = dispatch => ({
  showErrorNotification: errorText =>
    dispatch(
      showNotification({
        type: 'error',
        text: errorText,
      })
    ),
  signIn: (identifier, password) => dispatch(signIn(identifier, password)),
})

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(Signin)
