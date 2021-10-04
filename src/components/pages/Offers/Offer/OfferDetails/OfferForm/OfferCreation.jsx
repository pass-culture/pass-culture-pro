/*
* @debt complexity "Gaël: file nested too deep in directory structure"
* @debt directory "Gaël: this file should be migrated within the new directory structure"
*/

import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import Spinner from 'components/layout/Spinner'
import { getAccessibilityInitialValues } from 'components/pages/Offers/Offer/OfferDetails/OfferForm/AccessibilityCheckboxList'
import { computeOffersUrl } from 'components/pages/Offers/utils/computeOffersUrl'
import * as pcapi from 'repository/pcapi/pcapi'

import { DEFAULT_FORM_VALUES } from './_constants'
import OfferForm from './OfferForm'


const OfferCreation = ({
  formValues,
  queryFormValues,
  isSubmitLoading,
  isUserAdmin,
  userEmail,
  onSubmit,
  showErrorNotification,
  setPreviewOfferCategory,
  setShowThumbnailForm,
  setFormValues,
  submitErrors,
}) => {
  const venues = useRef([])
  const offerersNames = useRef([])
  const [isLoading, setIsLoading] = useState(true)
  const [displayedVenues, setDisplayedVenues] = useState([])
  const [selectedOfferer, setSelectedOfferer] = useState(queryFormValues.offererId)
  const [initialValues, setInitialValues] = useState({
    offererId: queryFormValues.offererId || DEFAULT_FORM_VALUES['offererId'],
    venueId: queryFormValues.venueId || DEFAULT_FORM_VALUES['venueId'],
  })

  const { categories } = useSelector(state => state.offers.categories)

  useEffect(() => setSelectedOfferer(queryFormValues.offererId), [queryFormValues.offererId])

  useEffect(() => {
    (async () => {
      // On first load store.offers.categories is not set.
      // in this case we want do display the spinner using isLoading === true.
      if (categories === undefined) {
        return
      }

      if (isUserAdmin) {
        const offererResponse = await pcapi.getOfferer(queryFormValues.offererId)

        offerersNames.current = [
          {
            id: offererResponse.id,
            name: offererResponse.name,
          },
        ]
        venues.current = offererResponse.managedVenues
        setDisplayedVenues(offererResponse.managedVenues)
      } else {
        const offerersResponse = await pcapi.getUserValidatedOfferersNames()
        offerersNames.current = offerersResponse

        const venuesResponse = await pcapi.getVenuesForOfferer({ activeOfferersOnly: true })
        venues.current = venuesResponse

        const venuesToDisplay = queryFormValues.offererId
          ? venuesResponse.filter(venue => venue.managingOffererId === queryFormValues.offererId)
          : venuesResponse

        setDisplayedVenues(venuesToDisplay)
      }

      if (queryFormValues.venueId) {
        const selectedVenue = venues.current.find((venue) => venue.id === queryFormValues.venueId)
        const venueAccessibility = getAccessibilityInitialValues({ venue: selectedVenue })
        setInitialValues((currentInitialValues) => ({ ...currentInitialValues, ...venueAccessibility }))
      }

      setIsLoading(false)
    })()
  }, [categories, isUserAdmin, setInitialValues, queryFormValues.offererId, queryFormValues.venueId])

  const filterVenuesForPro = useCallback(() => {
    const venuesToDisplay = selectedOfferer
      ? venues.current.filter(venue => venue.managingOffererId === selectedOfferer)
      : venues.current
    setDisplayedVenues(venuesToDisplay)
  }, [selectedOfferer])

  useEffect(() => {
    if (!isUserAdmin) {
      filterVenuesForPro()
    }
  }, [filterVenuesForPro, isUserAdmin])

  const isComingFromOffererPage = queryFormValues.offererId !== undefined

  const areAllVenuesVirtual =
    isComingFromOffererPage && selectedOfferer === queryFormValues.offererId
      ? venues.current
        .filter(venue => venue.managingOffererId === selectedOfferer)
        .every(venue => venue.isVirtual)
      : venues.current.every(venue => venue.isVirtual)

  if (isLoading) {
    return <Spinner />
  }

  return (
    <OfferForm
      areAllVenuesVirtual={areAllVenuesVirtual}
      backUrl={computeOffersUrl({})}
      formValues={formValues}
      initialValues={initialValues}
      isSubmitLoading={isSubmitLoading}
      isUserAdmin={isUserAdmin}
      offerersNames={offerersNames.current}
      onSubmit={onSubmit}
      readOnlyFields={isUserAdmin ? ['offererId'] : []}
      setFormValues={setFormValues}
      setIsLoading={setIsLoading}
      setPreviewOfferCategory={setPreviewOfferCategory}
      setSelectedOfferer={setSelectedOfferer}
      setShowThumbnailForm={setShowThumbnailForm}
      showErrorNotification={showErrorNotification}
      submitErrors={submitErrors}
      userEmail={userEmail}
      venues={displayedVenues}
    />
  )
}

OfferCreation.defaultProps = {
  isUserAdmin: false,
  queryFormValues: {},
}

OfferCreation.propTypes = {
  formValues: PropTypes.shape().isRequired,
  isSubmitLoading: PropTypes.bool.isRequired,
  isUserAdmin: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  queryFormValues: PropTypes.shape(),
  setFormValues: PropTypes.func.isRequired,
  setPreviewOfferCategory: PropTypes.func.isRequired,
  setShowThumbnailForm: PropTypes.func.isRequired,
  showErrorNotification: PropTypes.func.isRequired,
  submitErrors: PropTypes.shape().isRequired,
  userEmail: PropTypes.string.isRequired,
}

export default OfferCreation
