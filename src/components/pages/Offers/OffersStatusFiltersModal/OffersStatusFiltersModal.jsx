import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useRef } from 'react'

export const OffersStatusFiltersModal = ({
  refreshOffers,
  statusFilters,
  toggleModalVisibility,
  updateStatusFilters,
}) => {
  const modalRef = useRef(null)

  const handleStatusFilterChange = useCallback(
    event => {
      updateStatusFilters(event.target.name, event.target.checked)
    },
    [updateStatusFilters]
  )

  const onClickOutside = useCallback(
    event => {
      const { target } = event

      if (modalRef.current && !modalRef.current.contains(target)) {
        event.preventDefault()
        event.stopPropagation()

        toggleModalVisibility()
      }
    },
    [toggleModalVisibility]
  )

  useEffect(() => {
    document.body.addEventListener('click', onClickOutside)

    return () => {
      document.body.removeEventListener('click', onClickOutside)
    }
  }, [onClickOutside])

  return (
    <div
      className="offers-status-filters"
      ref={modalRef}
    >
      <div className="osf-title">
        {'Afficher les statuts'}
      </div>
      <label>
        <input
          checked={statusFilters.active}
          name="active"
          onChange={handleStatusFilterChange}
          type="checkbox"
        />
        {'Active'}
      </label>
      <label>
        <input
          checked={statusFilters.inactive}
          name="inactive"
          onChange={handleStatusFilterChange}
          type="checkbox"
        />
        {'Inactive'}
      </label>
      <button
        className="primary-button"
        onClick={refreshOffers}
        type="button"
      >
        {'Appliquer'}
      </button>
    </div>
  )
}

OffersStatusFiltersModal.propTypes = {
  refreshOffers: PropTypes.func.isRequired,
  statusFilters: PropTypes.shape({
    active: PropTypes.bool.isRequired,
    inactive: PropTypes.bool.isRequired,
  }).isRequired,
  toggleModalVisibility: PropTypes.func.isRequired,
  updateStatusFilters: PropTypes.func.isRequired,
}