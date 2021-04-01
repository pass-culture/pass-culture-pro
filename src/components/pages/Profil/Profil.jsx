import classnames from 'classnames'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { requestData } from 'redux-saga-data'

import AppLayout from 'app/AppLayout'
import TextInput from 'components/layout/inputs/TextInput/TextInput'
import Titles from 'components/layout/Titles/Titles'
import { showNotificationV2 } from 'store/reducers/notificationReducer'

import { version } from '../../../../package.json'
import PageTitle from '../../layout/PageTitle/PageTitle'

import { isValidEmail } from './domain/isValidEmail'

class Profil extends PureComponent {
  constructor(props) {
    super(props)
    const { currentUser } = this.props
    const { email, publicName } = currentUser

    this.state = {
      isLoading: false,
      emailInputValue: email,
      publicNameInputValue: publicName,
      hasEmailInputError: false,
    }
  }

  handleOnSubmit = event => {
    event.preventDefault()
    this.setState({ isLoading: true })
    const { dispatch } = this.props
    const { emailInputValue, publicNameInputValue } = this.state

    const config = {
      apiPath: '/users/current',
      body: {
        publicName: publicNameInputValue,
        email: emailInputValue,
      },
      handleSuccess: this.handleSuccess,
      handleFail: this.handleFail,
      method: 'PATCH',
      isMergingDatum: true,
    }

    const isEmailValid = isValidEmail(emailInputValue)
    if (isEmailValid) {
      dispatch(requestData(config))
      this.setState({ hasEmailInputError: false })
    } else {
      this.setState({ hasEmailInputError: true })
    }
  }

  handleFail = () => {
    const { dispatch } = this.props
    this.setState({ isLoading: false })

    dispatch(
      showNotificationV2({
        text: 'Erreur lors de la mise à jour de vos informations.',
        type: 'error',
      })
    )
  }

  handleSuccess = () => {
    const { dispatch } = this.props
    this.setState({ isLoading: false })

    dispatch(
      showNotificationV2({
        text: 'Informations mises à jour avec succès.',
        type: 'success',
      })
    )
  }

  handleEmailInputChange = event => {
    this.setState({ emailInputValue: event.target.value })
  }

  handlePublicNameInputChange = event => {
    this.setState({ publicNameInputValue: event.target.value })
  }

  isSubmitDisabled = () => {
    const { emailInputValue, publicNameInputValue } = this.state

    return publicNameInputValue.length < 3 || emailInputValue === ''
  }

  renderForm = () => {
    const { isLoading, publicNameInputValue, emailInputValue, hasEmailInputError } = this.state

    return (
      <form
        className="field-profil-input"
        onSubmit={this.handleOnSubmit}
      >
        <div className="field-profil-input">
          <TextInput
            label="Nom :"
            name="publicName"
            onChange={this.handlePublicNameInputChange}
            placeholder="3 caractères minimum"
            required
            value={publicNameInputValue}
          />
          <TextInput
            error={hasEmailInputError ? 'Le format de l’email est incorrect.' : null}
            label="E-mail :"
            name="email"
            onChange={this.handleEmailInputChange}
            placeholder="votre email"
            value={emailInputValue}
          />
        </div>

        <div
          className="field is-grouped"
          style={{ justifyContent: 'space-between' }}
        >
          <div className="control">
            <button
              className={classnames('primary-button', {
                'is-loading': isLoading,
              })}
              disabled={this.isSubmitDisabled()}
              type="submit"
            >
              {'Enregistrer'}
            </button>
          </div>
        </div>
        <div className="app-version">
          {`v${version}`}
        </div>
      </form>
    )
  }

  render() {
    return (
      <AppLayout
        layoutConfig={{
          backTo: { path: '/accueil', label: 'Accueil' },
          pageName: 'profile',
        }}
      >
        <PageTitle title="Modifier votre profil" />
        <Titles title="Profil" />
        {this.renderForm()}
        <hr />
      </AppLayout>
    )
  }
}

Profil.propTypes = {
  currentUser: PropTypes.shape({
    email: PropTypes.string,
    publicName: PropTypes.string,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
}

export default Profil
