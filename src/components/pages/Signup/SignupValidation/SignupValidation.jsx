import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Redirect } from 'react-router-dom'
import { requestData } from 'redux-saga-data'

import { redirectLoggedUser } from 'components/router/helpers'
import { showNotificationV1 } from 'store/reducers/notificationReducer'
import { campaignTracker } from 'tracking/mediaCampaignsTracking'

class SignupValidation extends PureComponent {
  constructor(props) {
    super(props)
    const { currentUser, history } = props
    redirectLoggedUser(history, currentUser)
  }

  componentDidMount() {
    campaignTracker.signUpValidation()

    const {
      dispatch,
      match: {
        params: { token },
      },
    } = this.props

    dispatch(this.buildRequestData(token))
  }

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
        showNotificationV1({
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
        showNotificationV1({
          text:
            'Votre compte a été créé. Vous pouvez vous connecter avec les identifiants que vous avez choisis.',
          type: 'success',
        })
      )
    }
  }

  render() {
    return <Redirect to="/connexion" />
  }
}

SignupValidation.propTypes = {
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      token: PropTypes.string.isRequired,
    }),
  }).isRequired,
}

export default SignupValidation
