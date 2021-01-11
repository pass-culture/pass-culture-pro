import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

import { isAllocineOffer, isSynchronizedOffer } from 'components/pages/Offer/domain/localProvider'
import * as pcapi from 'repository/pcapi/pcapi'

import { computeOffersUrl } from '../../../utils/computeOffersUrl'

import { DEFAULT_FORM_VALUES, EDITED_OFFER_READ_ONLY_FIELDS } from './_constants'
import OfferForm from './OfferForm'

const OfferEdition = ({
  isUserAdmin,
  isLoading,
  offer,
  offersSearchFilters,
  onSubmit,
  setIsLoading,
  setShowThumbnailForm,
  showErrorNotification,
  submitErrors,
}) => {
  const [types, setTypes] = useState([])
  const [readOnlyFields, setReadOnlyFields] = useState([])
  const [initialValues, setInitialValues] = useState([])

  useEffect(function retrieveDataOnMount() {
    pcapi.loadTypes().then(receivedTypes => setTypes(receivedTypes))
  }, [])

  const computeInitialValues = offer => {
    const initialValues = Object.keys(DEFAULT_FORM_VALUES).reduce((acc, field) => {
      if (field in offer && offer[field] !== null) {
        return { ...acc, [field]: offer[field] }
      } else if (offer.extraData && field in offer.extraData) {
        return { ...acc, [field]: offer.extraData[field] }
      }
      return { ...acc, [field]: DEFAULT_FORM_VALUES[field] }
    }, {})

    initialValues.offererId = offer.venue.managingOffererId
    return initialValues
  }

  const computeReadOnlyFields = offer => {
    let readOnlyFields = []
    const isOfferSynchronized = isSynchronizedOffer(offer)
    if (isOfferSynchronized) {
      let synchonizedOfferReadOnlyFields = Object.keys(DEFAULT_FORM_VALUES)
      if (isAllocineOffer(offer)) {
        synchonizedOfferReadOnlyFields = synchonizedOfferReadOnlyFields.filter(
          fieldName => fieldName !== 'isDuo'
        )
      }
      readOnlyFields = synchonizedOfferReadOnlyFields
    } else {
      readOnlyFields = EDITED_OFFER_READ_ONLY_FIELDS
    }
    return readOnlyFields
  }

  useEffect(() => {
    const initialValues = computeInitialValues(offer)
    const readOnlyFields = computeReadOnlyFields(offer)
    setInitialValues(initialValues)
    setReadOnlyFields(readOnlyFields)
    setIsLoading(false)
  }, [offer, setIsLoading])

  let providerName = null
  if (isSynchronizedOffer(offer)) {
    providerName = offer.lastProvider.name
  }

  if (isLoading) {
    return null
  }

  return (
    <OfferForm
      backUrl={computeOffersUrl(offersSearchFilters)}
      initialValues={initialValues}
      isEdition
      isUserAdmin={isUserAdmin}
      offerers={[offer.venue.managingOfferer]}
      onSubmit={onSubmit}
      providerName={providerName}
      readOnlyFields={readOnlyFields}
      setShowThumbnailForm={setShowThumbnailForm}
      showErrorNotification={showErrorNotification}
      submitErrors={submitErrors}
      types={types}
      venues={[offer.venue]}
    />
  )
}

OfferEdition.defaultProps = {
  isUserAdmin: false,
  offer: null,
}

OfferEdition.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isUserAdmin: PropTypes.bool,
  offer: PropTypes.shape(),
  offersSearchFilters: PropTypes.shape({
    name: PropTypes.string,
    offererId: PropTypes.string,
    venueId: PropTypes.string,
    typeId: PropTypes.string,
    status: PropTypes.string,
    creationMode: PropTypes.string,
    periodBeginningDate: PropTypes.string,
    periodEndingDate: PropTypes.string,
    page: PropTypes.number,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  setIsLoading: PropTypes.func.isRequired,
  setShowThumbnailForm: PropTypes.func.isRequired,
  showErrorNotification: PropTypes.func.isRequired,
  submitErrors: PropTypes.shape().isRequired,
}

export default OfferEdition
