import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'

import AppLayout from 'app/AppLayout'
import TextInput from 'components/layout/inputs/TextInput/TextInput'
import TextInputWithIcon from 'components/layout/inputs/TextInputWithIcon/TextInputWithIcon'
import Logo from 'components/layout/Logo'
import PageTitle from 'components/layout/PageTitle/PageTitle'
import { redirectLoggedUser } from 'components/router/helpers'

import { initReCaptchaScript } from '../../../utils/recaptcha'

class LostPassword extends PureComponent {
  constructor(props) {
    super(props)
    const { currentUser, history, isNewHomepageActive } = props

    redirectLoggedUser(history, currentUser, isNewHomepageActive)

    this.state = {
      emailValue: '',
      newPasswordErrorMessage: '',
      newPasswordValue: '',
      isPasswordHidden: true,
    }
  }

  componentDidMount() {
    this.gcaptchaScript = initReCaptchaScript()
  }

  componentWillUnmount() {
    this.gcaptchaScript.remove()
  }

  redirectToResetPasswordSuccessPage = () => {
    const { history } = this.props
    history.push('/mot-de-passe-perdu?change=1')
  }

  displayPasswordResetErrorMessages = errors => {
    const { showErrorNotification } = this.props
    if (errors.newPassword) {
      this.setState({ newPasswordErrorMessage: errors.newPassword[0] })
    } else {
      showErrorNotification("Une erreur s'est produite, veuillez réessayer ultérieurement.")
    }
  }

  redirectToResetPasswordRequestSuccessPage = () => {
    const { history } = this.props
    history.push('/mot-de-passe-perdu?envoye=1')
  }

  submitResetPasswordRequest = event => {
    event.preventDefault()
    const { setPasswordRequest, showErrorNotification } = this.props
    const { emailValue } = this.state

    return setPasswordRequest(emailValue)
      .then(this.redirectToResetPasswordRequestSuccessPage)
      .catch(() => {
        showErrorNotification(
          'Un problème est survenu pendant la réinitialisation du mot de passe, veuillez réessayer plus tard.'
        )
      })
  }

  submitResetPassword = event => {
    event.preventDefault()
    const { setPassword, token } = this.props
    const { newPasswordValue } = this.state

    return setPassword(newPasswordValue, token)
      .then(this.redirectToResetPasswordSuccessPage)
      .catch(errors => {
        console.log('LostPassword: error', errors)
        this.displayPasswordResetErrorMessages(errors)
      })
  }

  handleInputEmailChange = event => {
    this.setState({ emailValue: event.target.value })
  }

  handleInputPasswordChange = event => {
    this.setState({ newPasswordValue: event.target.value })
  }

  handleToggleHidden = event => {
    event.preventDefault()
    this.setState(previousState => ({
      isPasswordHidden: !previousState.isPasswordHidden,
    }))
  }

  isResetPasswordRequestSubmitDisabled = () => {
    const { emailValue } = this.state

    return emailValue === ''
  }

  isResetPasswordSubmitDisabled = () => {
    const { newPasswordValue } = this.state

    return newPasswordValue === ''
  }

  render() {
    const { emailValue, newPasswordErrorMessage, isPasswordHidden, newPasswordValue } = this.state
    const { change, envoye, token } = this.props

    return (
      <AppLayout
        layoutConfig={{
          fullscreen: true,
          pageName: 'sign-in',
        }}
      >
        <PageTitle title="Mot de passe perdu" />
        <div className="logo-side">
          <Logo
            noLink
            signPage
          />
        </div>
        <div className="scrollable-content-side">
          <div className="content">
            {change && (
              <section className="hero password-reset">
                <div className="hero-body">
                  <h1>
                    {'Mot de passe changé !'}
                  </h1>
                  <h2>
                    {'Vous pouvez dès à présent vous connecter avec votre nouveau mot de passe'}
                  </h2>
                  <Link
                    className="primary-link"
                    to="/connexion"
                  >
                    {'Se connecter'}
                  </Link>
                </div>
              </section>
            )}
            {envoye && (
              <section className="hero mail-sent">
                <div className="hero-body">
                  <h1>
                    {'Merci !'}
                  </h1>
                  <h2>
                    {
                      'Vous allez recevoir par e-mail les instructions pour définir un nouveau mot de passe.'
                    }
                  </h2>
                  <Link
                    className="primary-link"
                    to="/"
                  >
                    {'Revenir à l’accueil'}
                  </Link>
                </div>
              </section>
            )}
            {token && (
              <section className="hero password-reset-request-form">
                <div className="hero-body">
                  <h1>
                    {'Créer un nouveau mot de passe'}
                  </h1>
                  <h2>
                    {'Saisissez le nouveau mot de passe'}
                  </h2>

                  <form
                    className="new-password-form"
                    noValidate
                    onSubmit={this.submitResetPassword}
                  >
                    <TextInputWithIcon
                      error={newPasswordErrorMessage ? newPasswordErrorMessage : null}
                      icon={isPasswordHidden ? 'ico-eye-close' : 'ico-eye-open'}
                      iconAlt={
                        isPasswordHidden ? 'Afficher le mot de passe' : 'Cacher le mot de passe'
                      }
                      label="Nouveau mot de passe"
                      name="password"
                      onChange={this.handleInputPasswordChange}
                      onIconClick={this.handleToggleHidden}
                      placeholder="Mon nouveau mot de passe"
                      required
                      subLabel="obligatoire"
                      type={isPasswordHidden ? 'password' : 'text'}
                      value={newPasswordValue}
                    />

                    <button
                      className="primary-button submit-button"
                      disabled={this.isResetPasswordSubmitDisabled()}
                      type="submit"
                    >
                      {'Envoyer'}
                    </button>
                  </form>
                </div>
              </section>
            )}
            {!token && !envoye && !change && (
              <section className="hero password-reset-request">
                <div className="hero-body">
                  <h1>
                    {'Mot de passe égaré ?'}
                  </h1>
                  <h2>
                    {
                      'Indiquez ci-dessous l’adresse e-mail avec laquelle vous avez créé votre compte.'
                    }
                  </h2>

                  <form
                    noValidate
                    onSubmit={this.submitResetPasswordRequest}
                  >
                    <TextInput
                      label="Adresse e-mail"
                      name="email"
                      onChange={this.handleInputEmailChange}
                      placeholder="nom@exemple.fr"
                      required
                      subLabel="obligatoire"
                      type="email"
                      value={emailValue}
                    />

                    <button
                      className="primary-button"
                      disabled={this.isResetPasswordRequestSubmitDisabled()}
                      type="submit"
                    >
                      {'Envoyer'}
                    </button>
                  </form>
                </div>
              </section>
            )}
          </div>
        </div>
      </AppLayout>
    )
  }
}

LostPassword.defaultProps = {
  currentUser: null,
}

LostPassword.propTypes = {
  change: PropTypes.bool.isRequired,
  currentUser: PropTypes.shape(),
  envoye: PropTypes.bool.isRequired,
  history: PropTypes.shape().isRequired,
  isNewHomepageActive: PropTypes.bool.isRequired,
  setPassword: PropTypes.func.isRequired,
  setPasswordRequest: PropTypes.func.isRequired,
  showErrorNotification: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
}

export default LostPassword
