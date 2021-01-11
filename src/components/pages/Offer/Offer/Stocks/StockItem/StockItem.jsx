import moment from 'moment'
import PropTypes from 'prop-types'
import React, { Fragment, useCallback, useEffect, useState } from 'react'

import Icon from 'components/layout/Icon'
import DateInput from 'components/layout/inputs/DateInput/DateInput'
import TimeInput from 'components/layout/inputs/TimeInput/TimeInput'
import DeleteStockDialogContainer from 'components/pages/Offer/Offer/Stocks/DeleteStockDialog/DeleteStockDialogContainer'

const StockItem = ({
  departmentCode,
  isEvent,
  isNewStock,
  isOfferSynchronized,
  notifyError,
  offerId,
  onChange,
  onRemove,
  refreshOffer,
  stock,
}) => {
  const today = new Date().toISOString()
  const [formErrors, setFormErrors] = useState({})
  const [isDeleting, setIsDeleting] = useState(false)
  const [beginningDatetime, setBeginningDatetime] = useState(stock.beginningDatetime)
  const [bookingLimitDatetime, setBookingLimitDatetime] = useState(stock.bookingLimitDatetime)
  const [price, setPrice] = useState(stock.price)
  const [totalQuantity, setTotalQuantity] = useState(stock.quantity)

  useEffect(() => {
    setBeginningDatetime(stock.beginningDatetime)
    setBookingLimitDatetime(stock.bookingLimitDatetime)
    setPrice(stock.price)
    setTotalQuantity(stock.quantity)
  }, [stock.beginningDatetime, stock.bookingLimitDatetime, stock.price, stock.quantity])

  const getSelectedDatetime = useCallback(
    momentDateTime => {
      if (momentDateTime.creationData().format === 'HH:mm') {
        const momentBeginningDatetime = moment(beginningDatetime)
        momentBeginningDatetime.hours(momentDateTime.hours())
        momentBeginningDatetime.minutes(momentDateTime.minutes())

        return momentBeginningDatetime.utc().format()
      }
      return momentDateTime.utc().format()
    },
    [beginningDatetime]
  )

  const changeBeginningDatetime = useCallback(
    momentDateTime => {
      if (momentDateTime) {
        const selectedDatetime = getSelectedDatetime(momentDateTime)
        setBeginningDatetime(selectedDatetime)
        bookingLimitDatetime > selectedDatetime && setBookingLimitDatetime(selectedDatetime)
      } else {
        setBeginningDatetime('')
      }
    },
    [bookingLimitDatetime, getSelectedDatetime]
  )

  const changeBookingLimitDatetime = useCallback(momentDateTime => {
    const utcDateIsoFormat = momentDateTime ? momentDateTime.utc().format() : ''
    console.log('utcDateIsoFormat', utcDateIsoFormat)
    setBookingLimitDatetime(utcDateIsoFormat)
  }, [])

  const getBookingLimitDatetimeForEvent = useCallback(() => {
    const momentBookingLimitDatetime = moment(bookingLimitDatetime)
    if (
      bookingLimitDatetime === '' ||
      momentBookingLimitDatetime.isSame(beginningDatetime, 'day')
    ) {
      return beginningDatetime
    } else {
      return momentBookingLimitDatetime.utc().endOf('day').format()
    }
  }, [bookingLimitDatetime, beginningDatetime])

  const getBookingLimitDatetimeForThing = useCallback(() => {
    if (bookingLimitDatetime) {
      return moment(bookingLimitDatetime).utc().endOf('day').format()
    }
    return null
  }, [bookingLimitDatetime])

  const changePrice = useCallback(event => {
    setPrice(event.target.value)
  }, [])

  const changeTotalQuantity = useCallback(event => {
    setTotalQuantity(event.target.value)
  }, [])

  const askDeletionConfirmation = useCallback(() => {
    setIsDeleting(true)
  }, [])

  const priceValue = price !== 0 ? price : ''
  const totalQuantityValue = totalQuantity !== null ? totalQuantity : ''
  const computedRemainingQuantity = totalQuantityValue - stock.bookingsQuantity
  const remainingQuantityValue = totalQuantityValue !== '' ? computedRemainingQuantity : 'Illimité'
  const isEventStockEditable = isNewStock || beginningDatetime > today
  const isThingStockEditable = !isOfferSynchronized
  const isStockEditable = isEvent ? isEventStockEditable : isThingStockEditable
  const isStockDeletable = isNewStock || (isEvent ? stock.isEventDeletable : !isOfferSynchronized)

  const isValid = useCallback(() => {
    let errors = []

    if (price < 0) {
      errors['price'] = 'Le prix doit être positif.'
    }

    if (totalQuantity < 0) {
      errors['quantity'] = 'La quantité doit être positive.'
    }

    if (!isNewStock && remainingQuantityValue < 0) {
      const missingQuantityMessage =
        'La quantité ne peut être inférieure au nombre de réservations.'
      if ('quantity' in errors) {
        errors['quantity'] = `${errors['quantity']}\n${missingQuantityMessage}`
      } else {
        errors['quantity'] = missingQuantityMessage
      }
    }

    const hasErrors = Object.values(errors).length > 0

    if (hasErrors) {
      const formErrors = {
        global: isNewStock ? 'Impossible d’ajouter le stock.' : 'Impossible de modifier le stock.',
        ...errors,
      }
      setFormErrors(formErrors)
    }

    return !hasErrors
  }, [isNewStock, price, remainingQuantityValue, setFormErrors, totalQuantity])

  useEffect(() => {
    let updatedStock = {
      price: price ? parseInt(price) : 0,
      quantity: totalQuantity ? parseInt(totalQuantity) : null,
      bookingLimitDatetime: getBookingLimitDatetimeForEvent(),
    }

    if (isNewStock) {
      updatedStock.tmpId = stock.tmpId
      updatedStock.offerId = offerId
    } else {
      updatedStock.id = stock.id
    }

    if (isEvent) {
      updatedStock.beginningDatetime = beginningDatetime
    }

    let hasChange = false
    Object.keys(stock).forEach(
      field => (hasChange = hasChange || stock[field] !== updatedStock[field])
    )

    if (hasChange && isValid()) {
      onChange(updatedStock)
    }
  }, [
    beginningDatetime,
    getBookingLimitDatetimeForEvent,
    getBookingLimitDatetimeForThing,
    isEvent,
    isNewStock,
    isValid,
    onChange,
    offerId,
    price,
    stock,
    totalQuantity,
  ])

  useEffect(() => {
    const errorMessages = Object.values(formErrors)
    if (errorMessages.length > 0) {
      notifyError(errorMessages)
    }
  }, [formErrors, notifyError])

  const removeNewStockLine = useCallback(() => {
    onRemove(stock.tmpId)
  }, [onRemove, stock.tmpId])

  return (
    <tr>
      {isEvent && (
        <Fragment>
          <td className="regular-input">
            <DateInput
              ariaLabel="Date de l’événement"
              departmentCode={departmentCode}
              disabled={!isStockEditable || isDeleting || isOfferSynchronized}
              minUtcDateIsoFormat={today}
              onChange={changeBeginningDatetime}
              openingUtcDateIsoFormat={today}
              stock={stock}
              utcDateIsoFormat={beginningDatetime}
            />
          </td>
          <td className="small-input">
            <TimeInput
              ariaLabel="Heure de l’événement"
              departmentCode={departmentCode}
              disabled={!isStockEditable || isDeleting || isOfferSynchronized}
              onChange={changeBeginningDatetime}
              stock={stock}
              utcDateIsoFormat={beginningDatetime}
            />
          </td>
        </Fragment>
      )}
      <td className="small-input input-text">
        <input
          aria-label="Prix"
          className={`it-input ${priceValue ? 'with-euro-icon' : ''} ${
            'price' in formErrors ? 'error' : ''
          }`}
          disabled={!isStockEditable || isDeleting}
          name="price"
          onChange={changePrice}
          placeholder="Gratuit"
          type="number"
          value={priceValue}
        />
      </td>
      <td className={`${isEvent ? 'regular-input' : 'large-input'}`}>
        <DateInput
          ariaLabel="Date limite de réservation"
          departmentCode={departmentCode}
          disabled={!isStockEditable || isDeleting}
          maxUtcDateIsoFormat={beginningDatetime}
          onChange={changeBookingLimitDatetime}
          openingUtcDateIsoFormat={today}
          stock={stock}
          utcDateIsoFormat={bookingLimitDatetime}
        />
      </td>
      <td className="small-input input-text">
        <input
          aria-label="Quantité"
          className={`it-input ${'quantity' in formErrors ? 'error' : ''}`}
          disabled={!isStockEditable || isDeleting}
          name="quantity"
          onChange={changeTotalQuantity}
          placeholder="Illimité"
          type="number"
          value={totalQuantityValue}
        />
      </td>
      <td>
        {!isNewStock && remainingQuantityValue}
      </td>
      <td>
        {!isNewStock && stock.bookingsQuantity}
      </td>
      <td className="action-column">
        <button
          className="secondary-button"
          disabled={!isStockDeletable || isDeleting}
          onClick={isNewStock ? removeNewStockLine : askDeletionConfirmation}
          type="button"
        >
          <Icon
            alt="Supprimer le stock"
            svg="ico-close-r"
          />
        </button>
        {isDeleting && (
          <DeleteStockDialogContainer
            refreshOffer={refreshOffer}
            setIsDeleting={setIsDeleting}
            stockId={stock.id}
          />
        )}
      </td>
    </tr>
  )
}

StockItem.defaultProps = {
  isNewStock: false,
  stock: {
    bookingsQuantity: 0,
    isEventDeletable: false,
    beginningDatetime: '',
    bookingLimitDatetime: '',
    price: 0,
    quantity: null,
  },
}

StockItem.propTypes = {
  departmentCode: PropTypes.string.isRequired,
  isEvent: PropTypes.bool.isRequired,
  isNewStock: PropTypes.bool,
  isOfferSynchronized: PropTypes.bool.isRequired,
  notifyError: PropTypes.func.isRequired,
  offerId: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  refreshOffer: PropTypes.func.isRequired,
  stock: PropTypes.shape({
    id: PropTypes.string,
    tmpId: PropTypes.string,
    bookingsQuantity: PropTypes.number.isRequired,
    isEventDeletable: PropTypes.bool.isRequired,
    beginningDatetime: PropTypes.string,
    bookingLimitDatetime: PropTypes.string,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number,
  }),
}

export default StockItem
