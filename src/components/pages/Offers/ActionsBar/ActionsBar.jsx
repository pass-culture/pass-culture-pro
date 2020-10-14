import PropTypes from 'prop-types'
import React from 'react'

import Icon from 'components/layout/Icon'

const ActionsBar = ({ selectedOfferIds, setActionsBarVisibility, setSelectedOfferIds }) => {
  const nbSelectedOffers = selectedOfferIds.length
  function handleActivate() {
    // TODO: add redux thunk action call
    console.log('handleActivate')
  }
  function handleDeactivate() {
    // TODO: add redux thunk action call
    console.log('handleDeactivate')
  }
  function handleClose() {
    console.log('handleClose')
    setSelectedOfferIds([])
    setActionsBarVisibility(false)
  }

  return (
    <div className="offer-actions-bar">
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
  setSelectedOfferIds: PropTypes.func.isRequired,
}

export default ActionsBar
