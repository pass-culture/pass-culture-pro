import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Form } from 'react-final-form'
import { getCanSubmit, parseSubmitErrors } from 'react-final-form-utils'
import { Link } from 'react-router-dom'

import AppLayout from 'app/AppLayout'
import PageTitle from 'components/layout/PageTitle/PageTitle'
import Titles from 'components/layout/Titles/Titles'
import { ReactComponent as AddOfferSvg } from 'icons/ico-plus.svg'

import BankInformation from '../fields/BankInformationFields/BankInformationFields'
import VenueLabel from '../ValueObjects/VenueLabel'
import VenueType from '../ValueObjects/VenueType'

import ModifyOrCancelControl from './../controls/ModifyOrCancelControl/ModifyOrCancelControl'
import ReturnOrSubmitControl from './../controls/ReturnOrSubmitControl/ReturnOrSubmitControl'
import IdentifierFields from './../fields/IdentifierFields/IdentifierFields'
import bindGetSuggestionsToLatitude from './../fields/LocationFields/decorators/bindGetSuggestionsToLatitude'
import bindGetSuggestionsToLongitude from './../fields/LocationFields/decorators/bindGetSuggestionsToLongitude'
import LocationFields from './../fields/LocationFields/LocationFields'
import { FRANCE_POSITION } from './../fields/LocationFields/utils/positions'
import VenueProvidersManagerContainer from './VenueProvidersManager/VenueProvidersManagerContainer'

class VenueEdition extends PureComponent {
  constructor() {
    super()
    this.state = { isRequestPending: false }
  }

  componentDidMount() {
    const { handleInitialRequest } = this.props
    handleInitialRequest()
  }

  handleFormFail = formResolver => (_state, action) => {
    const { handleSubmitRequestFail } = this.props
    const { payload } = action
    const nextState = { isRequestPending: false }
    const errors = parseSubmitErrors(payload.errors)
    handleSubmitRequestFail(action)
    this.setState(nextState, () => formResolver(errors))
  }

  handleFormSuccess = formResolver => (_state, action) => {
    const { venue, handleSubmitRequestSuccess, query, trackModifyVenue } = this.props

    const { id: venueId } = venue

    this.setState({ isRequestPending: false }, () => {
      handleSubmitRequestSuccess(action)
      formResolver()
    })

    trackModifyVenue(venueId)
    query.changeToReadOnly(null)
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
      venue,
      history,
      match: {
        params: { offererId, venueId },
      },
      query,
      offerer,
      venueTypes,
      venueLabels,
    } = this.props
    const { isRequestPending } = this.state
    const { readOnly } = query.context({
      id: venueId,
    })

    const { siret: initialSiret } = venue || {}

    const canSubmit = getCanSubmit(formProps)
    const { form, handleSubmit, values } = formProps
    const {
      isLocationFrozen: formIsLocationFrozen,
      latitude: formLatitude,
      longitude: formLongitude,
      siret: formSiret,
      venueTypeId,
      venueLabelId,
    } = values

    const siretValidOnModification = initialSiret !== null
    const fieldReadOnlyBecauseFrozenFormSiret = !readOnly && siretValidOnModification

    return (
      <form
        name="venue"
        onSubmit={handleSubmit}
      >
        <IdentifierFields
          fieldReadOnlyBecauseFrozenFormSiret={fieldReadOnlyBecauseFrozenFormSiret}
          formSiret={formSiret}
          initialSiret={initialSiret}
          readOnly={readOnly}
          venueLabelId={venueLabelId}
          venueLabels={venueLabels}
          venueTypeId={venueTypeId}
          venueTypes={venueTypes}
        />
        <BankInformation
          offerer={offerer}
          venue={venue}
        />
        <LocationFields
          fieldReadOnlyBecauseFrozenFormSiret={fieldReadOnlyBecauseFrozenFormSiret}
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
            offererId={offererId}
            readOnly={readOnly}
            venueId={venueId}
          />
          <ReturnOrSubmitControl
            canSubmit={canSubmit}
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
      venue,
      match: {
        params: { offererId, venueId },
      },
      offerer,
      query,
    } = this.props

    const { readOnly } = query.context({
      id: venueId,
    })

    const { id: initialId, isVirtual: initialIsVirtual, name: initialName } = venue || {}

    const decorators = [bindGetSuggestionsToLatitude, bindGetSuggestionsToLongitude]

    const showForm = !initialIsVirtual && typeof offerer !== 'undefined'

    const pageTitle = readOnly ? 'Détails de votre lieu' : 'Modifier votre lieu'

    const actionLink = !!initialId && (
      <Link
        className="primary-button with-icon"
        to={`/offres/creation?lieu=${initialId}&structure=${offererId}`}
      >
        <AddOfferSvg />
        <span>
          {'Créer une offre'}
        </span>
      </Link>
    )

    return (
      <AppLayout
        layoutConfig={{
          backTo: this.props.isNewHomepageActive
            ? { label: 'Accueil', path: `/accueil?structure=${offererId}` }
            : { label: 'Structure', path: `/structures/${offererId}` },
          pageName: 'venue',
        }}
      >
        <PageTitle title={pageTitle} />
        <Titles
          action={actionLink}
          subtitle={initialName}
          title="Lieu"
        />

        {venue && <VenueProvidersManagerContainer venue={venue} />}

        {showForm && (
          <Form
            decorators={decorators}
            initialValues={venue}
            name="venue"
            onSubmit={this.handleOnFormSubmit}
            render={this.onHandleRender}
          />
        )}
      </AppLayout>
    )
  }
}

VenueEdition.propTypes = {
  handleInitialRequest: PropTypes.func.isRequired,
  handleSubmitRequest: PropTypes.func.isRequired,
  handleSubmitRequestFail: PropTypes.func.isRequired,
  handleSubmitRequestSuccess: PropTypes.func.isRequired,
  history: PropTypes.shape().isRequired,
  isNewHomepageActive: PropTypes.bool.isRequired,
  match: PropTypes.shape().isRequired,
  offerer: PropTypes.shape().isRequired,
  query: PropTypes.shape().isRequired,
  trackModifyVenue: PropTypes.func.isRequired,
  venue: PropTypes.shape().isRequired,
  venueLabels: PropTypes.arrayOf(PropTypes.instanceOf(VenueLabel)).isRequired,
  venueTypes: PropTypes.arrayOf(PropTypes.instanceOf(VenueType)).isRequired,
}

export default VenueEdition
