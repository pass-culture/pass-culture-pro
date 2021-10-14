/*
 * @debt complexity "Gaël: file nested too deep in directory structure"
 * @debt directory "Gaël: this file should be migrated within the new directory structure"
 */

import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import Spinner from 'components/layout/Spinner'
import { getAccessibilityInitialValues } from 'components/pages/Offers/Offer/OfferDetails/OfferForm/AccessibilityCheckboxList'
import { computeOffersUrl } from 'components/pages/Offers/utils/computeOffersUrl'
import * as pcapi from 'repository/pcapi/pcapi'

import { DEFAULT_FORM_VALUES } from './_constants'
import OfferForm from './OfferForm'

const OfferCreation = ({
  categories,
  isUserAdmin,
  onSubmit,
  queryParams,
  setOfferPreviewData,
  showErrorNotification,
  subCategories,
  submitErrors,
  userEmail,
}) => {
  const venues = useRef([])
  const offerersNames = useRef([])
  const [isLoading, setIsLoading] = useState(true)
  const [displayedVenues, setDisplayedVenues] = useState([])
  const [selectedOfferer, setSelectedOfferer] = useState(queryParams.offererId || DEFAULT_FORM_VALUES['offererId'])
  const [initialValues, setInitialValues] = useState({
    offererId: queryParams.offererId || DEFAULT_FORM_VALUES['offererId'],
    venueId: queryParams.venueId || DEFAULT_FORM_VALUES['venueId'],
  })

  useEffect(() => setSelectedOfferer(queryParams.offererId), [queryParams.offererId])

  useEffect(() => {
    (async () => {
      if (isUserAdmin) {
        const offererResponse = await pcapi.getOfferer(queryParams.offererId)

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

        const venuesToDisplay = queryParams.offererId
          ? venuesResponse.filter(venue => venue.managingOffererId === queryParams.offererId)
          : venuesResponse

        setDisplayedVenues(venuesToDisplay)
      }

      if (queryParams.venueId) {
        const selectedVenue = venues.current.find((venue) => venue.id === queryParams.venueId)
        const venueAccessibility = getAccessibilityInitialValues({ venue: selectedVenue })
        setInitialValues((currentInitialValues) => ({ ...currentInitialValues, ...venueAccessibility }))
      }

      setIsLoading(false)
    })()
  }, [isUserAdmin, queryParams.offererId, queryParams.venueId])

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

  const isComingFromOffererPage = queryParams.offererId !== undefined

  const areAllVenuesVirtual =
    isComingFromOffererPage && selectedOfferer === queryParams.offererId
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
      categories={categories}
      initialValues={initialValues}
      isUserAdmin={isUserAdmin}
      offerersNames={offerersNames.current}
      onSubmit={onSubmit}
      readOnlyFields={isUserAdmin ? ['offererId'] : []}
      setIsLoading={setIsLoading}
      setOfferPreviewData={setOfferPreviewData}
      setSelectedOfferer={setSelectedOfferer}
      showErrorNotification={showErrorNotification}
      subCategories={subCategories}
      submitErrors={submitErrors}
      userEmail={userEmail}
      venues={displayedVenues}
    />
  )
}

OfferCreation.defaultProps = {
  isUserAdmin: false,
  queryParams: {},
}

OfferCreation.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isUserAdmin: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  queryParams: PropTypes.shape(),
  setOfferPreviewData: PropTypes.func.isRequired,
  showErrorNotification: PropTypes.func.isRequired,
  subCategories: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  submitErrors: PropTypes.shape().isRequired,
  userEmail: PropTypes.string.isRequired,
}

export default OfferCreation
