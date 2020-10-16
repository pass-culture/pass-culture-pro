import PropTypes from 'prop-types'
import React from 'react'

import Icon from 'components/layout/Icon'
import { fetchFromApiWithCredentials } from 'utils/fetch'

const ActionsBar = ({ selectedOfferIds, setActionsBarVisibility, setSelectedOfferIds }) => {
  const nbSelectedOffers = selectedOfferIds.length
  function handleActivate() {
    const body = {
      ids: selectedOfferIds,
      isActive: true,
    }

    fetchFromApiWithCredentials('/offers/active-status', 'PATCH', body)
    // This logic should be include in a redux action
    // refreshOffers({ shouldTriggerSpinner: false })
    // trackActivateOffer(id)
  }
  function handleDeactivate() {
    const body = {
      ids: selectedOfferIds,
      isActive: false,
    }
    fetchFromApiWithCredentials('/offers/active-status', 'PATCH', body)
    // refreshOffers({ shouldTriggerSpinner: false })
    // trackDeactivateOffer(id)
  }
  function handleClose() {
    setSelectedOfferIds([])
    setActionsBarVisibility(false)
  }

  return (
    <div
      className="offers-actions-bar"
      data-testid="offers-actions-bar"
    >
      <span className="nb-offers-description">
        {(() => {
          if (nbSelectedOffers > 1) {
            return `${nbSelectedOffers} offres sélectionnées`
          }
          return `${nbSelectedOffers} offre sélectionnée`
        })()}
      </span>

      <div className="actions-container">
        <button
          className="primary-button"
          onClick={handleDeactivate}
          type="button"
        >
          <Icon svg="ico-status-inactive" />
          {'Désactiver'}
        </button>
        <button
          className="primary-button"
          onClick={handleActivate}
          type="button"
        >
          <Icon svg="ico-status-validated" />
          {'Activer'}
        </button>
        <button
          className="button"
          onClick={handleClose}
          type="button"
        >
          {'Annuler'}
        </button>
      </div>
    </div>
  )
}

ActionsBar.defaultProps = {
  selectedOfferIds: [],
}

ActionsBar.propTypes = {
  selectedOfferIds: PropTypes.arrayOf(PropTypes.string),
  setActionsBarVisibility: PropTypes.func.isRequired,
  setSelectedOfferIds: PropTypes.func.isRequired,
}

export default ActionsBar
