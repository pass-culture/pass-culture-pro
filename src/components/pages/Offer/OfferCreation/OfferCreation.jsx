import get from 'lodash.get'
import {
  Field,
  Form,
  Icon,
  mergeForm,
  resetForm,
  showModal,
  SubmitButton,
} from 'pass-culture-shared'
import PropTypes from 'prop-types'
import React, { Fragment, PureComponent } from 'react'
import { Link } from 'react-router-dom'
import ReactToolTip from 'react-tooltip'
import { requestData } from 'redux-saga-data'

import Insert from 'components/layout/Insert/Insert'
import Main from 'components/layout/Main'
import OfferPreviewLink from 'components/layout/OfferPreviewLink/OfferPreviewLink'
import { webappOfferUrl } from 'components/layout/OfferPreviewLink/webappOfferUrl'
import PageTitle from 'components/layout/PageTitle/PageTitle'
import Titles from 'components/layout/Titles/Titles'
import { ALL_STATUS } from 'components/pages/Offers/_constants'
import { OFFERERS_API_PATH } from 'config/apiPaths'
import { CGU_URL } from 'utils/config'
import { musicOptions, showOptions } from 'utils/edd'
import { pluralize } from 'utils/pluralize'
import { mapApiToBrowser, translateApiParamsToQueryParams } from 'utils/translate'

import { isAllocineOffer, isOfferFromStockProvider } from '../domain/localProvider'
import offerIsRefundable from '../domain/offerIsRefundable'
import LocalProviderInformation from '../LocalProviderInformation/LocalProviderInformationContainer'
import MediationsManager from '../MediationsManager/MediationsManagerContainer'
import StocksManagerContainer from '../StocksManager/StocksManagerContainer'
import { getDurationInHours, getDurationInMinutes } from '../utils/duration'

const DURATION_LIMIT_TIME = 100

const CONDITIONAL_FIELDS = {
  speaker: [
    'EventType.CONFERENCE_DEBAT_DEDICACE',
    'ThingType.PRATIQUE_ARTISTIQUE_ABO',
    'EventType.PRATIQUE_ARTISTIQUE',
  ],
  author: [
    'EventType.CINEMA',
    'EventType.MUSIQUE',
    'ThingType.MUSIQUE',
    'EventType.SPECTACLE_VIVANT',
    'ThingType.LIVRE_EDITION',
  ],
  visa: ['EventType.CINEMA'],
  isbn: ['ThingType.LIVRE_EDITION'],
  musicType: ['EventType.MUSIQUE', 'ThingType.MUSIQUE', 'ThingType.MUSIQUE_ABO'],
  showType: ['EventType.SPECTACLE_VIVANT', 'ThingType.SPECTACLE_VIVANT_ABO'],
  stageDirector: ['EventType.CINEMA', 'EventType.SPECTACLE_VIVANT'],
  performer: ['EventType.MUSIQUE', 'ThingType.MUSIQUE', 'EventType.SPECTACLE_VIVANT'],
}

class OfferCreation extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props
    this.handleShowStocksManager()
    this.setDefaultBookingEmailIfNew()

    // pass-culture-shared have a dedicated redux state for forms.
    // it's not correctly reset when we came back from offer edition.
    dispatch(resetForm())
  }

  componentDidUpdate(prevProps) {
    const {
      dispatch,
      formOffererId,
      formVenueId,
      location,
      offerer,
      selectedOfferType,
      venue,
    } = this.props

    const { search } = location

    if (prevProps.location.search !== search) {
      this.handleShowStocksManager()
      return
    }

    if (
      !formOffererId &&
      ((!offerer && prevProps.offerer) || (!selectedOfferType && prevProps.selectedOfferType))
    ) {
      dispatch(
        mergeForm('offer', {
          offererId: null,
          venueId: null,
        })
      )
    }

    if (!formVenueId && !venue && prevProps.venue) {
      dispatch(
        mergeForm('offer', {
          venueId: null,
        })
      )
    }

    this.setDefaultBookingEmailIfNew(prevProps)

    this.setDefaultIsDuoIfNewAndEvent()

    this.forceReactToolTip()
  }

  forceReactToolTip() {
    ReactToolTip.rebuild()
  }

  onHandleDataRequest = (handleSuccess, handleFail) => {
    const {
      dispatch,
      history,
      loadOffer,
      match: {
        params: { offerId },
      },
      offerers,
      venuesMatchingOfferType,
      providers,
      query,
      types,
    } = this.props
    const { offererId, venueId } = query.translate()

    if (offerId !== 'creation') {
      loadOffer(offerId)
    } else if (venueId) {
      dispatch(
        requestData({
          apiPath: `/venues/${venueId}`,
          normalizer: {
            managingOffererId: 'offerers',
          },
        })
      )
    } else {
      const offerersPath = offererId ? `${OFFERERS_API_PATH}/${offererId}` : OFFERERS_API_PATH

      dispatch(
        requestData({
          apiPath: offerersPath,
          handleSuccess: state => {
            const {
              data: { venues },
            } = state
            if (!venues.length) {
              dispatch(
                showModal(
                  <div>
                    {
                      'Vous devez avoir déjà enregistré un lieu dans une de vos structures pour ajouter des offres'
                    }
                  </div>,
                  {
                    onCloseClick: () => history.push('/structures'),
                  }
                )
              )
            }
          },
          handleFail,
          normalizer: { managedVenues: 'venues' },
        })
      )
    }

    if (offerers.length === 0 || venuesMatchingOfferType.length === 0) {
      dispatch(
        requestData({
          apiPath: OFFERERS_API_PATH,
          normalizer: { managedVenues: 'venues' },
        })
      )
    }

    if (providers.length === 0) {
      dispatch(requestData({ apiPath: '/providers' }))
    }

    if (types.length === 0) {
      dispatch(requestData({ apiPath: '/types' }))
    }

    handleSuccess()
  }

  handleOnClick = query => event => {
    event.preventDefault()
    query.change({ gestion: '' })
  }

  onHandleFormSuccess = (state, action) => {
    const {
      offer,
      query,
      trackCreateOffer,
      trackModifyOffer,
      showValidationNotification,
    } = this.props

    showValidationNotification()
    const { isCreatedEntity } = query.context()
    const previousOfferId = offer && offer.id
    const {
      payload: { datum },
    } = action
    const offerId = datum.id

    const queryParams = previousOfferId ? {} : { gestion: '' }
    query.changeToReadOnly(queryParams, { id: offerId })

    if (isCreatedEntity) {
      trackCreateOffer(offerId)
    } else {
      trackModifyOffer(previousOfferId)
    }
  }

  handleShowStocksManager = () => {
    const { dispatch, query, match } = this.props
    const { gestion } = query.parse()
    const offerId = match.params.offerId
    if (typeof gestion !== 'undefined') {
      dispatch(
        showModal(<StocksManagerContainer offerId={offerId} />, {
          isUnclosable: true,
        })
      )
    }
  }

  setDefaultBookingEmailIfNew(prevProps) {
    const { currentUser, dispatch, query, venue } = this.props
    const { isCreatedEntity } = query.context()
    if (!isCreatedEntity) {
      return
    }
    if (!venue) return
    if (!prevProps || !prevProps.venue || venue.id !== prevProps.venue.id) {
      dispatch(
        mergeForm('offer', {
          bookingEmail: (venue && venue.bookingEmail) || currentUser.email,
        })
      )
    }
  }

  setDefaultIsDuoIfNewAndEvent() {
    const { query, updateFormSetIsDuo, selectedOfferType } = this.props

    const { isCreatedEntity } = query.context()
    if (!isCreatedEntity) return

    const isEventType = get(selectedOfferType, 'type') === 'Event'

    if (isEventType) {
      updateFormSetIsDuo(true)
    } else {
      updateFormSetIsDuo(false)
    }
  }

  hasConditionalField(fieldName) {
    const { selectedOfferType } = this.props
    if (!selectedOfferType) {
      return false
    }

    return CONDITIONAL_FIELDS[fieldName].indexOf(selectedOfferType.value) > -1
  }

  replaceVenueNameByPublicName = venues => {
    return venues.map(venue => {
      return venue.publicName ? { ...venue, name: venue.publicName } : { ...venue }
    })
  }

  handleHrefClick = () => event => {
    event.preventDefault()
    const { offer } = this.props
    const offerId = get(offer, 'id')
    const mediationId = get(get(offer, 'activeMediation'), 'id')

    const offerWebappUrl = webappOfferUrl(offerId, mediationId)

    window.open(offerWebappUrl, 'targetWindow', 'toolbar=no,width=375,height=667').focus()
  }

  handleCheckIsDuo = event => {
    const { updateFormSetIsDuo } = this.props
    updateFormSetIsDuo(event.target.checked)
  }

  computeOffersUrl = () => {
    const { offersSearchFilters } = this.props
    const { status } = offersSearchFilters
    const searchFiltersParams = { ...offersSearchFilters }

    if (status && status !== ALL_STATUS) {
      searchFiltersParams.status = mapApiToBrowser[status]
    }

    const queryString = new URLSearchParams(
      translateApiParamsToQueryParams(searchFiltersParams)
    ).toString()

    return queryString ? `/offres?${queryString}` : '/offres'
  }

  render() {
    const {
      currentUser,
      formInitialValues,
      isEditableOffer,
      musicSubOptions,
      offer,
      offerer,
      offerers,
      query,
      stocks,
      selectedOfferType,
      showSubOptions,
      types,
      url,
      venue,
      venuesMatchingOfferType,
    } = this.props

    const { isEvent } = offer || {}
    const { isCreatedEntity, isModifiedEntity, method, readOnly } = query.context()
    const isEventType = get(selectedOfferType, 'type') === 'Event' || isEvent

    const offerId = get(offer, 'id')
    const mediationId = get(get(offer, 'activeMediation'), 'id')

    const offerFromAllocine = isAllocineOffer(offer)
    const offerFromLocalProvider = isOfferFromStockProvider(offer) || offerFromAllocine
    const offerFromNonEditableLocalProvider = isOfferFromStockProvider(offer)

    const offerWebappUrl = webappOfferUrl(offerId, mediationId)
    const offererId = get(offerer, 'id')
    const offerName = get(offer, 'name')
    const showAllForm = selectedOfferType || !isCreatedEntity
    const venueId = get(venue, 'id')
    const isOfferActive = get(offer, 'isActive')
    const isOffererSelectReadOnly = typeof offererId !== 'undefined' || offerFromLocalProvider
    const isVenueSelectReadOnly = typeof venueId !== 'undefined' || offerFromLocalProvider
    const isVenueVirtual = get(venue, 'isVirtual')

    const formApiPath = isCreatedEntity ? '/offers' : `/offers/${offerId}`

    let title

    if (isCreatedEntity) {
      title = 'Ajouter une offre'
      if (venueId) {
        if (isVenueVirtual) {
          title = title + ' numérique'
        } else {
          title = title + ` pour ${get(venue, 'name')}`
        }
      } else if (offererId) {
        title = title + ` pour ${get(offerer, 'name')}`
      }
    } else {
      title = 'Détails de l’offre'
    }

    const offererHasNoPhysicalVenues = offerer && get(venuesMatchingOfferType, 'length') === 0

    const displayDigitalOfferInformationMessage = !offerIsRefundable(selectedOfferType, venue)

    const actionLink = offer && (
      <OfferPreviewLink
        offerWebappUrl={offerWebappUrl}
        onClick={this.handleHrefClick()}
      />
    )

    const pageTitle = !isCreatedEntity && offer ? 'Détails de votre offre' : 'Créer une offre'

    return (
      <Main
        backTo={{ path: this.computeOffersUrl(), label: 'Offres' }}
        handleDataRequest={this.onHandleDataRequest}
        id="offer"
        name="offer"
      >
        <PageTitle title={pageTitle} />
        <Titles
          action={actionLink}
          subtitle={offerName && offerName}
          title={title}
        />
        <p className="advice">
          {
            'Renseignez les détails de cette offre, puis mettez-la en avant en ajoutant une ou plusieurs accroches.'
          }
        </p>
        <Form
          Tag={null}
          action={formApiPath}
          handleSuccess={this.onHandleFormSuccess}
          method={method}
          name="offer"
          patch={formInitialValues}
          readOnly={readOnly}
        >
          <div className="field-group offer-form">
            <Field
              className="title-field"
              displayMaxLength
              isExpanded
              label="Titre de l’offre"
              maxLength={90}
              name="name"
              required
              type="textarea"
            />
            <Field
              label="Type"
              name="type"
              optionLabel="proLabel"
              optionValue="value"
              options={types}
              placeholder={
                get(formInitialValues, 'type') && !selectedOfferType
                  ? get(formInitialValues, 'offerTypeValue')
                  : 'Sélectionnez un type d’offre'
              }
              readOnly={offerId && selectedOfferType}
              required
              sublabel="Le type d’offre ne peut pas être modifié une fois l’offre enregistrée."
              type="select"
            />
            {this.hasConditionalField('musicType') && (
              <Fragment>
                <Field
                  label="Genre musical"
                  name="musicType"
                  optionLabel="label"
                  optionValue="code"
                  options={musicOptions}
                  setKey="extraData"
                  type="select"
                />

                {get(musicSubOptions, 'length') > 0 && (
                  <Field
                    label="Sous genre"
                    name="musicSubType"
                    optionLabel="label"
                    optionValue="code"
                    options={musicSubOptions}
                    setKey="extraData"
                    type="select"
                  />
                )}
              </Fragment>
            )}

            {this.hasConditionalField('showType') && (
              <Fragment>
                <Field
                  label="Type de spectacle"
                  name="showType"
                  optionLabel="label"
                  optionValue="code"
                  options={showOptions}
                  setKey="extraData"
                  type="select"
                />

                {get(showSubOptions, 'length') > 0 && (
                  <Field
                    label="Sous type"
                    name="showSubType"
                    optionLabel="label"
                    optionValue="code"
                    options={showSubOptions}
                    setKey="extraData"
                    type="select"
                  />
                )}
              </Fragment>
            )}
            {!isCreatedEntity && offer && (
              <div className="field is-horizontal field-text">
                <div className="field-label">
                  <label
                    className="label"
                    htmlFor="input_offers_name"
                  >
                    <div className="subtitle">
                      {isEventType ? 'Dates :' : 'Stocks :'}
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
                      {pluralize(get(stocks, 'length'), isEventType ? 'date' : 'stock')}
                    </span>
                    <button
                      className="button is-primary is-outlined is-small manage-stock"
                      disabled={offerFromNonEditableLocalProvider ? 'disabled' : ''}
                      id="manage-stocks"
                      onClick={this.handleOnClick(query)}
                      type="button"
                    >
                      <span className="icon">
                        <Icon svg="ico-calendar-red" />
                      </span>
                      <span>
                        {isEventType ? 'Gérer les dates et les stocks' : 'Gérer les stocks'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {offerFromLocalProvider && offer && (
            <LocalProviderInformation
              offerId={offer.id}
              offererId={offererId}
              providerName={offer.lastProvider.name.toLowerCase()}
            />
          )}
          {!isCreatedEntity && offer && <MediationsManager offerId={offer.id} />}

          {showAllForm && (
            <div>
              <h2 className="main-list-title">
                {'Infos pratiques'}
              </h2>
              <div className="field-group">
                <Field
                  debug
                  label="Structure"
                  name="offererId"
                  options={offerers}
                  placeholder="Sélectionnez une structure"
                  readOnly={isOffererSelectReadOnly}
                  required
                  type="select"
                />
                {offererHasNoPhysicalVenues && (
                  <div className="field is-horizontal">
                    <div className="field-label" />
                    <div className="field-body">
                      <p className="help is-danger">
                        {venue
                          ? 'Erreur dans les données : Le lieu rattaché à cette offre n’est pas compatible avec le type de l’offre'
                          : 'Il faut obligatoirement une structure avec un lieu.'}
                        <Field
                          name="__BLOCK_FORM__"
                          required
                          type="hidden"
                        />
                      </p>
                    </div>
                  </div>
                )}
                <Field
                  label="Lieu"
                  name="venueId"
                  options={this.replaceVenueNameByPublicName(venuesMatchingOfferType)}
                  placeholder="Sélectionnez un lieu"
                  readOnly={isVenueSelectReadOnly}
                  required
                  type="select"
                />
              </div>
              {displayDigitalOfferInformationMessage && (
                <div className="is-horizontal">
                  <Insert className="yellow-insert">
                    <p>
                      {
                        "Cette offre numérique ne fera pas l'objet d'un remboursement. Pour plus d'informations sur les catégories éligibles au remboursement, merci de consulter les CGU."
                      }
                    </p>
                    <div className="insert-action-link">
                      <a
                        href={CGU_URL}
                        id="cgu-link"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <Icon svg="ico-external-site" />
                        <p>
                          {"Consulter les Conditions Générales d'Utilisation"}
                        </p>
                      </a>
                    </div>
                  </Insert>
                </div>
              )}
              <div className="field-group">
                {(get(venue, 'isVirtual') || url) && (
                  <Field
                    isExpanded
                    label="URL"
                    name="url"
                    readOnly={offerFromLocalProvider}
                    required
                    sublabel={
                      !readOnly &&
                      'Vous pouvez inclure {token} {email} et {offerId} dans l’URL, qui seront remplacés respectivement par le code de la contremarque, l’e-mail de la personne ayant reservé et l’identifiant de l’offre'
                    }
                    type="text"
                  />
                )}
                {currentUser.isAdmin && (
                  <Field
                    label="Rayonnement national"
                    name="isNational"
                    readOnly={offerFromLocalProvider}
                    type="checkbox"
                  />
                )}
                {isEventType && (
                  <Field
                    getDurationInHours={getDurationInHours}
                    getDurationInMinutes={getDurationInMinutes}
                    label="Durée"
                    limitTimeInHours={DURATION_LIMIT_TIME}
                    name="durationMinutes"
                    placeholder="HH:MM"
                    type="duration"
                  />
                )}
                {isEventType && (
                  <div className="select-duo-offer">
                    <input
                      checked={formInitialValues.isDuo}
                      className="offer-duo-checkbox input"
                      defaultChecked
                      disabled={readOnly ? 'disabled' : ''}
                      id="isDuo"
                      onChange={this.handleCheckIsDuo}
                      type="checkbox"
                    />
                    <label htmlFor="isDuo">
                      {'Accepter les réservations '}
                      <span className="duo-label-italic">
                        {'duo'}
                      </span>
                    </label>
                    <span
                      className="offer-tooltip"
                      data-place="bottom"
                      data-tip={
                        "En activant cette option, vous permettez au bénéficiaire du pass Culture de venir accompagné. La seconde place sera délivrée au même tarif que la première, quel que soit l'accompagnateur."
                      }
                      data-type="info"
                    >
                      <Icon
                        alt="image d’aide à l’information"
                        svg="picto-info"
                      />
                    </span>
                  </div>
                )}

                <Field
                  label="Email auquel envoyer les réservations"
                  name="bookingEmail"
                  readOnly={offerFromLocalProvider}
                  sublabel="Merci de laisser ce champ vide si vous ne souhaitez pas recevoir d’email lors des réservations"
                  type="email"
                />
              </div>
              <h2 className="main-list-title">
                {'Infos artistiques'}
              </h2>
              <div className="field-group large-labels">
                <Field
                  displayMaxLength
                  isExpanded
                  label="Description"
                  maxLength={1000}
                  name="description"
                  rows={readOnly ? 1 : 5}
                  type="textarea"
                />

                {this.hasConditionalField('speaker') && (
                  <Field
                    label="Intervenant"
                    name="speaker"
                    readOnly={offerFromLocalProvider}
                    setKey="extraData"
                    type="text"
                  />
                )}

                {this.hasConditionalField('author') && (
                  <Field
                    label="Auteur"
                    name="author"
                    readOnly={offerFromLocalProvider}
                    setKey="extraData"
                    type="text"
                  />
                )}

                {this.hasConditionalField('visa') && (
                  <Field
                    isExpanded
                    label="Visa d’exploitation"
                    name="visa"
                    readOnly={offerFromLocalProvider}
                    setKey="extraData"
                    sublabel="(obligatoire si applicable)"
                    type="text"
                  />
                )}

                {this.hasConditionalField('isbn') && (
                  <Field
                    isExpanded
                    label="ISBN"
                    name="isbn"
                    readOnly={offerFromLocalProvider}
                    setKey="extraData"
                    sublabel="(obligatoire si applicable)"
                    type="text"
                  />
                )}

                {this.hasConditionalField('stageDirector') && (
                  <Field
                    isExpanded
                    label="Metteur en scène"
                    name="stageDirector"
                    readOnly={offerFromLocalProvider}
                    setKey="extraData"
                  />
                )}

                {this.hasConditionalField('performer') && (
                  <Field
                    isExpanded
                    label="Interprète"
                    name="performer"
                    readOnly={offerFromLocalProvider}
                    setKey="extraData"
                  />
                )}
              </div>

              <h2 className="main-list-title">
                {'Informations de retrait'}
              </h2>
              <div className="field-group large-labels">
                <Field
                  displayMaxLength
                  isExpanded
                  label="Informations de retrait"
                  maxLength={500}
                  name="withdrawalDetails"
                  rows={readOnly ? 1 : 5}
                  type="textarea"
                />
              </div>
            </div>
          )}

          <hr />
          <div
            className="field is-grouped is-grouped-centered"
            style={{ justifyContent: 'space-between' }}
          >
            <div className="control">
              {readOnly && isEditableOffer && (
                <Link
                  className="secondary-link"
                  id="modify-offer-button"
                  to={`/offres/${offerId}/edition`}
                >
                  {'Modifier l’offre'}
                </Link>
              )}
            </div>
            <div className="control">
              {readOnly ? (
                <Link
                  className="primary-link"
                  to="/offres"
                >
                  {'Terminer '}
                  {isModifiedEntity && !isOfferActive && 'et activer'}
                </Link>
              ) : (
                showAllForm && (
                  <SubmitButton className="primary-button">
                    {'Enregistrer'}
                    {isCreatedEntity && ' et passer ' + (isEventType ? 'aux dates' : 'aux stocks')}
                  </SubmitButton>
                )
              )}
            </div>
          </div>
        </Form>
      </Main>
    )
  }
}

OfferCreation.defaultProps = {
  venuesMatchingOfferType: [],
}

OfferCreation.propTypes = {
  currentUser: PropTypes.shape().isRequired,
  dispatch: PropTypes.func.isRequired,
  isEditableOffer: PropTypes.bool.isRequired,
  loadOffer: PropTypes.func.isRequired,
  location: PropTypes.shape().isRequired,
  query: PropTypes.shape().isRequired,
  selectedOfferType: PropTypes.shape().isRequired,
  showValidationNotification: PropTypes.func.isRequired,
  trackCreateOffer: PropTypes.func.isRequired,
  trackModifyOffer: PropTypes.func.isRequired,
  venuesMatchingOfferType: PropTypes.arrayOf(PropTypes.shape()),
}

export default OfferCreation
