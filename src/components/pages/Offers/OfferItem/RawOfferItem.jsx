import classnames from 'classnames'
import get from 'lodash.get'
import moment from 'moment'
import { Icon, pluralize } from 'pass-culture-shared'
import React, { Component } from 'react'
import Dotdotdot from 'react-dotdotdot'
import { NavLink } from 'react-router-dom'
import { requestData } from 'redux-saga-data'

import Price from 'components/layout/Price'
import Thumb from 'components/layout/Thumb'
import { offerNormalizer } from 'utils/normalizers'

class RawOfferItem extends Component {
  onDeactivateClick = () => {
    const { dispatch, offer } = this.props
    const { id, isActive } = offer || {}

    dispatch(
      requestData({
        apiPath: `/offers/${id}`,
        body: {
          isActive: !isActive,
        },
        isMergingDatum: true,
        isMutatingDatum: true,
        isMutaginArray: false,
        method: 'PATCH',
        normalizer: offerNormalizer,
      })
    )
  }

  buildEventLabel = remainingStock => {
    if (remainingStock === 0) {
      return '0 places'
    }
    return `encore ${pluralize(remainingStock, 'place')}`
  }

  buildThingLabel = remainingStock => {
    return `${remainingStock} en stock`
  }

  buildNumberOfParticipantsLabel = (groupSizeMin, groupSizeMax) => {
    return groupSizeMin === groupSizeMax
      ? `${groupSizeMin}`
      : `${groupSizeMin} - ${groupSizeMax}`
  }

  buildNumberOfParticipantsTitle = (groupSizeMin, groupSizeMax) => {
    const groupLabel =
      groupSizeMin === groupSizeMax
        ? `minimum ${pluralize(groupSizeMin, 'personnes')}`
        : `entre ${groupSizeMin} et ${groupSizeMax} personnes`

    return groupSizeMin > 0 ? groupLabel : null
  }

  buildEventNavLinkLabel = stockSize => {
    return pluralize(stockSize, 'date')
  }

  buildThingNavLinkLabel = stockSize => {
    return `${stockSize} prix`
  }

  render() {
    const {
      aggregatedStock,
      event,
      location: { search },
      maxDate,
      mediations,
      offer,
      stocks,
      thing,
      thumbUrl,
      offerTypeLabel,
      offerer,
      venue,
    } = this.props

    const { isNew } = offer || {}
    const { groupSizeMin, groupSizeMax, priceMin, priceMax } =
      aggregatedStock || {}
    const { name, createdAt } = event || thing || {}

    const numberOfMediations = get(mediations, 'length')
    const remainingStockQuantity = get(stocks, 'length')

    return (
      <li
        className={classnames('offer-item', {
          active: offer.isActive,
          event,
          thing,
        })}>
        <Thumb alt="offre" src={thumbUrl} />
        <div className="list-content">
          <NavLink
            className="name"
            to={`/offres/${offer.id}${search}`}
            title={name}>
            <Dotdotdot clamp={1}>{name}</Dotdotdot>
          </NavLink>
          <ul className="infos">
            <li className="is-uppercase">{offerTypeLabel}</li>
            <li>
              <span className="label">Structure : </span>
              {offerer && offerer.name}
            </li>
            <li>
              <span className="label">Lieu : </span>
              {venue && venue.name}
            </li>
          </ul>
          <ul className="infos">
            {isNew && (
              <li>
                <div className="recently-added" />
              </li>
            )}
            <li
              title={this.buildNumberOfParticipantsTitle(
                groupSizeMin,
                groupSizeMax
              )}>
              {groupSizeMin === 1 && <Icon svg="picto-user" />}
              {groupSizeMin > 1 && (
                <div>
                  <Icon svg="picto-group" />,{' '}
                  <p>
                    {this.buildNumberOfParticipantsLabel(
                      groupSizeMin,
                      groupSizeMax
                    )}
                  </p>
                </div>
              )}
            </li>
            <li>
              <NavLink
                className="has-text-primary"
                to={`/offres/${offer.id}?gestion`}>
                {event && this.buildEventNavLinkLabel(remainingStockQuantity)}
                {thing && this.buildThingNavLinkLabel(remainingStockQuantity)}
              </NavLink>
            </li>
            <li>{maxDate && `jusqu'au ${maxDate.format('DD/MM/YYYY')}`}</li>
            {event && <li>{this.buildEventLabel(remainingStockQuantity)}</li>}
            {thing && <li>{this.buildThingLabel(remainingStockQuantity)}</li>}
            <li>
              {priceMin === priceMax ? (
                <Price value={priceMin || 0} />
              ) : (
                <span>
                  <Price value={priceMin} /> - <Price value={priceMax} />
                </span>
              )}
            </li>
          </ul>
          <ul className="actions">
            <li>
              <NavLink
                to={`/offres/${offer.id}${
                  numberOfMediations ? '' : `/accroches/nouveau${search}`
                }`}
                className={`button addMediations is-small ${
                  numberOfMediations ? 'is-secondary' : 'is-primary is-outlined'
                }`}>
                <span className="icon">
                  <Icon svg="ico-stars" />
                </span>
                <span>
                  {get(mediations, 'length')
                    ? 'Accroches'
                    : 'Ajouter une Accroche'}
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/offres/${offer.id}`}
                className="button is-secondary is-small edit-link">
                <Icon svg="ico-pen-r" />
                Modifier
              </NavLink>

              <button
                className="button is-secondary is-small activ-switch"
                onClick={this.onDeactivateClick}>
                {offer.isActive ? (
                  <span>
                    <Icon svg="ico-close-r" />
                    Désactiver
                  </span>
                ) : (
                  'Activer'
                )}
              </button>
            </li>
          </ul>
        </div>
      </li>
    )
  }
}

RawOfferItem.defaultProps = {
  maxDescriptionLength: 300,
}
export default RawOfferItem
