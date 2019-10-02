import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import React from 'react'
import VenueItem from './VenueItem/VenueItem'

const Venues = ({ venues, offererId }) => {
  return (
    <div className="section">
      <h2 className="main-list-title">
        {'Lieux'}
      </h2>
      <ul className="main-list venues-list">
        {venues.map(v => (
          <VenueItem
            key={v.id}
            venue={v}
          />
        ))}
      </ul>
      <div className="has-text-centered">
        <NavLink
          className="button is-secondary is-outlined"
          to={`/structures/${offererId}/lieux/creation`}
        >
          {'+ Ajouter un lieu'}
        </NavLink>
      </div>
    </div>
  )
}

Venues.propTypes = {
  offererId: PropTypes.string.isRequired,
  venues: PropTypes.arrayOf(PropTypes.shape()).isRequired,
}

export default Venues
