import { connect } from 'react-redux'
import { compose } from 'redux'

import { showNotification } from 'store/reducers/notificationReducer'
import { selectIsFeatureActive } from 'store/selectors/data/featuresSelectors'
import { searchSelector } from 'store/selectors/search'
import { setPassword, setPasswordRequest } from 'store/users/thunks'
import { IS_DEV } from 'utils/config'
import { getReCaptchaToken } from 'utils/recaptcha'

import LostPassword from './LostPassword'

export const mapStateToProps = (state, ownProps) => {
  const userErrors = state.errors.user || []
  const {
    location: { search },
  } = ownProps
  const { change, envoye, token } = searchSelector(state, search)
  return {
    change,
    currentUser: state.users.currentUser,
    errors: userErrors,
    envoye,
    isNewHomepageActive: selectIsFeatureActive(state, 'PRO_HOMEPAGE'),
    token,
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
  submitResetPasswordRequest: emailValue => {
    if (!IS_DEV) {
      return getReCaptchaToken('resetPassword').then(token =>
        dispatch(setPasswordRequest({ email: emailValue, token: token }))
      )
    } else {
      return dispatch(setPasswordRequest({ email: emailValue, token: 'test_token' }))
    }
  },
  submitResetPassword: (newPassword, token) => dispatch(setPassword({ newPassword, token })),
})

export default compose(connect(mapStateToProps, mapDispatchToProps))(LostPassword)
