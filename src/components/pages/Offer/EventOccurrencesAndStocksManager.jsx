import classnames from 'classnames'
import get from 'lodash.get'
import { closeModal } from 'pass-culture-shared'
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { NavLink } from 'react-router-dom'
import { compose } from 'redux'

import EventOccurrenceAndStockItem from './EventOccurrenceAndStockItem'
import HeroSection from '../../layout/HeroSection'
import eventSelector from '../../../selectors/event'
import eventOccurrencesSelector from '../../../selectors/eventOccurrences'
import eventOccurrenceAndStocksErrorsSelector from '../../../selectors/eventOccurrenceAndStockErrors'
import offerSelector from '../../../selectors/offer'
import thingSelector from '../../../selectors/thing'
import providerSelector from '../../../selectors/provider'
import selectApiSearch from '../../../selectors/selectApiSearch'
import stocksSelector from '../../../selectors/stocks'

export function getAddUrl(isEditing, isStockOnly, offerId, stocks, defaultUrl) {
  if (isEditing) {
    return defaultUrl
  }

  if (isStockOnly) {
    if (stocks.length > 0) {
      return `/offres/${offerId}?gestion&stock=${stocks[0].id}`
    }
    return `/offres/${offerId}?gestion&stock=nouveau`
  }

  return `/offres/${offerId}?gestion&date=nouvelle`
}

class EventOccurrencesAndStocksManager extends Component {
  onCloseClick = e => {
    const { dispatch, offer, history } = this.props
    dispatch(closeModal())
    history.push(`/offres/${get(offer, 'id')}`)
  }

  handleEnterKey() {
    // Dirty DOM selectors but...
    if (!this.props.isEditing) {
      // This dom node is generated by react-router-dom's <NavLink /> component wich is
      // a 'Function component' and...
      // Warning: Function components cannot be given refs. Attempts to access this ref will fail.
      document.getElementById('add-occurrence-or-stock').focus()
      const { isEditing, isStockOnly } = this.props
      this.props.history.push(this.getAddUrl(isEditing, isStockOnly))
    } else {
      // Could fetch ref from the included components, but it will be far more complex
      // as we would have to make the ref transit through callback props.
      // We could probably use context though, but I am not familiar enough with this yet
      // and done is better than perfect
      const submitButton = document.getElementsByClassName('submitStep')[0]
      submitButton.click()
    }
  }

  handleEscKey() {
    if (!this.props.isEditing) {
      this.onCloseClick()
    } else {
      const cancelButton = document.getElementsByClassName('cancelStep')[0]
      cancelButton.click()
    }
  }

  getAddUrl(isEditing, isStockOnly) {
    return getAddUrl(
      isEditing,
      isStockOnly,
      get(this.props.offer, 'id'),
      this.props.stocks,
      `${this.props.location.pathname}${this.props.location.search}`
    )
  }

  componentDidMount() {
    this.elem.focus()
    document.onkeydown = event => {
      if (event.key === 'Enter') {
        this.handleEnterKey()
      } else if (event.key === 'Escape') {
        this.handleEscKey()
      }
    }
  }

  componentWillUnmount() {
    document.onkeydown = null
  }

  render() {
    const {
      errors,
      event,
      eventOccurrences,
      isEditing,
      isNew,
      provider,
      stocks,
      thing,
      isStockOnly,
    } = this.props

    return (
      <div
        className="event-occurrences-and-stocks-manager"
        ref={elem => (this.elem = elem)}>
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
                <td>Modifier</td>
                <td>Supprimer</td>
              </tr>
            </thead>

            {provider ? (
              <tbody>
                <tr>
                  <td colSpan="10">
                    <i>
                      Il n'est pas possible d'ajouter ni de supprimer d'horaires
                      pour cet événement {provider.name}
                    </i>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan="10">
                    <NavLink
                      className="button is-secondary"
                      disabled={isEditing}
                      id="add-occurrence-or-stock"
                      to={this.getAddUrl(isEditing, isStockOnly)}>
                      {isStockOnly
                        ? stocks.length
                          ? ''
                          : '+ Ajouter un stock'
                        : '+ Ajouter une date'}
                    </NavLink>
                  </td>
                </tr>
              </tbody>
            )}

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
                  <td>Modifier</td>
                  <td>Supprimer</td>
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

function mapStateToProps(state, ownProps) {
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
  const isStockOnly = typeof get(thing, 'id') !== 'undefined'

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
    isStockOnly,
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps)
)(EventOccurrencesAndStocksManager)
