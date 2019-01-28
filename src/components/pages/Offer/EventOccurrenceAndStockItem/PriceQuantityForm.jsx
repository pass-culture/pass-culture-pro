import { Field, Form, SubmitButton, Icon } from 'pass-culture-shared'
import React, { Component, Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import get from 'lodash.get'
import ReactTooltip from 'react-tooltip'

const floatSep = ','

function getFormName(stockPatch) {
  return `stock${get(stockPatch, 'id', '')}`
}

function getDisplayedPrice(value, { readOnly }) {
  if (value === 0) {
    if (readOnly) {
      return 'Gratuit'
    }
    return 0
  }
  if (readOnly) {
    let floatValue = value
    if (value && String(value).includes(floatSep)) {
      floatValue = parseFloat(value.replace(/,/, '.')).toFixed(2)
    }
    let floatValueString = `${floatValue} €`
    if (floatSep === ',') {
      floatValueString = floatValueString.replace('.', ',')
    }
    return floatValueString
  }

  if (value === ' ') {
    return 0
  }

  return value
}

class PriceQuantityForm extends Component {
  componentDidUpdate() {
    ReactTooltip.rebuild()
  }

  handleOfferSuccessData = (state, action) => {
    const { history, offer } = this.props
    history.push(`/offres/${get(offer, 'id')}?gestion`)
  }

  onPriceBlur = event => {
    const { closeInfo, formPrice, hasIban, showInfo } = this.props
    if (hasIban || !formPrice) {
      return
    }
    const inputElement = document.querySelector('input[name="price"]')
    inputElement.focus()

    showInfo(
      <Fragment>
        <div className="mb12">
          Vous avez saisi une offre payante. Pensez à demander à
          l'administrateur financier nommé pour votre structure de renseigner
          son IBAN. Sans IBAN, les réservations de vos offres éligibles ne vous
          seront pas remboursées
        </div>
        <div className="has-text-centered">
          <button className="button is-primary" onClick={closeInfo}>
            J'ai compris
          </button>
        </div>
      </Fragment>
    )
  }

  componentWillUnmount() {
    this.props.closeInfo()
  }

  render() {
    const {
      isStockOnly,
      offer,
      stockPatch,
      isStockReadOnly,
      beginningDatetime,
    } = this.props

    return (
      <Form
        action={`/stocks/${get(stockPatch, 'id', '')}`}
        BlockComponent={null}
        handleSuccess={this.handleOfferSuccessData}
        layout="input-only"
        key={1}
        name={getFormName(stockPatch)}
        patch={stockPatch}
        size="small"
        readOnly={isStockReadOnly}
        Tag={null}>
        <Fragment>
          <td title="Gratuit si vide">
            <Field name="eventOccurrenceId" type="hidden" />
            <Field name="offerId" type="hidden" />
            <Field
              className="input is-small input-number"
              displayValue={getDisplayedPrice}
              floatSep={floatSep}
              min="0"
              name="price"
              onBlur={this.onPriceBlur}
              placeholder="Gratuit"
              title="Prix"
              type={isStockReadOnly ? 'text' : 'number'}
            />
          </td>
          <td title="Laissez vide si pas de limite">
            <Field
              maxDate={isStockOnly ? undefined : beginningDatetime}
              name="bookingLimitDatetime"
              placeholder="Laissez vide si pas de limite"
              type="date"
            />
          </td>
          <td className="tooltiped">
            <Field
              name="available"
              title="Places disponibles"
              type={isStockReadOnly ? 'text' : 'number'}
              placeholder="Illimité"
              className="input is-small input-number"
              renderInfo={() => {
                if (!isStockReadOnly) {
                  return (
                    <span
                      className="button tooltip qty-info"
                      data-place="bottom"
                      data-tip="<p>Laissez ce champ vide pour un nombre de places illimité.</p>"
                      data-type="info">
                      <Icon svg="picto-info" />
                    </span>
                  )
                }
              }}
            />
          </td>
          {!isStockReadOnly && (
            <Fragment>
              <td>
                <SubmitButton className="button is-primary is-small submitStep">
                  Valider
                </SubmitButton>
              </td>
              <td className="is-clipped">
                <NavLink
                  className="button is-secondary is-small cancel-step"
                  to={`/offres/${get(offer, 'id')}?gestion`}>
                  Annuler
                </NavLink>
              </td>
            </Fragment>
          )}
        </Fragment>
      </Form>
    )
  }
}

export default PriceQuantityForm
