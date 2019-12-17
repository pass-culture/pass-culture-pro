import classNames from 'classnames'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import TextField from '../../../../layout/form/fields/TextField'
import NumberField from '../../../../layout/form/fields/NumberField'
import Icon from '../../../../layout/Icon'
import { Form } from 'react-final-form'
import SynchronisationConfirmationModal from './SynchronisationConfirmationModal/SynchronisationConfirmationModal'

class AllocineProviderForm extends PureComponent {
  constructor() {
    super()
    this.state = {
      isLoadingMode: false,
      isShowingConfirmationModal: false,
    }
  }

  handleSubmit = (formValues, form) => {
    this.hideModal()
    const { createVenueProvider, providerId, venueId } = this.props
    const { venueIdAtOfferProvider, price } = formValues

    const payload = {
      price,
      providerId,
      venueId,
      venueIdAtOfferProvider,
    }

    this.setState({ isLoadingMode: true })

    createVenueProvider(this.handleFail(form), this.handleSuccess, payload)
  }

  handleSuccess = () => {
    const {
      history,
      offererId,
      venueId
    } = this.props
    history.push(`/structures/${offererId}/lieux/${venueId}`)
  }

  handleFail = () => (state, action) => {
    const { notify } = this.props
    const {
      payload: { errors },
    } = action

    notify(errors)
  }

  handleShowModal = () => {
    this.setState({
      isShowingConfirmationModal: true,
    })
  }

  hideModal = () => {
    this.setState({
      isShowingConfirmationModal: false,
    })
  }

  renderForm = (props) => {
    const {venueIdAtOfferProviderIsRequired} = this.props
    const {isLoadingMode, isShowingConfirmationModal} = this.state

    return (
      <form onSubmit={props.handleSubmit}>
        <div className="allocine-provider-form">
          <div>
            <div className="compte-section">
              <div className="compte-section-label">
                <label
                  className="label-text"
                  htmlFor="venueIdAtOfferProvider"
                >
                  {'Compte'}
                </label>
                {!isLoadingMode && venueIdAtOfferProviderIsRequired && (
                  <span
                    className="tooltip tooltip-info"
                    data-place="bottom"
                    data-tip={`<p>Veuillez saisir un compte.</p>`}
                    id="compte-tooltip"
                  >
                    <Icon
                      alt="image d’aide à l’information"
                      svg="picto-info"
                    />
                  </span>
                )}
              </div>
              <TextField
                className={classNames('field-text', {
                  'field-is-read-only': !venueIdAtOfferProviderIsRequired || isLoadingMode,
                })}
                name="venueIdAtOfferProvider"
                readOnly={!venueIdAtOfferProviderIsRequired || isLoadingMode}
                required
              />

            </div>

            {!isLoadingMode && (
              <div className="price-section">
                <div className="price-section-label">
                  <label
                    className="label-prix"
                    htmlFor="price"
                  >
                    {'Prix de vente/place'}
                  </label>
                  <span
                    className="tooltip tooltip-info"
                    data-place="bottom"
                    data-tip={`<p>Prix de vente/place : Prix auquel la place de cinéma sera vendue</p>`}
                    id="price-tooltip"
                  >
                    <Icon
                      alt="image d’aide à l’information"
                      svg="picto-info"
                    />
                  </span>
                </div>
                <NumberField
                  className={classNames('field-text price-field')}
                  name="price"
                  placeholder="Ex : 12€"
                  required
                />

              </div>
            )}
          </div>

          {!isLoadingMode && (
            <div className="provider-import-button-container">
              <button
                className="button is-intermediate provider-import-button"
                onClick={this.handleShowModal}
                type="button"
              >
                {'Importer'}
              </button>
            </div>
          )}

          {isShowingConfirmationModal && (
            <SynchronisationConfirmationModal
              handleClose={this.hideModal}
              handleConfirm={props.handleSubmit}
            />
          )}
        </div>
      </form>
    )
  }

  render() {
    return (
      <Form
        onSubmit={this.handleSubmit}
        render={this.renderForm}
      />
    )
  }
}


AllocineProviderForm.propTypes = {
  history: PropTypes.shape().isRequired,
  notify: PropTypes.func.isRequired,
  providerId: PropTypes.string.isRequired,
  venueId: PropTypes.string.isRequired,
  venueIdAtOfferProviderIsRequired: PropTypes.bool.isRequired,
}

export default AllocineProviderForm
