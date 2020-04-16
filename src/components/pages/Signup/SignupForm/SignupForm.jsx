import React from 'react'
import { NavLink } from 'react-router-dom'
import Email from './Fields/Email'
import Password from './Fields/Password'
import LastName from './Fields/LastName'
import FirstName from './Fields/FirstName'
import PhoneNumber from './Fields/PhoneNumber'
import Newsletter from './Fields/Newsletter'
import JoinSurvey from './Fields/JoinSurvey'
import ConditionGeneralUtilisation from './Fields/ConditionGeneralUtilisation'
import Siren from './Fields/Siren'

function SignupForm({ handleSubmit, invalid, pristine }) {
  return (
    <form onSubmit={handleSubmit}>
      <Email />
      <Password />
      <LastName />
      <FirstName />
      <PhoneNumber />
      <Siren />
      <Newsletter />
      <JoinSurvey />
      <ConditionGeneralUtilisation />
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
