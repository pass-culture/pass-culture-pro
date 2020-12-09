import React, { useCallback, useEffect } from 'react'

import Icon from 'components/layout/Icon'
import StocksManagerContainer from 'components/pages/Offer/StocksManager/StocksManagerContainer'
import { showModal } from 'store/reducers/modal'
import { pluralize } from 'utils/pluralize'
import { parse as parseQueryString, stringify } from 'utils/query-string'

const StockButton = props => {
  const { disabled, dispatch, history, offer, offerTypeType, stocks } = props
  const queryParams = parseQueryString(window.location.search)

  const openStockModal = useCallback(() => {
    const stockModal = (
      <StocksManagerContainer
        offer={offer}
        offerId={offer.id}
        selfInit
      />
    )
    dispatch(showModal(stockModal, { isUnclosable: true }))
  }, [dispatch, offer])

  useEffect(() => {
    if ('gestion' in queryParams) {
      openStockModal()
    }
  }, [openStockModal, queryParams])

  const handleOnClick = useCallback(
    event => {
      event.preventDefault()
      const search = { ...queryParams, gestion: '' }
      const stockUrl = `${window.location.pathname}?${stringify(search)}`
      history.push(stockUrl)
      openStockModal()
    },
    [history, openStockModal, queryParams]
  )

  const nbStocks = stocks ? stocks.length : 0
  const isEvent = offerTypeType === 'Event'

  return (
    <div className="form-row">
      <div className="field-label">
        <label htmlFor="input_offers_name">
          <div className="subtitle">
            {isEvent ? 'Dates :' : 'Stocks :'}
          </div>
        </label>
      </div>
      <div className="field-body">
        <div
          className="control"
          style={{ paddingTop: '0.25rem' }}
        >
          <span
            className="nb-dates"
            style={{ paddingTop: '0.25rem' }}
          >
            {pluralize(nbStocks, isEvent ? 'date' : 'stock')}
          </span>
          <button
            className="button is-primary is-outlined is-small manage-stock"
            disabled={disabled ? 'disabled' : ''}
            id="manage-stocks"
            onClick={handleOnClick}
            type="button"
          >
            <span className="icon">
              <Icon svg="ico-calendar-red" />
            </span>
            <span>
              {isEvent ? 'Gérer les dates et les stocks' : 'Gérer les stocks'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default StockButton
