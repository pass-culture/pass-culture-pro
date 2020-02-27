import PropTypes from 'prop-types'
import React, { Fragment, PureComponent } from 'react'
import { NavLink } from 'react-router-dom'
import { CGU_URL } from '../../../../utils/config'
import { Field, Form } from 'react-final-form'
import SignupForm from "./SignupForm/SignupForm";

class Signup extends PureComponent {
  onHandleSuccessRedirect = () => '/inscription/confirmation'

  onHandleFormatPatch = patch => Object.assign({ publicName: patch.firstName }, patch)

  isFieldDisabling = offererName => () => !offererName

  renderCguContent = () => (
    <Fragment>
      {'J’ai lu et j’accepte les '}
      <a
        href={CGU_URL}
        id="accept-cgu-link"
        rel="noopener noreferrer"
        target="_blank"
      >
        {'Conditions Générales d’Utilisation'}
      </a>
    </Fragment>
  )

  renderPasswordTooltip = () => {
    return `
          <Fragment>Votre mot de passe doit contenir au moins :
            <ul>
              <li>12 caractères</li>
              <li>une majuscule et une minuscule</li>
              <li>un chiffre</li>
              <li>un caractère spécial (signe de ponctuation, symbole monétaire ou mathématique)</li>
            </ul>
          </Fragment>`
  }

  handleOnSubmit = console.debug

  render() {
    const { patch } = this.props

    return (
      <section>
        <div className="hero-body">
          <h1 className="title is-spaced is-1">
            {'Créez votre compte'}
          </h1>
          <h2 className="subtitle is-2">
            {'Nous vous invitons à prendre connaissance des '}
            <a
              className="is-secondary"
              href="https://pass.culture.fr/ressources"
              rel="noopener noreferrer"
              target="_blank"
            >
              {'modalités de fonctionnement en cliquant ici '}
            </a>
            {'avant de renseigner les champs suivants.'}
          </h2>
          <span className="has-text-grey">
            <span className="required-legend">
              {'*'}
            </span>
            {' Champs obligatoires'}
          </span>
          <Form
            onSubmit={this.handleOnSubmit}
            render={SignupForm}
          />
        </div>
      </section>
    )
  }
}

Signup.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.string).isRequired,
  offererName: PropTypes.string.isRequired,
  patch: PropTypes.shape().isRequired,
}

export default Signup
