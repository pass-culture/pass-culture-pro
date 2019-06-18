import { compose } from 'redux'
import withLogin from 'with-react-redux-login'

import { getRedirectToSignin } from './helpers'
import withFrenchQueryRouter from '../withFrenchQueryRouter'

export const withRedirectToSigninWhenNotAuthenticated = compose(
  withFrenchQueryRouter,
  withLogin({
    handleFail: (state, action, { history, location }) =>
      history.push(getRedirectToSignin(location)),
    isRequired: true,
  })
)

export default withRedirectToSigninWhenNotAuthenticated
