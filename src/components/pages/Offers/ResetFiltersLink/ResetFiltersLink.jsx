import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'

export const ResetFiltersLink = ({ hasActiveSearchFilter, resetFilters }) =>
  hasActiveSearchFilter ? (
    <Link
      className="reset-filters-link"
      onClick={resetFilters}
      to="/offres"
    >
      {'Réinitialiser les filtres'}
    </Link>
  ) : (
    <span className="reset-filters-link disabled">
      {'Réinitialiser les filtres'}
    </span>
  )

ResetFiltersLink.propTypes = {
  hasActiveSearchFilter: PropTypes.bool.isRequired,
  resetFilters: PropTypes.func.isRequired,
}
