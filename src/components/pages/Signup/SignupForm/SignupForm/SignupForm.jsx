import React from 'react'
import { NavLink } from 'react-router-dom'
import Email from '../Fields/Email'
import Password from '../Fields/Password'
import LastName from '../Fields/LastName'
import FirstName from '../Fields/FirstName'
import PhoneNumber from '../Fields/PhoneNumber'
import Newsletter from '../Fields/Newsletter'
import JoinSurvey from '../Fields/JoinSurvey'
import ConditionGeneralUtilisation from '../Fields/ConditionGeneralUtilisation'

function SignupForm({ handleSubmit, invalid, pristine }) {
  return (
    <form onSubmit={handleSubmit}>
      <Email />
      <Password />
      <LastName />
      <FirstName />
      <PhoneNumber />
      <Newsletter />
      <JoinSurvey />
      <ConditionGeneralUtilisation />
      {/*
      <div className="field-group">
        <Field
          label="Adresse e-mail"
          name="email"
          placeholder="nom@exemple.fr"
          required
          sublabel="pour se connecter et récupérer son mot de passe en cas d’oubli"
          type="email"
        />
        <Field
          info={this.renderPasswordTooltip()}
          label="Mot de passe"
          name="password"
          placeholder="Mon mot de passe"
          required
          sublabel="pour se connecter"
          type="password"
        />
        <Field
          label="Nom"
          name="lastName"
          placeholder="Mon nom"
          required
        />
        <Field
          label="Prénom"
          name="firstName"
          placeholder="Mon prénom"
          required
        />
        <Field
          label="Téléphone"
          name="phoneNumber"
          placeholder="Mon numéro de téléphone"
          required
          sublabel="utilisé uniquement par l'équipe du pass Culture"
        />
        <Field
          disabling={this.isFieldDisabling(offererName)}
          label="SIREN"
          name="siren"
          placeholder="123 456 789"
          required
          sublabel="de la structure que vous représentez"
          type="siren"
          withFetchedName
        />
        <Field
          label="Je souhaite recevoir les actualités du pass Culture"
          name="newsletter_ok"
          type="checkbox"
        />
        <Field
          label="J’accepte d'être contacté par e-mail pour donner mon avis sur le pass Culture"
          name="contact_ok"
          required
          type="checkbox"
        />
        <Field
          className="cgu-field"
          label={this.renderCguContent()}
          name="cgu_ok"
          required
          type="checkbox"
        />
        <div className="errors">
          {errors}
        </div>
      </div>
     */}

      <div className="buttons-field">
        <NavLink
          className="button is-secondary"
          to="/connexion"
        >
          {'J’ai déjà un compte'}
        </NavLink>
        <div className="control">
          <button
            className="button is-primary is-outlined"
            disabled={invalid || pristine}
            type="submit"
          >
            {'Créer'}
          </button>
        </div>
      </div>
    </form>)
}

export default SignupForm
