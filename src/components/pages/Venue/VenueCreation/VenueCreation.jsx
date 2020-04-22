import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Form } from 'react-final-form'
import { getCanSubmit, parseSubmitErrors, removeWhitespaces } from 'react-final-form-utils'
import Main from '../../../layout/Main'
import Titles from '../../../layout/Titles/Titles'
import ModifyOrCancelControl from '../controls/ModifyOrCancelControl/ModifyOrCancelControl'
import ReturnOrSubmitControl from '../controls/ReturnOrSubmitControl/ReturnOrSubmitControl'

import BankFieldsContainer from '../VenueEdition/BankInformation/BankInformationLegacy/BankFieldsContainer'
import bindGetSiretInformationToSiret from '../fields/IdentifierFields/decorators/bindGetSiretInformationToSiret'
import IdentifierFields from '../fields/IdentifierFields/IdentifierFields'
import bindGetSuggestionsToLatitude from '../fields/LocationFields/decorators/bindGetSuggestionsToLatitude'
import bindGetSuggestionsToLongitude from '../fields/LocationFields/decorators/bindGetSuggestionsToLongitude'
import LocationFields from '../fields/LocationFields/LocationFields'
import { FRANCE_POSITION } from '../fields/LocationFields/utils/positions'
import VenueType from '../ValueObjects/VenueType'

const noop = () => {
}

class VenueCreation extends PureComponent {
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
      handleSubmitRequestSuccess,
      history,
      match: {
        params: { offererId },
      },
      trackCreateVenue,
    } = this.props

    const nextState = { isRequestPending: false }

    this.setState(nextState, () => {
      handleSubmitRequestSuccess(state, action)
      formResolver()
    })

    const createdVenueId = action.payload.datum.id

    history.push(`/structures/${offererId}`)
    trackCreateVenue(createdVenueId)
  }

  handleOnFormSubmit = formValues => {
    const { handleSubmitRequest } = this.props

    this.setState({ isRequestPending: true })

    return new Promise(resolve => {
      handleSubmitRequest({
        formValues,
        handleFail: this.handleFormFail(resolve),
        handleSuccess: this.handleFormSuccess(resolve),
      })
    })
  }

  onHandleRender = formProps => {
    const {
      formInitialValues,
      history,
      match: {
        params: { offererId, venueId },
      },
      venueTypes,
    } = this.props
    const { isRequestPending } = this.state
    const readOnly = false

    const { bic, iban, siret: initialSiret, venueTypeId } = formInitialValues || {}

    const canSubmit = getCanSubmit(formProps)
    const { form, handleSubmit, values } = formProps
    const {
      isLocationFrozen: formIsLocationFrozen,
      latitude: formLatitude,
      longitude: formLongitude,
      siret: formSiret,
    } = values

    const siretValidOnCreation = formSiret && removeWhitespaces(formSiret).length === 14

    const areBankInformationProvided = bic && iban
    return (
      <form
        name="venue"
        onSubmit={handleSubmit}
      >
        <IdentifierFields
          fieldReadOnlyBecauseFrozenFormSiret={siretValidOnCreation}
          formSiret={formSiret}
          initialSiret={initialSiret}
          isCreatedEntity
          readOnly={readOnly}
          venueTypeId={venueTypeId}
          venueTypes={venueTypes}
        />
        <BankFieldsContainer
          areBankInformationProvided={areBankInformationProvided}
          readOnly={readOnly}
        />
        <LocationFields
          fieldReadOnlyBecauseFrozenFormSiret={siretValidOnCreation}
          form={form}
          formIsLocationFrozen={formIsLocationFrozen}
          formLatitude={formLatitude === '' ? FRANCE_POSITION.latitude : formLatitude}
          formLongitude={formLongitude === '' ? FRANCE_POSITION.longitude : formLongitude}
          readOnly={readOnly}
        />
        <hr />
        <div
          className="field is-grouped is-grouped-centered"
          style={{ justifyContent: 'space-between' }}
        >
          <ModifyOrCancelControl
            form={form}
            history={history}
            isCreatedEntity
            offererId={offererId}
            readOnly={readOnly}
            venueId={venueId}
          />
          <ReturnOrSubmitControl
            canSubmit={canSubmit}
            isCreatedEntity
            isRequestPending={isRequestPending}
            offererId={offererId}
            readOnly={readOnly}
          />
        </div>
      </form>
    )
  }

  render() {
    const {
      formInitialValues,
      match: {
        params: { offererId },
      },
      offerer,
    } = this.props

    const { name: offererName } = offerer || {}
    const { isVirtual: initialIsVirtual, name: initialName } = formInitialValues || {}

    const decorators = [
      bindGetSuggestionsToLatitude,
      bindGetSuggestionsToLongitude,
      bindGetSiretInformationToSiret,
    ]

    const showForm = !initialIsVirtual && typeof offerer !== 'undefined'

    return (
      <Main
        backTo={this.buildBackToInfos(offererName, initialName, offererId)}
        handleDataRequest={noop}
        name="venue"
      >
        <Titles
          subtitle={initialName}
          title="Lieu"
        />
        <p className="advice">
          {'Ajoutez un lieu où accéder à vos offres.'}
        </p>

        {showForm && (
          <Form
            decorators={decorators}
            initialValues={formInitialValues}
            name="venue"
            onSubmit={this.handleOnFormSubmit}
            render={this.onHandleRender}
          />
        )}
      </Main>
    )
  }
}

VenueCreation.propTypes = {
  formInitialValues: PropTypes.shape().isRequired,
  handleInitialRequest: PropTypes.func.isRequired,
  handleSubmitRequest: PropTypes.func.isRequired,
  handleSubmitRequestFail: PropTypes.func.isRequired,
  handleSubmitRequestSuccess: PropTypes.func.isRequired,
  history: PropTypes.shape().isRequired,
  offerer: PropTypes.shape().isRequired,
  trackCreateVenue: PropTypes.func.isRequired,
  venueTypes: PropTypes.arrayOf(PropTypes.instanceOf(VenueType)).isRequired,
}

export default VenueCreation
