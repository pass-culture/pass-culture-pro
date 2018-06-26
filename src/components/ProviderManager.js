import get from 'lodash.get'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { compose } from 'redux'

import FormField from './layout/FormField'
import Icon from './layout/Icon'
import SubmitButton from './layout/SubmitButton'
import VenueProviderItem from './VenueProviderItem'
import { requestData } from '../reducers/data'
import { mergeForm } from '../reducers/form'
import selectCurrentVenue from '../selectors/currentVenue'
import selectProviderOptions from '../selectors/providerOptions'
import selectSelectedProvider from '../selectors/selectedProvider'
import selectCurrentVenueProviders from '../selectors/currentVenueProviders'
import { NEW } from '../utils/config'

class ProviderManager extends Component {

  constructor () {
    super()
    this.state = {
      withError: false
    }
  }

  static getDerivedStateFromProps(nextProps) {
    const {
      match: { params: { venueProviderId } }
    } = nextProps
    const isNew = venueProviderId === 'nouveau'
    return {
      isNew
    }
  }

  onAddClick = () => {
    const {
      history,
      match: { params: { offererId, venueId } }
    } = this.props
    history.push(`/structures/${offererId}/lieux/${venueId}/fournisseurs/nouveau`)
  }

  handleMergeForm = () => {
    const {
      match: { params: { venueId } },
      mergeForm
    } = this.props
    const { isNew } = this.state
    isNew && mergeForm('venueProviders', NEW, { venueId })
  }

  handleRequestData = () => {
    const {
      match: { params : { venueId } },
      requestData,
      user
    } = this.props
    if (!user) {
      return
    }
    requestData('GET', 'providers')
    requestData(
      'GET',
      `venueProviders?venueId=${venueId}`,
      {
        key: 'venueProviders',
      }
    )
  }

  handleSuccessData = () => {
    const {
      history,
      match: { params: { offererId, venueId } }
    } = this.props
    history.push(`/structures/${offererId}/lieux/${venueId}`)
  }

  componentDidMount () {
    const {
      match: { params: { venueProviderId } },
    } = this.props
    this.handleRequestData()
    venueProviderId === 'nouveau' && this.handleMergeForm()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.user !== this.props.user) {
      this.handleRequestData()
    }
    if (
      prevProps.match.params.venueProviderId === 'nouveau'
      || this.props.match.params.venueProviderId !== 'nouveau'
    ) {
      this.handleMergeForm()
    }
  }

  render () {
    const {
      selectedProvider,
      providerOptions,
      venue,
      venueProviders
    } = this.props
    const {
      identifierDescription,
      identifierRegexp,
    } = (selectedProvider || {})
    const {
      isNew,
      withError
    } = this.state

    const providerOptionsWithPlaceholder = get(providerOptions, 'length') > 1
      ? (
        [{
          label: "Source d'importation",
        }].concat(providerOptions)
      )
      : providerOptions

    return (
      <div className='section'>
        <h2 className='pc-list-title'>
          IMPORTATIONS D'OFFRES
          <span className='is-pulled-right is-size-7 has-text-grey'>
            Si vous avez plusieurs comptes auprès de la même source, ajoutez-les successivement.
          </span>
        </h2>
        <ul className='pc-list'>
          {
            venueProviders && venueProviders.map((vp, index) => (
                <VenueProviderItem
                  venue={venue}
                  venueProvider={vp}
                  key={vp.id}
                />
            ))
          }
          {
            isNew && (
              <li>
                {
                  withError && (
                    <p className={
                      withError ? 'has-text-weight-bold has-text-danger' : ''
                    }>
                      Il faut un identifiant ou celui-ci existe déjà
                    </p>
                  )
                }

                <div className='picto'><Icon svg='picto-db-default' /></div>
                <FormField
                  collectionName="venueProviders"
                  name="providerId"
                  options={providerOptionsWithPlaceholder}
                  required
                  type="select"
                  size="small"
                />
                {
                  selectedProvider && identifierRegexp && (
                    <FormField
                      collectionName="venueProviders"
                      name="venueIdAtOfferProvider"
                      placeholder="identifiant"
                      size="small"
                      title={identifierDescription}
                    />
                  )
                }
                {
                  selectedProvider && (
                    <SubmitButton
                      className="button is-secondary"
                      getBody={form => get(form, `venueProvidersById.${NEW}`)}
                      getIsDisabled={form =>
                        !get(form, `venueProvidersById.${NEW}.venueIdAtOfferProvider`)}
                      handleSuccess={this.handleSuccessData}
                      method="POST"
                      path="venueProviders"
                      storeKey="venueProviders"
                      text="Importer"
                    />
                  )
                }
              </li>
            )
          }
        </ul>
        <div className='has-text-centered'>
          <button className="button is-secondary"
            onClick={this.onAddClick}>
            + Importer des offres
          </button>
        </div>
      </div>
      )
  }
}

export default compose(
  withRouter,
  connect(
    (state, ownProps) => ({
      providerOptions: selectProviderOptions(state),
      providers: state.data.providers,
      selectedProvider: selectSelectedProvider(state, ownProps),
      user: state.user,
      venue: selectCurrentVenue(state, ownProps),
      venueProviders: selectCurrentVenueProviders(state, ownProps)
    }),
    { mergeForm, requestData }
  )
)(ProviderManager)
