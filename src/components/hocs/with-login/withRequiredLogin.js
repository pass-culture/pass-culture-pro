import { compose } from 'redux'
import withLogin from 'with-react-redux-login'
import { requestData } from 'redux-thunk-data'

import { getRedirectToSignin } from './helpers'
import withFrenchQueryRouter from '../withFrenchQueryRouter'

const withRequiredLogin = compose(
  withFrenchQueryRouter,
  withLogin({
    handleFail: (state, action, ownProps) => {
      const { history, location } = ownProps
      history.push(getRedirectToSignin({...location}))
    },
    isRequired: true,
    requestData
  })
)

export default withRequiredLogin
