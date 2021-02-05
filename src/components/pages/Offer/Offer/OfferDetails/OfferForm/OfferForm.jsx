import isEqual from 'lodash.isequal'
import PropTypes from 'prop-types'
import React, { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'

import InternalBanner from 'components/layout/Banner/InternalBanner'
import { CheckboxInput } from 'components/layout/inputs/CheckboxInput/CheckboxInput'
import DurationInput from 'components/layout/inputs/DurationInput/DurationInput'
import InputError from 'components/layout/inputs/Errors/InputError'
import Select, { buildSelectOptions } from 'components/layout/inputs/Select'
import TextareaInput from 'components/layout/inputs/TextareaInput'
import TextInput from 'components/layout/inputs/TextInput/TextInput'
import offerIsRefundable from 'components/pages/Offer/domain/offerIsRefundable'

import SynchronizedProviderInformation from '../SynchronizedProviderInformation'

import {
  BASE_OFFER_FIELDS,
  DEFAULT_FORM_VALUES,
  EXTRA_DATA_FIELDS,
  MANDATORY_FIELDS,
  TEXT_INPUT_DEFAULT_VALUE,
} from './_constants'
import { ReactComponent as AudioDisabilitySvg } from './assets/audio-disability.svg'
import { ReactComponent as MentalDisabilitySvg } from './assets/mental-disability.svg'
import { ReactComponent as MotorDisabilitySvg } from './assets/motor-disability.svg'
import { ReactComponent as VisualDisabilitySvg } from './assets/visual-disability.svg'
import OfferRefundWarning from './Messages/OfferRefundWarning'
import WithdrawalReminder from './Messages/WithdrawalReminder'
import TypeTreeSelects from './TypeTreeSelects'

const getOfferConditionalFields = ({
  offerType = null,
  isUserAdmin = null,
  receiveNotificationEmails = null,
  venue = null,
}) => {
  let offerConditionalFields = []

  if (offerType && offerType.type === 'Event') {
    offerConditionalFields.push('durationMinutes')
    offerConditionalFields.push('isDuo')
  }

  if (isUserAdmin) {
    offerConditionalFields.push('isNational')
  }

  if (receiveNotificationEmails) {
    offerConditionalFields.push('bookingEmail')
  }

  if (venue && venue.isVirtual) {
    offerConditionalFields.push('url')
  }

  return offerConditionalFields
}

const computeOfferFormFields = (offerType, isUserAdmin, receiveNotificationEmails, venue) => {
  const offerConditionalFields = getOfferConditionalFields({
    offerType,
    isUserAdmin,
    receiveNotificationEmails,
    venue,
  })
  let offerTypeConditionalFields = offerType ? [...offerType.conditionalFields] : []
  if (offerTypeConditionalFields.includes('musicType')) {
    offerTypeConditionalFields.push('musicSubType')
  }
  if (offerTypeConditionalFields.includes('showType')) {
    offerTypeConditionalFields.push('showSubType')
  }

  return [...BASE_OFFER_FIELDS, ...offerTypeConditionalFields, ...offerConditionalFields]
}

const applyFieldsToFormValues = (formValues, formFields, defaultFormValues) => {
  return formFields.reduce((acc, field) => {
    return { ...acc, [field]: field in formValues ? formValues[field] : defaultFormValues[field] }
  }, {})
}

const OfferForm = ({
  areAllVenuesVirtual,
  backUrl,
  initialValues,
  isEdition,
  isUserAdmin,
  offerers,
  onSubmit,
  providerName,
  readOnlyFields,
  onFormValuesChange,
  setSelectedOffererId,
  showErrorNotification,
  submitErrors,
  types,
  venues,
}) => {
  const offererOptions = buildSelectOptions('id', 'name', offerers)
  const [formErrors, setFormErrors] = useState(submitErrors)
  const [isLoading, setIsLoading] = useState(true)
  const [receiveNotificationEmails, setReceiveNotificationEmails] = useState(false)

  const defaultFormValues = useMemo(() => {
    let extraValues = {}
    if (offerers.length === 1) {
      extraValues.offererId = offerers[0].id
    }
    return { ...DEFAULT_FORM_VALUES, ...extraValues, ...initialValues }
  }, [initialValues, offerers])
  const [formValues, setFormValues] = useState(defaultFormValues)

  useEffect(
    function initializeReceiveNotificationEmails() {
      if (
        defaultFormValues.bookingEmail &&
        defaultFormValues.bookingEmail !== DEFAULT_FORM_VALUES.bookingEmail
      ) {
        setReceiveNotificationEmails(true)
      }
    },
    [defaultFormValues]
  )

  const [offerType, setOfferType] = useState(null)
  const [venue, setVenue] = useState(null)
  const [venueOptions, setVenueOptions] = useState(buildSelectOptions('id', 'name', venues))
  const [offerFormFields, setOfferFormFields] = useState(Object.keys(DEFAULT_FORM_VALUES))
  const [noDisabilityCompliant, setNoDisabilityCompliant] = useState(false)

  useLayoutEffect(
    function initializeOfferForm() {
      let initialOfferType = null
      if (defaultFormValues.type) {
        initialOfferType = types.find(type => type.value === defaultFormValues.type)
        setOfferType(initialOfferType)
      }

      let initialVenue = null
      if (defaultFormValues.venueId) {
        initialVenue = venues.find(venue => venue.id === defaultFormValues.venueId)
        setVenue(initialVenue)
      }

      let venueOptionFilter = null
      if (initialOfferType && initialOfferType.offlineOnly) {
        venueOptionFilter = venue => !venue.isVirtual
      } else if (initialOfferType && initialOfferType.onlineOnly) {
        venueOptionFilter = venue => venue.isVirtual
      }
      if (venueOptionFilter) {
        setVenueOptions(buildSelectOptions('id', 'name', venues.filter(venueOptionFilter)))
      }

      // setDisplayRefundWarning(!offerIsRefundable(initialOfferType, initialVenue))

      const initialOfferFormFields = computeOfferFormFields(
        initialOfferType,
        isUserAdmin,
        receiveNotificationEmails,
        initialVenue
      )
      setOfferFormFields(initialOfferFormFields)
      setNoDisabilityCompliant(defaultFormValues.noDisabilityCompliant)
      setFormValues(
        applyFieldsToFormValues(defaultFormValues, initialOfferFormFields, defaultFormValues)
      )
      setIsLoading(false)
    },
    [] /* eslint-disable-line react-hooks/exhaustive-deps */
  )

  const handleFormUpdate = useCallback(
    newFormValues =>
      setFormValues(oldFormValues => {
        console.log('handleFormUpdate::setFormValues')
        let updatedFormValues = { ...oldFormValues, ...newFormValues }
        return isEqual(oldFormValues, updatedFormValues) ? oldFormValues : updatedFormValues
      }),
    [setFormValues]
  )

  useEffect(
    function handleVenueChange() {
      if (isLoading) return

      if (!venue || formValues.venueId !== venue.id) {
        const newVenue = venues.find(venue => venue.id === formValues.venueId)
        setVenue(newVenue ? newVenue : null)
        if (newVenue && newVenue.managingOffererId !== formValues.offererId) {
          handleFormUpdate({ offererId: newVenue.managingOffererId })
        }
        // setDisplayRefundWarning(!offerIsRefundable(offerType, newVenue))
      }
    },
    [
      formValues.offererId,
      formValues.venueId,
      handleFormUpdate,
      isLoading,
      offerType,
      // setDisplayRefundWarning,
      setVenue,
      venue,
      venues,
    ]
  )
  useEffect(
    function handleVenueOptionsChange() {
      if (isLoading) return

      let venueOptionFilter = null
      if (offerType && offerType.offlineOnly) {
        venueOptionFilter = venue => !venue.isVirtual
      } else if (offerType && offerType.onlineOnly) {
        venueOptionFilter = venue => venue.isVirtual
      } else {
        venueOptionFilter = () => true
      }
      const newVenueOptions = buildSelectOptions('id', 'name', venues.filter(venueOptionFilter))
      setVenueOptions(oldVenueOptions =>
        isEqual(oldVenueOptions, newVenueOptions) ? oldVenueOptions : newVenueOptions
      )
      setFormErrors(oldFormErrors => {
        let newFormErrors = oldFormErrors
        if (newVenueOptions.length === 0 && venues.length > 0) {
          newFormErrors.venueId = 'Il faut obligatoirement une structure avec un lieu.'
        } else {
          delete newFormErrors.venueId
        }
        return newFormErrors
      })

      if (newVenueOptions.length === 1) {
        handleFormUpdate({ venueId: newVenueOptions[0].id })
      }
    },
    [handleFormUpdate, isLoading, offerType, setFormErrors, setVenueOptions, venues]
  )
  useEffect(
    function updateOfferFormFields() {
      console.log('updateOfferFormFields::receiveNotificationEmails', receiveNotificationEmails)
      console.log('updateOfferFormFields::isLoading', isLoading)

      if (isLoading) return

      const newOfferFormFields = computeOfferFormFields(
        offerType,
        isUserAdmin,
        receiveNotificationEmails,
        venue
      )
      setOfferFormFields(oldOfferFormFields => {
        return isEqual(oldOfferFormFields, newOfferFormFields)
          ? oldOfferFormFields
          : newOfferFormFields
      })
      console.log('updateOfferFormFields::newOfferFormFields', newOfferFormFields)
      console.log('updateOfferFormFields::Object.keys(formValues)', Object.keys(formValues))
      if (!isEqual(newOfferFormFields, Object.keys(formValues))) {
        const newOfferValues = applyFieldsToFormValues(
          formValues,
          newOfferFormFields,
          defaultFormValues
        )
        console.log('updateOfferFormFields::newOfferValues', newOfferValues)
        setFormValues(newOfferValues)
      }
    },
    [
      defaultFormValues,
      formValues,
      isLoading,
      isUserAdmin,
      offerType,
      receiveNotificationEmails,
      setFormValues,
      venue,
    ]
  )

  const selectOfferer = useCallback(
    event => {
      const selectedOffererId = event.target.value
      if (selectedOffererId !== formValues.offererId) {
        handleFormUpdate({ offererId: selectedOffererId, venueId: DEFAULT_FORM_VALUES.venueId })

        // Change selectedOffererId in OfferCreation, it will update venues
        setSelectedOffererId(selectedOffererId)
      }
    },
    [formValues.offererId, handleFormUpdate, setSelectedOffererId]
  )

  const onTypeChange = useCallback(
    newType => {
      if (formValues.type !== newType) {
        console.log('onTypeChange', newType)
        const newOfferType = types.find(type => type.value === newType) || null
        setOfferType(newOfferType)
        handleFormUpdate({ type: newType })
      }
    },
    [formValues.type, handleFormUpdate, setOfferType, types]
  )

  const isValid = useCallback(() => {
    let newFormErrors = {}
    const formFields = [...offerFormFields, 'offererId']

    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>><  formValue inside isValid', formValues)
    MANDATORY_FIELDS.forEach(fieldName => {
      if (
        formFields.includes(fieldName) &&
        formValues[fieldName] === DEFAULT_FORM_VALUES[fieldName]
      ) {
        newFormErrors[fieldName] = 'Ce champ est obligatoire.'
      }
    })

    if (
      ![
        noDisabilityCompliant,
        formValues.audioDisabilityCompliant,
        formValues.mentalDisabilityCompliant,
        formValues.motorDisabilityCompliant,
        formValues.visualDisabilityCompliant,
      ].includes(true)
    ) {
      newFormErrors['disabilityCompliant'] = 'Ce champ est obligatoire.'
    }

    setFormErrors(newFormErrors)
    return Object.keys(newFormErrors).length === 0
  }, [noDisabilityCompliant, offerFormFields, formValues])

  const submitForm = useCallback(() => {
    if (isValid()) {
      const editableFields = offerFormFields.filter(field => !readOnlyFields.includes(field))
      const submittedValuesAccumulator = editableFields.some(editableField =>
        EXTRA_DATA_FIELDS.includes(editableField)
      )
        ? { extraData: null }
        : {}
      const submittedValues = editableFields.reduce((submittedValues, fieldName) => {
        if (!EXTRA_DATA_FIELDS.includes(fieldName)) {
          const fieldValue =
            formValues[fieldName] === TEXT_INPUT_DEFAULT_VALUE ? null : formValues[fieldName]
          submittedValues = {
            ...submittedValues,
            [fieldName]: fieldValue,
          }
        } else if (formValues[fieldName] !== DEFAULT_FORM_VALUES[fieldName]) {
          submittedValues.extraData = {
            ...submittedValues.extraData,
            [fieldName]: formValues[fieldName],
          }
        }
        return submittedValues
      }, submittedValuesAccumulator)

      if (!receiveNotificationEmails) {
        submittedValues.bookingEmail = null
      }

      onSubmit(submittedValues)
    } else {
      showErrorNotification()
    }
  }, [
    offerFormFields,
    formValues,
    isValid,
    onSubmit,
    readOnlyFields,
    receiveNotificationEmails,
    showErrorNotification,
  ])

  useEffect(() => {
    setFormErrors(submitErrors)
  }, [submitErrors])
  useEffect(() => onFormValuesChange(formValues), [formValues, onFormValuesChange])

  const handleSingleFormUpdate = useCallback(
    event => {
      const field = event.target.name
      const value = event.target.type === 'checkbox' ? !formValues[field] : event.target.value
      handleFormUpdate({ [field]: value })
    },
    [formValues, handleFormUpdate]
  )

  const handleDisabilityCompliantUpdate = useCallback(
    event => {
      let disabilityCompliantValues = {
        audioDisabilityCompliant: formValues.audioDisabilityCompliant,
        mentalDisabilityCompliant: formValues.mentalDisabilityCompliant,
        motorDisabilityCompliant: formValues.motorDisabilityCompliant,
        visualDisabilityCompliant: formValues.visualDisabilityCompliant,
      }

      const field = event.target.name
      disabilityCompliantValues[field] = !formValues[field]
      let newNoDisabilityCompliant = noDisabilityCompliant

      if (field === 'noDisabilityCompliant') {
        newNoDisabilityCompliant = !newNoDisabilityCompliant

        if (newNoDisabilityCompliant) {
          disabilityCompliantValues.audioDisabilityCompliant = false
          disabilityCompliantValues.mentalDisabilityCompliant = false
          disabilityCompliantValues.motorDisabilityCompliant = false
          disabilityCompliantValues.visualDisabilityCompliant = false
        } else {
          const hasNoDisabilityCompliance = ![
            disabilityCompliantValues.audioDisabilityCompliant,
            disabilityCompliantValues.mentalDisabilityCompliant,
            disabilityCompliantValues.motorDisabilityCompliant,
            disabilityCompliantValues.visualDisabilityCompliant,
          ].includes(true)
          if (hasNoDisabilityCompliance) {
            newNoDisabilityCompliant = true
          }
        }
      } else {
        if (Object.values(disabilityCompliantValues).includes(true)) {
          newNoDisabilityCompliant = false
        } else {
          newNoDisabilityCompliant = true
        }
      }

      if (
        Object.values(disabilityCompliantValues).includes(true) &&
        'disabilityCompliant' in formErrors
      ) {
        let newFormErrors = { ...formErrors }
        delete newFormErrors['disabilityCompliant']
        setFormErrors(newFormErrors)
      }

      setNoDisabilityCompliant(newNoDisabilityCompliant)
      handleFormUpdate(disabilityCompliantValues)
    },
    [formErrors, formValues, handleFormUpdate, noDisabilityCompliant, setFormErrors]
  )

  const handleDurationChange = useCallback(value => handleFormUpdate({ durationMinutes: value }), [
    handleFormUpdate,
  ])

  const toggleReceiveNotification = useCallback(() => {
    const newReceiveNotificationEmails = !receiveNotificationEmails
    setReceiveNotificationEmails(newReceiveNotificationEmails)
    console.log(
      'toggleReceiveNotification',
      receiveNotificationEmails,
      newReceiveNotificationEmails
    )
    if (!newReceiveNotificationEmails) {
      handleFormUpdate({ bookingEmail: '' })
    }
  }, [handleFormUpdate, setReceiveNotificationEmails, receiveNotificationEmails])

  const displayRefundWarning = !offerIsRefundable(offerType, venue)

  const getErrorMessage = fieldName => {
    return fieldName in formErrors ? formErrors[fieldName] : null
  }

  const isTypeOfflineButOnlyVirtualVenues =
    offerType && offerType.offlineOnly && areAllVenuesVirtual

  console.log('RENDER formValues', formValues)
  console.log('isTypeOfflineButOnlyVirtualVenues', isTypeOfflineButOnlyVirtualVenues)
  console.log('areAllVenuesVirtual', areAllVenuesVirtual)
  // console.log('receiveNotificationEmails', receiveNotificationEmails)
  // console.log('offerFormFields', offerFormFields)
  if (isLoading) {
    return null
  }

  return (
    <form className="offer-form">
      {providerName !== null ? (
        <SynchronizedProviderInformation providerName={providerName} />
      ) : (
        <p className="page-subtitle">
          {'Tous les champs sont obligatoires sauf mention contraire.'}
        </p>
      )}

      <section className="form-section">
        <h3 className="section-title">
          {"Type d'offre"}
        </h3>
        <p className="section-description">
          {
            'Le type de l’offre permet de la caractériser et de la valoriser au mieux dans l’application.'
          }
        </p>

        <div className="form-row">
          <TypeTreeSelects
            areSubtypesVisible={!isTypeOfflineButOnlyVirtualVenues}
            isReadOnly={readOnlyFields.includes('type')}
            onSubTypeChange={handleFormUpdate}
            onTypeChange={onTypeChange}
            typeValues={{
              type: formValues.type,
              musicType: formValues.musicType,
              musicSubType: formValues.musicSubType,
              showType: formValues.showType,
              showSubType: formValues.showSubType,
            }}
            types={types}
          />
          {isTypeOfflineButOnlyVirtualVenues && (
            <InternalBanner
              href="/structures"
              linkTitle="+ Ajouter un lieu"
              subtitle="Pour créer une offre de ce type, ajoutez d’abord un lieu à l’une de vos structures."
              type="notification-info"
            />
          )}
        </div>
      </section>

      {formValues.type !== DEFAULT_FORM_VALUES.type && !isTypeOfflineButOnlyVirtualVenues && (
        <Fragment>
          <section className="form-section">
            <h3 className="section-title">
              {'Informations artistiques'}
            </h3>

            <div className="form-row">
              <TextareaInput
                countCharacters
                disabled={readOnlyFields.includes('name')}
                error={getErrorMessage('name')}
                label="Titre de l'offre"
                maxLength={90}
                name="name"
                onChange={handleSingleFormUpdate}
                required
                rows={1}
                subLabel={!MANDATORY_FIELDS.includes('name') ? 'Optionnel' : ''}
                value={formValues.name}
              />
            </div>
            <div className="form-row">
              <TextareaInput
                countCharacters
                disabled={readOnlyFields.includes('description')}
                error={getErrorMessage('description')}
                label="Description"
                maxLength={1000}
                name="description"
                onChange={handleSingleFormUpdate}
                rows={6}
                subLabel={!MANDATORY_FIELDS.includes('description') ? 'Optionnel' : ''}
                value={formValues.description}
              />
            </div>
            {offerFormFields.includes('speaker') && (
              <div className="form-row">
                <TextInput
                  disabled={readOnlyFields.includes('speaker')}
                  error={getErrorMessage('speaker')}
                  label="Intervenant"
                  name="speaker"
                  onChange={handleSingleFormUpdate}
                  subLabel={!MANDATORY_FIELDS.includes('speaker') ? 'Optionnel' : ''}
                  type="text"
                  value={formValues.speaker}
                />
              </div>
            )}

            {offerFormFields.includes('author') && (
              <div className="form-row">
                <TextInput
                  disabled={readOnlyFields.includes('author')}
                  error={getErrorMessage('author')}
                  label="Auteur"
                  name="author"
                  onChange={handleSingleFormUpdate}
                  subLabel={!MANDATORY_FIELDS.includes('author') ? 'Optionnel' : ''}
                  type="text"
                  value={formValues.author}
                />
              </div>
            )}

            {offerFormFields.includes('visa') && (
              <div className="form-row">
                <TextInput
                  disabled={readOnlyFields.includes('visa')}
                  error={getErrorMessage('visa')}
                  label="Visa d’exploitation"
                  name="visa"
                  onChange={handleSingleFormUpdate}
                  subLabel={!MANDATORY_FIELDS.includes('visa') ? 'Optionnel' : ''}
                  type="text"
                  value={formValues.visa}
                />
              </div>
            )}

            {offerFormFields.includes('isbn') && (
              <div className="form-row">
                <TextInput
                  disabled={readOnlyFields.includes('isbn')}
                  error={getErrorMessage('isbn')}
                  label="ISBN"
                  name="isbn"
                  onChange={handleSingleFormUpdate}
                  subLabel={!MANDATORY_FIELDS.includes('isbn') ? 'Optionnel' : ''}
                  type="text"
                  value={formValues.isbn}
                />
              </div>
            )}

            {offerFormFields.includes('stageDirector') && (
              <div className="form-row">
                <TextInput
                  disabled={readOnlyFields.includes('stageDirector')}
                  error={getErrorMessage('stageDirector')}
                  label="Metteur en scène"
                  name="stageDirector"
                  onChange={handleSingleFormUpdate}
                  subLabel={!MANDATORY_FIELDS.includes('stageDirector') ? 'Optionnel' : ''}
                  type="text"
                  value={formValues.stageDirector}
                />
              </div>
            )}

            {offerFormFields.includes('performer') && (
              <div className="form-row">
                <TextInput
                  disabled={readOnlyFields.includes('performer')}
                  error={getErrorMessage('perforer')}
                  label="Interprète"
                  name="performer"
                  onChange={handleSingleFormUpdate}
                  subLabel={!MANDATORY_FIELDS.includes('performer') ? 'Optionnel' : ''}
                  type="text"
                  value={formValues.performer}
                />
              </div>
            )}

            {offerFormFields.includes('durationMinutes') && (
              <div className="form-row">
                <DurationInput
                  disabled={readOnlyFields.includes('durationMinutes')}
                  error={getErrorMessage('durationMinutes')}
                  initialDurationInMinutes={formValues.durationMinutes}
                  label="Durée"
                  name="durationMinutes"
                  onChange={handleDurationChange}
                  placeholder="HH:MM"
                  subLabel={!MANDATORY_FIELDS.includes('durationMinutes') ? 'Optionnel' : ''}
                />
              </div>
            )}
          </section>

          <section className="form-section">
            <h3 className="section-title">
              {'Informations pratiques'}
            </h3>
            <p className="section-description">
              {
                'Les informations pratiques permettent de donner aux utilisateurs des informations sur le retrait de leur commande.'
              }
            </p>

            <div className="form-row">
              <Select
                defaultOption={{
                  displayName: 'Sélectionnez une structure',
                  id: DEFAULT_FORM_VALUES.offererId,
                }}
                error={getErrorMessage('offererId')}
                handleSelection={selectOfferer}
                isDisabled={readOnlyFields.includes('offererId')}
                label="Structure"
                name="offererId"
                options={offererOptions}
                selectedValue={formValues.offererId}
                subLabel={!MANDATORY_FIELDS.includes('offererId') ? 'Optionnel' : ''}
              />
            </div>

            <div className="form-row">
              <Select
                defaultOption={{
                  displayName: 'Sélectionnez un lieu',
                  id: DEFAULT_FORM_VALUES.venueId,
                }}
                error={getErrorMessage('venueId')}
                handleSelection={handleSingleFormUpdate}
                isDisabled={readOnlyFields.includes('venueId')}
                label="Lieu"
                name="venueId"
                options={venueOptions}
                selectedValue={formValues.venueId || DEFAULT_FORM_VALUES.venueId}
                subLabel={!MANDATORY_FIELDS.includes('venueId') ? 'Optionnel' : ''}
              />
            </div>
            {displayRefundWarning && (
              <div className="form-row">
                <OfferRefundWarning />
              </div>
            )}

            {offerType?.type === 'Thing' && venue && !venue.isVirtual && (
              <div className="form-row">
                <WithdrawalReminder />
              </div>
            )}

            <div className="form-row">
              <TextareaInput
                countCharacters
                disabled={readOnlyFields.includes('withdrawalDetails')}
                error={getErrorMessage('withdrawalDetails')}
                label="Informations de retrait"
                maxLength={500}
                name="withdrawalDetails"
                onChange={handleSingleFormUpdate}
                rows={6}
                subLabel={!MANDATORY_FIELDS.includes('withdrawalDetails') ? 'Optionnel' : ''}
                value={formValues.withdrawalDetails}
              />
            </div>

            {offerFormFields.includes('url') && (
              <div className="form-row">
                <TextInput
                  disabled={readOnlyFields.includes('url')}
                  error={getErrorMessage('url')}
                  label="URL d’accès à l’offre"
                  longDescription="Vous pouvez inclure {token} {email} et {offerId} dans l’URL, qui seront remplacés respectivement par le code de la contremarque, l’e-mail de la personne ayant reservé et l’identifiant de l’offre"
                  name="url"
                  onChange={handleSingleFormUpdate}
                  required
                  type="text"
                  value={formValues.url}
                />
              </div>
            )}
          </section>

          <section className="form-section accessibility-section">
            <h3 className="section-title">
              {'Accessibilité'}
            </h3>
            <p className="section-description">
              {'Cette offre est-elle accessible aux publics en situation de handicaps :'}
            </p>
            <CheckboxInput
              SvgElement={VisualDisabilitySvg}
              checked={formValues.visualDisabilityCompliant}
              isInError={Boolean(getErrorMessage('disabilityCompliant'))}
              label="Handicap visuel"
              name="visualDisabilityCompliant"
              onChange={handleDisabilityCompliantUpdate}
            />
            <CheckboxInput
              SvgElement={MentalDisabilitySvg}
              checked={formValues.mentalDisabilityCompliant}
              isInError={Boolean(getErrorMessage('disabilityCompliant'))}
              label="Handicap mental"
              name="mentalDisabilityCompliant"
              onChange={handleDisabilityCompliantUpdate}
            />
            <CheckboxInput
              SvgElement={MotorDisabilitySvg}
              checked={formValues.motorDisabilityCompliant}
              isInError={Boolean(getErrorMessage('disabilityCompliant'))}
              label="Handicap moteur"
              name="motorDisabilityCompliant"
              onChange={handleDisabilityCompliantUpdate}
            />
            <CheckboxInput
              SvgElement={AudioDisabilitySvg}
              checked={formValues.audioDisabilityCompliant}
              isInError={Boolean(getErrorMessage('disabilityCompliant'))}
              label="Handicap auditif"
              name="audioDisabilityCompliant"
              onChange={handleDisabilityCompliantUpdate}
            />
            <CheckboxInput
              checked={noDisabilityCompliant}
              isInError={Boolean(getErrorMessage('disabilityCompliant'))}
              label="Non accessible"
              name="noDisabilityCompliant"
              onChange={handleDisabilityCompliantUpdate}
            />

            {Boolean(getErrorMessage('disabilityCompliant')) && (
              <InputError message="Vous devez cocher l'une des options ci-dessus" />
            )}
          </section>

          <section className="form-section">
            <h3 className="section-title">
              {'Lien de réservation externe'}
            </h3>
            <p className="section-description">
              {'Ce lien sera affiché aux utilisateurs ne pouvant pas effectuer la réservation dans l’application. ' +
                'Nous vous recommandons d’insérer le lien vers votre billetterie ou votre site internet.'}
            </p>
            <TextInput
              disabled={readOnlyFields.includes('externalTicketOfficeUrl')}
              error={getErrorMessage('externalTicketOfficeUrl')}
              label="URL de redirection externe"
              name="externalTicketOfficeUrl"
              onChange={handleSingleFormUpdate}
              subLabel={!MANDATORY_FIELDS.includes('externalTicketOfficeUrl') ? 'Optionnel' : ''}
              type="text"
              value={formValues.externalTicketOfficeUrl}
            />
          </section>

          <section className="form-section">
            <h3 className="section-title">
              {'Autre'}
            </h3>

            {offerFormFields.includes('isNational') && (
              <div className="form-row">
                <CheckboxInput
                  checked={formValues.isNational || false}
                  disabled={readOnlyFields.includes('isNational') ? 'disabled' : ''}
                  label="Rayonnement national"
                  name="isNational"
                  onChange={handleSingleFormUpdate}
                />
              </div>
            )}
            {offerFormFields.includes('isDuo') && (
              <div className="form-row">
                <CheckboxInput
                  checked={formValues.isDuo || false}
                  disabled={readOnlyFields.includes('isDuo') ? 'disabled' : ''}
                  label={'Accepter les réservations "duo"'}
                  name="isDuo"
                  onChange={handleSingleFormUpdate}
                  subLabel={
                    "En activant cette option, vous permettez au bénéficiaire du pass Culture de venir accompagné. La seconde place sera délivrée au même tarif que la première, quel que soit l'accompagnateur."
                  }
                />
              </div>
            )}
            <div className="form-row">
              <CheckboxInput
                checked={receiveNotificationEmails}
                disabled={readOnlyFields.includes('bookingEmail')}
                label="Être notifié par email des réservations"
                name="receiveNotificationEmails"
                onChange={toggleReceiveNotification}
              />
            </div>

            {offerFormFields.includes('bookingEmail') && (
              <div className="form-row">
                <TextInput
                  disabled={readOnlyFields.includes('bookingEmail')}
                  error={getErrorMessage('bookingEmail')}
                  label="Email auquel envoyer les notifications :"
                  name="bookingEmail"
                  onChange={handleSingleFormUpdate}
                  placeholder="adresse@email.com"
                  required
                  type="email"
                  value={formValues.bookingEmail}
                />
              </div>
            )}
          </section>
        </Fragment>
      )}

      <section className="actions-section">
        {isEdition ? (
          <a
            className="secondary-link"
            href={backUrl}
          >
            {'Annuler et quitter'}
          </a>
        ) : null}
        <button
          className="primary-button"
          onClick={submitForm}
          type="button"
        >
          {isEdition ? 'Enregistrer' : 'Enregistrer et passer aux stocks'}
        </button>
      </section>
    </form>
  )
}

OfferForm.defaultProps = {
  backUrl: null,
  initialValues: {},
  isEdition: false,
  isUserAdmin: false,
  providerName: null,
  readOnlyFields: [],
}

OfferForm.propTypes = {
  backUrl: PropTypes.string,
  initialValues: PropTypes.shape(),
  isEdition: PropTypes.bool,
  isUserAdmin: PropTypes.bool,
  onFormValuesChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  providerName: PropTypes.string,
  readOnlyFields: PropTypes.arrayOf(PropTypes.string),
  showErrorNotification: PropTypes.func.isRequired,
  submitErrors: PropTypes.shape().isRequired,
}

export default OfferForm
