import React, { useEffect, useState, useCallback } from 'react'
import { useLocation } from "react-router-dom"

import useNotification from 'components/hooks/useNotification'
import PageTitle from 'components/layout/PageTitle/PageTitle'
import Spinner from 'components/layout/Spinner'
import Titles from 'components/layout/Titles/Titles'
import BookingsScreen from 'screens/Bookings'

import getAllBookings from './getAllBookings'
import getOffererVenues from './getOfferrerVenues'

const Bookings = (): JSX.Element => {
  const { state: locationState } = useLocation<{Statuses?: BookingStatus[]; venueId?: string;}>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [offerrerVenues, setOfferrerVenues] = useState<SelectOptions>([])
  const notify = useNotification()

  const locationVenueId = locationState?.venueId
  const locationStatuses = locationState?.Statuses

  const notifyServerError = useCallback(() => notify.error(
    'Nous avons rencontré un problème lors du chargement des données, essayez de recharger la page. Notre équipe à été informée de ce problème et travaille à sa résolution'
  ), [notify])

  const showResultLimitNotification = useCallback(() => notify.information(
    'L’affichage des réservations a été limité à 5 000 réservations. Vous pouvez modifier les filtres pour affiner votre recherche.'
  ), [notify])

  useEffect(() => {
    if (!isLoading) return
    
    (async () => {
      const response = await getOffererVenues()
      setOfferrerVenues(response.venues)
      
      if (response.requestStatus === 'error') {
        notifyServerError()
      }
      setIsLoading(false)
    })()
  }, [notifyServerError, isLoading])

  return (
    <>
      <PageTitle title="Vos réservations" />
      <Titles title="Réservations" />

      {isLoading ? (
        <Spinner />
      ) : (
        <BookingsScreen
          getAllBookings={getAllBookings}
          locationStatuses={locationStatuses}
          locationVenueId={locationVenueId}
          notifyServerError={notifyServerError}
          offerrerVenues={offerrerVenues}
          showResultLimitNotification={showResultLimitNotification}
        />
      )}
    </>
  )
}

export default Bookings
