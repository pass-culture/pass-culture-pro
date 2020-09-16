import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'

import Icon from '../../../layout/Icon'
import Thumb from '../../../layout/Thumb'
import { computeOfferStatus } from '../domain/computeOfferStatus'
import { pluralize } from '../../../../utils/pluralize'
import { OFFER_STATUS } from '../domain/offerStatus'

const OFFER_STATUS_PROPERTIES = {
  [OFFER_STATUS.INACTIVE]: {
    className: 'status-inactive',
    icon: 'ico-status-inactive',
  },
  [OFFER_STATUS.EXPIRED]: {
    className: 'status-expired',
    icon: 'ico-status-expired',
  },
  [OFFER_STATUS.SOLD_OUT]: {
    className: 'status-sold-out',
    icon: 'ico-status-sold-out',
  },
  [OFFER_STATUS.ACTIVE]: {
    className: 'status-active',
    icon: 'ico-status-validated',
  },
}

class OfferItem extends PureComponent {
  handleOnDeactivateClick = () => {
    const { offer, updateOffer, trackActivateOffer, trackDeactivateOffer } = this.props
    const { id, isActive } = offer || {}
    updateOffer(id, !isActive)
    isActive ? trackDeactivateOffer(id) : trackActivateOffer(id)
  }

  buildStocksDetail = (offer, stockSize) => {
    if (offer.isThing) {
      return `${stockSize} prix`
    }

    if (offer.isEvent) {
      return pluralize(stockSize, 'date')
    }
  }

  computeNumberOfSoldOutStocks = stocks => {
    return stocks.filter(stock => stock.remainingQuantity === 0).length
  }

  render() {
    const {
      availabilityMessage,
      location: { search },
      offer,
      stocks,
      venue,
    } = this.props

    const stockSize = stocks ? stocks.length : null
    const isOfferEditable = offer ? offer.isEditable : null
    const isOfferInactiveOrExpired = !offer.isActive || offer.hasBookingLimitDatetimesPassed
    const shouldShowSoldOutWarning =
      this.computeNumberOfSoldOutStocks(stocks) > 0 && !offer.isFullyBooked
    const offerStatus = computeOfferStatus(offer, stocks)

    return (
      <li className={`offer-item ${isOfferInactiveOrExpired ? 'inactive' : ''} offer-row`}>
        <Thumb url={offer.thumbUrl} />
        <div className="title-container">
          <Link
            className="name"
            title="Afficher le détail de l'offre"
            to={`/offres/${offer.id}${search}`}
          >
            {offer.name}
          </Link>
          <span className="stocks">
            <Link
              className="quaternary-link"
              title="Afficher le détail des stocks"
              to={`/offres/${offer.id}?gestion`}
            >
            {this.buildStocksDetail(offer, stockSize)}
            </Link>
            {shouldShowSoldOutWarning && (
              <div>
                <Icon
                  className="sold-out-icon"
                  svg="ico-warning-stocks"
                  tabindex={0}
                />
                <span className="sold-out-dates">
                  <Icon svg="ico-warning-stocks" />
                  {pluralize(this.computeNumberOfSoldOutStocks(stocks), 'date épuisée')}
                </span>
              </div>
            )}
          </span>
        </div>
        <span>
          {(venue && venue.publicName) || venue.name}
        </span>
        {availabilityMessage && (
          <span>
            {availabilityMessage}
          </span>
        )}
        <span className="status-column">
          <span className={OFFER_STATUS_PROPERTIES[offerStatus].className}>
            <Icon svg={OFFER_STATUS_PROPERTIES[offerStatus].icon} />
            {offerStatus}
          </span>
        </span>
        <button
          className="secondary-button"
          onClick={this.handleOnDeactivateClick}
          type="button"
        >
          {offer.isActive ? 'Désactiver' : 'Activer'}
        </button>
        {isOfferEditable && (
          <Link
            className="secondary-link"
            to={`/offres/${offer.id}/edition`}
          >
            <Icon svg="ico-pen" />
          </Link>
        )}
      </li>
    )
  }
}

OfferItem.propTypes = {
  availabilityMessage: PropTypes.string.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  offer: PropTypes.shape().isRequired,
  stocks: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  trackActivateOffer: PropTypes.func.isRequired,
  trackDeactivateOffer: PropTypes.func.isRequired,
  updateOffer: PropTypes.func.isRequired,
  venue: PropTypes.shape().isRequired,
}

export default OfferItem
