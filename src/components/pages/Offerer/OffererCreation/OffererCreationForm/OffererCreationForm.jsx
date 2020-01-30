import React from 'react'
import Siren from '../Fields/Siren/Siren'
import Name from '../Fields/Name'
import Address from '../Fields/Address'
import PostalCode from '../Fields/PostalCode'
import City from '../Fields/City'
import { NavLink } from "react-router-dom"

const OffererCreationForm = ({ handleSubmit, submitting, pristine }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="section">
        <div className="field-group">

          <Siren />
          <Name />
          <Address />
          <PostalCode />
          <City />

          <div
            className="field is-grouped is-grouped-centered"
            style={{ justifyContent: 'space-between' }}
          >
            <div className="control">
              <NavLink
                className="button is-secondary is-medium"
                to="/structures"
              >
                {'Retour'}
              </NavLink>
            </div>
            <div className="control">
              <button
                className="button is-primary is-medium"
                disabled={submitting || pristine}
                type="submit"
              >
                {'Valider'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default OffererCreationForm
