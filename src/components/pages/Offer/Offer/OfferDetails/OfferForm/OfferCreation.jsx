import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import * as pcapi from 'repository/pcapi/pcapi'

import OfferForm from './OfferForm'

const OfferCreation = ({
  initialValues,
  isLoading,
  isUserAdmin,
  onSubmit,
  showErrorNotification,
  setIsLoading,
  onFormValuesChange,
  submitErrors,
}) => {
  const venues = useRef([])
  const types = useRef([])
  const offerers = useRef([])
  const [displayedVenues, setDisplayedVenues] = useState([])
  const [selectedOffererId, setSelectedOffererId] = useState(initialValues.offererId)

  useEffect(() => setSelectedOffererId(initialValues.offererId), [initialValues.offererId])
  useEffect(
    function retrieveDataOnMount() {
      const typesRequest = pcapi.loadTypes().then(receivedTypes => (types.current = receivedTypes))
      const offerersRequest = pcapi.getValidatedOfferers().then(receivedOfferers => {
        offerers.current = receivedOfferers
      })
      const requests = [typesRequest, offerersRequest]
      if (!isUserAdmin) {
        const venuesRequest = pcapi.getVenuesForOfferer().then(receivedVenues => {
          venues.current = receivedVenues
          const venuesToDisplay = initialValues.offererId
            ? receivedVenues.filter(venue => venue.managingOffererId === initialValues.offererId)
            : receivedVenues
          setDisplayedVenues(venuesToDisplay)
        })
        requests.push(venuesRequest)
      }
      Promise.all(requests).then(() => setIsLoading(false))
    },
    [initialValues.offererId, isUserAdmin, setIsLoading]
  )

  const getVenuesForAdmin = useCallback(() => {
    console.log('OfferCreation::useCallback::getVenuesForAdmin')
    if (selectedOffererId) {
      pcapi.getVenuesForOfferer(selectedOffererId).then(receivedVenues => {
        venues.current = receivedVenues
        setDisplayedVenues(receivedVenues)
        console.log('OfferCreation::useCallback::getVenuesForAdmin::receivedVenues', receivedVenues)
      })
    } else {
      setDisplayedVenues([])
    }
  }, [selectedOffererId])

  const filterVenuesForPro = useCallback(() => {
    console.log('OfferCreation::useCallback::filterVenuesForPro')
    const venuesToDisplay = selectedOffererId
      ? venues.current.filter(venue => venue.managingOffererId === selectedOffererId)
      : venues.current
    setDisplayedVenues(venuesToDisplay)
    console.log('OfferCreation::useCallback::filterVenuesForPro::venuesToDisplay', venuesToDisplay)
  }, [selectedOffererId])

  useEffect(() => {
    if (isUserAdmin) {
      getVenuesForAdmin()
    } else {
      filterVenuesForPro()
    }
  }, [filterVenuesForPro, getVenuesForAdmin, isUserAdmin])

  const isComingFromOffererPage = initialValues.offererId !== undefined
  console.log(
    'are offer truc much',
    isComingFromOffererPage &&
      initialValues.offererId == selectedOffererId &&
      selectedOffererId === initialValues.offererId
  )
  const areAllVenuesVirtual =
    isComingFromOffererPage &&
    initialValues.offererId == selectedOffererId &&
    selectedOffererId === initialValues.offererId
      ? venues.current
          .filter(venue => venue.managingOffererId === selectedOffererId)
          .every(venue => venue.isVirtual)
      : venues.current.every(venue => venue.isVirtual)

  if (isLoading) {
    return null
  }

  return (
    <OfferForm
      areAllVenuesVirtual={areAllVenuesVirtual}
      initialValues={initialValues}
      isUserAdmin={isUserAdmin}
      offerers={offerers.current}
      onFormValuesChange={onFormValuesChange}
      onSubmit={onSubmit}
      setIsLoading={setIsLoading}
      setSelectedOffererId={setSelectedOffererId}
      showErrorNotification={showErrorNotification}
      submitErrors={submitErrors}
      types={types.current}
      venues={displayedVenues}
    />
  )
}

OfferCreation.defaultProps = {
  initialValues: {},
  isUserAdmin: false,
}

OfferCreation.propTypes = {
  initialValues: PropTypes.shape(),
  isLoading: PropTypes.bool.isRequired,
  isUserAdmin: PropTypes.bool,
  onFormValuesChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  setIsLoading: PropTypes.func.isRequired,
  showErrorNotification: PropTypes.func.isRequired,
  submitErrors: PropTypes.shape().isRequired,
}

export default OfferCreation
