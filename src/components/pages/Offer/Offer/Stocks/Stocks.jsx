import moment from 'moment-timezone'
import PropTypes from 'prop-types'
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

import Icon from 'components/layout/Icon'
import PageTitle from 'components/layout/PageTitle/PageTitle'
import * as pcapi from 'repository/pcapi/pcapi'
import { getDepartmentTimezone } from 'utils/timezone'

import StockItemContainer from './StockItem/StockItemContainer'

const Stocks = ({ offer, notifyErrors, notifySuccess }) => {
  const offerId = offer.id
  const [stocks, setStocks] = useState([])
  const [departmentCode, setDepartmentCode] = useState(null)
  const [isEvent, setIsEvent] = useState(false)
  const [isOfferSynchronized, setIsOfferSynchronized] = useState(false)

  useEffect(() => {
    moment.tz.setDefault(getDepartmentTimezone(departmentCode))

    return () => {
      moment.tz.setDefault()
    }
  }, [departmentCode])

  const getOffer = useCallback(() => {
    return pcapi.loadOffer(offerId).then(offer => {
      const stocksByDescendingBeginningDatetime = offer.stocks.sort(
        (stock1, stock2) =>
          moment(stock2.beginningDatetime).unix() - moment(stock1.beginningDatetime).unix()
      )
      setIsEvent(offer.isEvent)
      setIsOfferSynchronized(Boolean(offer.lastProviderId))
      setDepartmentCode(offer.venue.departementCode)
      setStocks(stocksByDescendingBeginningDatetime)
    })
  }, [offerId])

  useEffect(() => {
    getOffer()
  }, [getOffer])

  const addNewStock = useCallback(() => {
    let newStock = {
      tmpId: uuidv4(),
      price: 0,
      quantity: null,
      bookingLimitDatetime: '',
    }
    if (isEvent) {
      newStock.beginningDatetime = ''
    }
    setStocks([newStock, ...stocks])
  }, [isEvent, setStocks, stocks])

  const updateStock = useCallback(
    updatedStock => {
      const idField = updatedStock.tmpId ? 'tmpId' : 'id'
      const updateIndex = stocks.findIndex(stock => {
        return idField in stock && stock[idField] === updatedStock[idField]
      })
      if (updateIndex !== -1) {
        let newStocks = [...stocks]
        newStocks.splice(updateIndex, 1, updatedStock)
        setStocks(newStocks)
      }
    },
    [stocks]
  )

  const removeStock = useCallback(
    stockTmpId => {
      const removeIndex = stocks.findIndex(stock => stock.tmpId && stock.tmpId === stockTmpId)
      if (removeIndex !== -1) {
        let newStocks = [...stocks]
        newStocks.splice(removeIndex, 1)
        setStocks(newStocks)
      }
    },
    [stocks]
  )

  const submitForm = useCallback(() => {
    // TODO (rlecellier) : editable stocks should be computed here in order post only editable ones to the api.

    pcapi
      .bulkCreateOrEditStock(offer.id, stocks)
      .then(async () => {
        const nbExistingStocks = stocks.filter(stock => stock.id !== undefined).length
        await getOffer()
        notifySuccess(
          nbExistingStocks > 0
            ? 'Si la date de l’évènement a été modifiée, les utilisateurs ayant déjà réservé cette offre seront prévenus par email.'
            : ''
        )
      })
      .catch(errors => {
        const submitErrors = {
          global: 'Impossible de modifier le stock.',
          ...('errors' in errors ? errors.errors : []),
        }
        notifyErrors(Object.values(submitErrors))
        console.log('submitErrors', errors, submitErrors)

        // @TODO(rlecellier) set children form errors
        // setFormErrors(submitErrors)
      })
  }, [getOffer, notifyErrors, notifySuccess, offer.id, stocks])

  const eventCancellationInformation =
    'Les utilisateurs ont un délai de 48h pour annuler leur réservation mais ne peuvent pas le faire moins de 48h avant le début de l’événement. Si la date limite de réservation n’est pas encore passée, la place est alors automatiquement remise en vente.'

  const thingCancellationInformation =
    'Les utilisateurs ont 30 jours pour faire valider leur contremarque. Passé ce délai, la réservation est automatiquement annulée et l’offre remise en vente.'

  const hasOfferThingOneStockAlready = !isEvent && stocks.length > 0

  return (
    <div className="stocks-page">
      <PageTitle title="Vos stocks" />
      <h3 className="section-title">
        {'Stock et prix'}
      </h3>

      <div className="cancellation-information">
        {isEvent ? eventCancellationInformation : thingCancellationInformation}
      </div>
      <button
        className="tertiary-button"
        disabled={hasOfferThingOneStockAlready || isOfferSynchronized}
        onClick={addNewStock}
        type="button"
      >
        <Icon svg="ico-plus" />
        {isEvent ? 'Ajouter une date' : 'Ajouter un stock'}
      </button>
      <table>
        <thead>
          <tr>
            {isEvent && (
              <Fragment>
                <th>
                  {'Date'}
                </th>
                <th>
                  {'Horaire'}
                </th>
              </Fragment>
            )}
            <th>
              {'Prix'}
            </th>
            <th>
              {'Date limite de réservation'}
            </th>
            <th>
              {'Quantité'}
            </th>
            <th>
              {'Stock restant'}
            </th>
            <th>
              {'Réservations'}
            </th>
            <th className="action-column">
              {'Supprimer'}
            </th>
          </tr>
        </thead>
        <tbody>
          {stocks.map(stock => (
            <StockItemContainer
              departmentCode={departmentCode}
              isEvent={isEvent}
              isNewStock={Boolean(stock.tmpId)}
              isOfferSynchronized={isOfferSynchronized}
              key={stock.id ? stock.id : stock.tmpId}
              offerId={offerId}
              onChange={updateStock}
              onRemove={removeStock}
              refreshOffer={getOffer}
              stock={stock}
            />
          ))}
        </tbody>
      </table>
      <section className="actions-section">
        <Link
          className="secondary-button"
          to="/offres/"
        >
          {'Annuler et quitter'}
        </Link>
        <button
          className="primary-button"
          onClick={submitForm}
          type="button"
        >
          {'Enregistrer'}
        </button>
      </section>
    </div>
  )
}

Stocks.propTypes = {
  notifyErrors: PropTypes.func.isRequired,
  notifySuccess: PropTypes.func.isRequired,
  offer: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
}

export default Stocks
