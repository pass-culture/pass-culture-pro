import classnames from 'classnames'
import get from 'lodash.get'
import { closeModal } from 'pass-culture-shared'
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { NavLink } from 'react-router-dom'
import { compose } from 'redux'

import EventOccurrenceAndStockItem from '../items/EventOccurrenceAndStockItem'
import HeroSection from '../layout/HeroSection'
import eventSelector from '../../selectors/event'
import eventOccurrencesSelector from '../../selectors/eventOccurrences'
import eventOccurrenceAndStocksErrorsSelector from '../../selectors/eventOccurrenceAndStockErrors'
import offerSelector from '../../selectors/offer'
import thingSelector from '../../selectors/thing'
import providerSelector from '../../selectors/provider'
import selectApiSearch from '../../selectors/selectApiSearch'
import stocksSelector from '../../selectors/stocks'

class EventOccurrencesAndStocksManager extends Component {
  onCloseClick = e => {
    const { dispatch, offer, history } = this.props
    dispatch(closeModal())
    history.push(`/offres/${get(offer, 'id')}`)
  }

  render() {
    const {
      errors,
      event,
      eventOccurrences,
      isEditing,
      isNew,
      location,
      provider,
      offer,
      stocks,
      thing,
    } = this.props
    const isStockOnly = typeof get(thing, 'id') !== 'undefined'

    return (
      <div className="event-occurrences-and-stocks-manager">
        {errors && (
          <div className="notification is-danger">
            {Object.keys(errors).map(key => (
              <p key={key}>
                {' '}
                {key} : {errors[key]}
              </p>
            ))}
          </div>
        )}
        <div className="event-occurrences-and-stocks-table-wrapper">
          <HeroSection
            title={
              get(event, 'id')
                ? 'Dates, horaires et prix'
                : get(thing, 'id') && 'Prix'
            }
            subtitle={get(event, 'name') || get(thing, 'name')}
          />
          <table
            className={classnames(
              'table is-hoverable event-occurrences-and-stocks-table',
              { small: isStockOnly }
            )}>
            <thead>
              <tr>
                {!isStockOnly && (
                  <Fragment>
                    <td>Date</td>
                    <td>
                      Heure de
                      <br />
                      début
                    </td>
                    <td>
                      Heure de
                      <br />
                      fin
                    </td>
                  </Fragment>
                )}
                <td>Prix</td>
                <td>Date Limite de Réservation</td>
                <td>Places (total)</td>
                <td>Supprimer</td>
                <td>Modifier</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="10">
                  {provider ? (
                    <i>
                      Il n'est pas possible d'ajouter ni de supprimer d'horaires
                      pour cet événement {provider.name}
                    </i>
                  ) : (
                    <NavLink
                      className="button is-secondary"
                      disabled={isEditing}
                      to={
                        isEditing
                          ? `${location.pathname}${location.search}`
                          : isStockOnly
                            ? `/offres/${get(
                                offer,
                                'id'
                              )}?gestion&stock=nouveau`
                            : `/offres/${get(
                                offer,
                                'id'
                              )}?gestion&date=nouvelle`
                      }>
                      {isStockOnly
                        ? stocks.length
                          ? ''
                          : '+ Ajouter un prix'
                        : '+ Ajouter un horaire'}
                    </NavLink>
                  )}
                </td>
              </tr>
              {isNew && (
                <EventOccurrenceAndStockItem
                  isFullyEditable={!provider}
                  isStockOnly={isStockOnly}
                />
              )}
              {(isStockOnly ? stocks : eventOccurrences).map(item => (
                <EventOccurrenceAndStockItem
                  key={item.id}
                  isFullyEditable={!provider}
                  isStockOnly={isStockOnly}
                  {...{ [isStockOnly ? 'stock' : 'eventOccurrence']: item }}
                />
              ))}
            </tbody>
            {Math.max(
              get(stocks, 'length', 0),
              get(eventOccurrences, 'length', 0)
            ) > 12 && (
              <thead>
                <tr>
                  {!isStockOnly && (
                    <Fragment>
                      <td>Date</td>
                      <td>Heure de début</td>
                      <td>Heure de fin</td>
                    </Fragment>
                  )}
                  <td>Prix</td>
                  <td>Date Limite de Réservation</td>
                  <td>Places (total)</td>
                  <td>Supprimer</td>
                  <td>Modifier</td>
                </tr>
              </thead>
            )}
          </table>
        </div>
        <button
          className="button is-secondary is-pulled-right"
          onClick={this.onCloseClick}>
          Fermer
        </button>
      </div>
    )
  }
}

export default compose(
  withRouter,
  connect((state, ownProps) => {
    const search = selectApiSearch(state, ownProps.location.search)
    const { eventOccurrenceIdOrNew, stockIdOrNew } = search || {}

    const isEditing = eventOccurrenceIdOrNew || stockIdOrNew
    const isNew =
      eventOccurrenceIdOrNew === 'nouvelle' ||
      (!eventOccurrenceIdOrNew && stockIdOrNew === 'nouveau')

    const offerId = ownProps.match.params.offerId
    const offer = offerSelector(state, offerId)

    const eventId = get(offer, 'eventId')
    const event = eventSelector(state, eventId)
    const eventOccurrences = eventOccurrencesSelector(
      state,
      ownProps.match.params.offerId
    )

    const thingId = get(offer, 'thingId')
    const thing = thingSelector(state, thingId)

    const stocks = stocksSelector(state, offerId, event && eventOccurrences)

    const errors = eventOccurrenceAndStocksErrorsSelector(
      state,
      eventOccurrenceIdOrNew,
      stockIdOrNew
    )

    return {
      errors,
      event,
      eventOccurrenceIdOrNew,
      eventOccurrences,
      isEditing,
      isNew,
      offer,
      provider: providerSelector(state, get(event, 'lastProviderId')),
      stocks,
      thing,
    }
  })
)(EventOccurrencesAndStocksManager)
