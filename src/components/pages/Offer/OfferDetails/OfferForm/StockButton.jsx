import React, { useCallback } from 'react'

import Icon from 'components/layout/Icon'
import { pluralize } from 'utils/pluralize'

const StockButton = props => {
  const { disabled, offerTypeType, stocks } = props

  const handleOnClick = useCallback(event => {
    event.preventDefault()
    // TODO: use window.location and window history to remove query param "gestion"
    // or create a gestion route !!!
    // query.change({ gestion: '' })
  }, [])

  const nbStocks = stocks ? stocks.length : 0
  const isEvent = offerTypeType === 'Event'

  return (
    <div className="form-row">
      <div className="field-label">
        <label
          className="label"
          htmlFor="input_offers_name"
        >
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
