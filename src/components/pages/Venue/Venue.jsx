import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Form } from 'react-final-form'
import {
  getCanSubmit,
  parseSubmitErrors,
  removeWhitespaces,
} from 'react-final-form-utils'
import { NavLink } from 'react-router-dom'

import BankFieldsContainer from './BankFields/BankFieldsContainer'
import CreateOfferControl from './CreateOfferControl'
import LocationFields from './LocationFields/LocationFields'
import {
  bindGetSuggestionsToLatitude,
  bindGetSuggestionsToLongitude,
} from './LocationFields/decorators'
import { FRANCE_POSITION } from './LocationFields/utils/positions'
import IdentifierFields from './IdentifierFields/IdentifierFields'
import { bindGetSiretInfoToSiret } from './IdentifierFields/decorators'
import ModifyOrCancelControl from './controls/ModifyOrCancelControl/ModifyOrCancelControl'
import ReturnOrSubmitControl from './controls/ReturnOrSubmitControl/ReturnOrSubmitControl'
import VenueProvidersManagerContainer from './VenueProvidersManager/VenueProvidersManagerContainer'
import HeroSection from 'components/layout/HeroSection'
import Icon from 'components/layout/Icon'
import Main from 'components/layout/Main'

const noop = () => {}

class Venue extends Component {
  constructor() {
    super()
    this.state = { isRequestPending: false }
  }

  componentDidMount() {
    const { handleInitialRequest } = this.props
    handleInitialRequest()
  }

  buildBackToInfos = (offererName, initialName, offererId) => {
    return {
      label: offererName === initialName ? 'STRUCTURE' : offererName,
      path: `/structures/${offererId}`,
    }
  }

  checkIfVenueExists = initialVenueId => {
    return !!initialVenueId
  }

  handleFormFail = formResolver => (state, action) => {
    const { handleSubmitRequestFail } = this.props
    const { payload } = action
    const nextState = { isRequestPending: false }
    const errors = parseSubmitErrors(payload.errors)
    handleSubmitRequestFail(state, action)
    this.setState(nextState, () => formResolver(errors))
  }

  handleFormSuccess = formResolver => (state, action) => {
    const {
      formInitialValues,
      handleSubmitRequestSuccess,
      history,
      match: {
        params: { offererId },
      },
      query,
    } = this.props
    const { id: venueId } = formInitialValues
    const nextState = { isRequestPending: false }
    const { isCreatedEntity } = query.context({ id: venueId })

    this.setState(nextState, () => {
      handleSubmitRequestSuccess(state, action)
      if (isCreatedEntity) {
        history.push(`/structures/${offererId}`)
      } else {
        query.changeToReadOnly(null, { id: venueId })
      }

      formResolver()
    })
  }

  onFormSubmit = formValues => {
    const { handleSubmitRequest } = this.props

    this.setState({ isRequestPending: true })

    const formSubmitPromise = new Promise(resolve => {
      handleSubmitRequest({
        formValues,
        handleFail: this.handleFormFail(resolve),
        handleSuccess: this.handleFormSuccess(resolve),
      })
    })

    return formSubmitPromise
  }

  render() {
    const {
      formInitialValues,
      match: {
        params: { offererId, venueId },
      },
      query,
      offerer,
    } = this.props

    const { name: offererName } = offerer || {}
    const {
      iban: initialIban,
      id: initialId,
      isVirtual: initialIsVirtual,
      name: initialName,
      siret: initialSiret,
      thumbCount: initialThumbCount,
    } = formInitialValues || {}
    const { isCreatedEntity, isModifiedEntity, readOnly } = query.context({
      id: venueId,
    })
    const { isRequestPending } = this.state

    const decorators = [
      bindGetSuggestionsToLatitude,
      bindGetSuggestionsToLongitude,
    ]
    if (isCreatedEntity || !initialSiret) {
      decorators.push(bindGetSiretInfoToSiret)
    }

    const showForm = !initialIsVirtual && typeof offerer !== 'undefined'

    return (
      <Main
        backTo={this.buildBackToInfos(offererName, initialName, offererId)}
        name="venue"
        handleDataRequest={noop}>
        <HeroSection subtitle={initialName} title="Lieu">
          {isCreatedEntity && (
            <p className="subtitle">Ajoutez un lieu où accéder à vos offres.</p>
          )}

          {this.checkIfVenueExists(initialId) && !isCreatedEntity && (
            <NavLink
              to={`/offres/creation?lieu=${initialId}`}
              className="cta button is-primary">
              <span className="icon">
                <Icon svg="ico-offres-w" />
              </span>
              <span>Créer une offre</span>
            </NavLink>
          )}
        </HeroSection>

        {!isCreatedEntity && (
          <VenueProvidersManagerContainer venue={formInitialValues} />
        )}

        {showForm && (
          <Form
            decorators={decorators}
            initialValues={formInitialValues}
            name="venue"
            onSubmit={this.onFormSubmit}
            render={formProps => {
              const canSubmit = getCanSubmit(formProps)
              const { form, handleSubmit, values } = formProps
              const {
                isLocationFrozen: formIsLocationFrozen,
                latitude: formLatitude,
                longitude: formLongitude,
                siret: formSiret,
              } = values

              const siretValidOnReadOnly =
                formSiret && removeWhitespaces(formSiret).length === 14

              const siretValidOnCreation = siretValidOnReadOnly
              const fieldReadOnlyBecauseFrozenFormSiretOnCreation =
                isCreatedEntity && siretValidOnCreation

              const siretValidOnModification =
                typeof initialSiret !== 'undefined'
              const fieldReadOnlyBecauseFrozenFormSiretOnModification =
                isModifiedEntity && siretValidOnModification

              const fieldReadOnlyBecauseFrozenFormSiret =
                fieldReadOnlyBecauseFrozenFormSiretOnCreation ||
                fieldReadOnlyBecauseFrozenFormSiretOnModification

              return (
                <form onSubmit={handleSubmit} name="venue">
                  <IdentifierFields
                    fieldReadOnlyBecauseFrozenFormSiret={
                      fieldReadOnlyBecauseFrozenFormSiret
                    }
                    formSiret={formSiret}
                    initialSiret={initialSiret}
                    isCreatedEntity={isCreatedEntity}
                    isModifiedEntity={isModifiedEntity}
                    readOnly={readOnly}
                  />
                  <BankFieldsContainer
                    initialIban={initialIban}
                    initialThumbCount={initialThumbCount}
                    readOnly={readOnly}
                  />
                  <LocationFields
                    fieldReadOnlyBecauseFrozenFormSiret={
                      fieldReadOnlyBecauseFrozenFormSiret
                    }
                    form={form}
                    formIsLocationFrozen={formIsLocationFrozen}
                    formLatitude={
                      formLatitude === ''
                        ? FRANCE_POSITION.latitude
                        : formLatitude
                    }
                    formLongitude={
                      formLongitude === ''
                        ? FRANCE_POSITION.longitude
                        : formLongitude
                    }
                    readOnly={readOnly}
                  />
                  <hr />
                  <div
                    className="field is-grouped is-grouped-centered"
                    style={{ justifyContent: 'space-between' }}>
                    <ModifyOrCancelControl
                      isCreatedEntity={isCreatedEntity}
                      offererId={offererId}
                      venueId={venueId}
                      readOnly={readOnly}
                    />
                    {readOnly && <CreateOfferControl venueId={venueId} />}
                    <ReturnOrSubmitControl
                      canSubmit={canSubmit}
                      isCreatedEntity={isCreatedEntity}
                      isRequestPending={isRequestPending}
                      offererId={offererId}
                      readOnly={readOnly}
                    />
                  </div>
                </form>
              )
            }}
          />
        )}
      </Main>
    )
  }
}

Venue.propTypes = {
  handleInitialRequest: PropTypes.func.isRequired,
  handleSubmitRequest: PropTypes.func.isRequired,
  handleSubmitRequestFail: PropTypes.func.isRequired,
  handleSubmitRequestSuccess: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  query: PropTypes.object.isRequired,
}

export default Venue
