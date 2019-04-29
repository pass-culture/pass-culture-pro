import React, { PureComponent } from 'react'
import { Redirect } from 'react-router-dom'
import { showNotification } from 'pass-culture-shared'
import { requestData } from 'redux-saga-data'

class SignupValidation extends PureComponent {
  buildRequestData = token => {
    return requestData({
      apiPath: `/validate/user/${token}`,
      method: 'PATCH',
      handleSuccess: this.notifySuccess(),
      handleFail: this.notifyFailure(),
    })
  }

  notifyFailure = () => {
    return (state, action) => {
      const {
        payload: { errors },
      } = action

      const { dispatch } = this.props
      dispatch(
        showNotification({
          text: errors.global,
          type: 'danger',
        })
      )
    }
  }

  notifySuccess = () => {
    return () => {
      const { dispatch } = this.props
      dispatch(
        showNotification({
          text:
            'Votre compte a été créé. Vous pouvez vous connecter avec les identifiants que vous avez choisis.',
          type: 'success',
        })
      )
    }
  }

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { token },
      },
    } = this.props

    dispatch(this.buildRequestData(token))
  }

  render() {
    return <Redirect to="/connexion" />
  }
}

export default SignupValidation
