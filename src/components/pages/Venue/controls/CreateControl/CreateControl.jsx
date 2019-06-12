import React from 'react'
import { NavLink } from 'react-router-dom'

const CreateControl = ({ venueId }) => (
  <div className="control">
    <div
      className="field is-grouped is-grouped-centered"
      style={{ justifyContent: 'space-between' }}>
      <div className="control">
        <NavLink
          className="button is-secondary is-medium"
          to={`/offres/creation?lieu=${venueId}`}>
          Créer une offre dans ce lieu
        </NavLink>
      </div>
    </div>
  </div>
)

export default CreateControl
