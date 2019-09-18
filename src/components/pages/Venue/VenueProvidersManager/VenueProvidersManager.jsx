import React, { Component } from 'react'
import { Form } from 'react-final-form'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'
import VenueProviderItem from './VenueProviderItem/VenueProviderItem'
import updateVenueIdAtOfferProvider from './decorators/updateVenueIdAtOfferProvider'
import { DEFAULT_PROVIDER_OPTION } from './utils/utils'
import VenueProviderForm from './form/VenueProviderForm/VenueProviderForm'

class VenueProvidersManager extends Component {
  static getDerivedStateFromProps(nextProps) {
    const {
      match: {
        params: { venueProviderId },
      },
    } = nextProps
    const isCreationMode = venueProviderId === 'nouveau'

    return {
      isCreationMode,
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      isCreationMode: false,
      isLoadingMode: false,
      isProviderSelected: false,
      venueIdAtOfferProviderIsRequired: true,
    }
  }

  componentDidMount() {
    const { loadProvidersAndVenueProviders } = this.props
    loadProvidersAndVenueProviders()
  }

  componentDidUpdate() {
    ReactTooltip.rebuild()
  }

  handleAddVenueProvider = () => {
    const {
      history,
      match: {
        params: { offererId, venueId },
      },
    } = this.props
    this.setState({
      isCreationMode: true,
    })
    history.push(`/structures/${offererId}/lieux/${venueId}/fournisseurs/nouveau`)
  }

  resetFormState = () => {
    this.setState({
      isCreationMode: false,
      isLoadingMode: false,
      isProviderSelected: false,
      venueIdAtOfferProviderIsRequired: true,
    })
  }

  handleSubmit = (formValues, form) => {
    const { createVenueProvider } = this.props
    this.setState({
      isLoadingMode: true,
    })
    const { id, provider, venueIdAtOfferProvider } = formValues
    const parsedProvider = JSON.parse(provider)

    const payload = {
      providerId: parsedProvider.id,
      venueIdAtOfferProvider,
      venueId: id,
    }

    createVenueProvider(this.handleFail(form), this.handleSuccess, payload)
  }

  handleSuccess = () => {
    const {
      history,
      match: {
        params: { offererId, venueId },
      },
    } = this.props
    history.push(`/structures/${offererId}/lieux/${venueId}`)
  }

  handleFail = form => (state, action) => {
    const { notify } = this.props
    const {
      payload: { errors },
    } = action

    notify(errors)
    this.resetFormInput(form)
    this.resetFormState()
  }

  resetFormInput = form => {
    form.batch(() => {
      form.change('provider', JSON.stringify(DEFAULT_PROVIDER_OPTION))
    })
  }

  handleChange = (event, input) => {
    const valueFromSelectInput = event.target.value
    const valueParsed = JSON.parse(valueFromSelectInput)

    if (valueParsed && valueParsed.id !== DEFAULT_PROVIDER_OPTION.id) {
      this.setState({
        isProviderSelected: true,
        venueIdAtOfferProviderIsRequired: valueParsed.requireProviderIdentifier,
      })
    } else {
      this.resetFormState()
    }
    input.onChange(valueFromSelectInput)
  }

  render() {
    const { providers, venue, venueProviders } = this.props
    const {
      isCreationMode,
      isLoadingMode,
      isProviderSelected,
      venueIdAtOfferProviderIsRequired,
    } = this.state
    const decorators = [updateVenueIdAtOfferProvider]
    const hasAtLeastOneProvider = providers.length > 0

    return (
      <div className="venue-providers-manager section">
        <h2 className="main-list-title">
          {'Importation d’offres'}
          <span className="is-pulled-right is-size-7 has-text-grey">
            {'Si vous avez plusieurs comptes auprès de la même source, ajoutez-les successivement.'}
          </span>
        </h2>

        <ul className="main-list">
          {venueProviders.map(venueProvider => (
            <VenueProviderItem
              key={venueProvider.id}
              venueProvider={venueProvider}
            />
          ))}

          {isCreationMode && (
            <li>
              <Form
                decorators={decorators}
                initialValues={venue}
                onSubmit={this.handleSubmit}
                render={VenueProviderForm({
                  handleChange: this.handleChange,
                  isProviderSelected,
                  isLoadingMode,
                  isCreationMode,
                  providers,
                  venueProviders,
                  venueIdAtOfferProviderIsRequired,
                })}
              />
            </li>
          )}
        </ul>

        {hasAtLeastOneProvider && (
          <div className="has-text-centered">
            <button
              className="button is-secondary"
              disabled={isCreationMode}
              id="add-venue-provider-btn"
              onClick={this.handleAddVenueProvider}
              type="button"
            >
              {'+ Importer des offres'}
            </button>
          </div>
        )}
      </div>
    )
  }
}

VenueProvidersManager.propTypes = {
  createVenueProvider: PropTypes.func.isRequired,
  history: PropTypes.shape().isRequired,
  loadProvidersAndVenueProviders: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape(),
  }).isRequired,
  notify: PropTypes.func.isRequired,
  providers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  venue: PropTypes.shape().isRequired,
  venueProviders: PropTypes.arrayOf(PropTypes.shape()).isRequired,
}

export default VenueProvidersManager
