import isEqual from 'lodash.isequal'
import React, { useCallback, useEffect, useState, useMemo } from 'react'

import Spinner from 'components/layout/Spinner'
import { DEFAULT_FILTERS } from 'constants/booking'

import BookingsTable from './BookingsTable'
import ChooseFiltersMessage from './ChooseFiltersMessage'
import Filters from './Filters'
import NoResults from './NoResults'

interface IBookingProps {
  locationStatuses?: BookingStatus[];
  showResultLimitNotification(): void;
  notifyServerError(): void;
  locationVenueId?: string;
  getAllBookings: GetAllBookings;
  offerrerVenues: SelectOptions
}

const Booking = ({
  getAllBookings,
  locationStatuses = [],
  showResultLimitNotification,
  notifyServerError,
  locationVenueId,
  offerrerVenues
}:IBookingProps): JSX.Element => {
  const [filters, setFilters] = useState<IBookingFilters|null>(null)
  const [bookings, setBookings] = useState<ITableBooking[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const loadBookings = useCallback(
    async withFilters => {
      setIsLoading(true)

      if (!isEqual(withFilters, filters)) {
        setFilters(withFilters)
      }

      const { 
        hasReachedBookingsCountLimit,
        bookingList,
        requestStatus
      } = await getAllBookings(withFilters)

      setBookings(bookingList)
      setIsLoading(false)
      
      if (hasReachedBookingsCountLimit) {
        showResultLimitNotification()
      }

      if (requestStatus === 'error') {
        notifyServerError()
      }
    },
    [showResultLimitNotification, getAllBookings, filters, notifyServerError]
  )

  const initialFilters:IBookingFilters = useMemo(() => ({
    bookingBeginningDate: DEFAULT_FILTERS.bookingBeginningDate,
    bookingEndingDate: DEFAULT_FILTERS.bookingEndingDate,
    offerEventDate: DEFAULT_FILTERS.offerEventDate,
    offerVenueId: locationVenueId || DEFAULT_FILTERS.offerVenueId,
  }), [locationVenueId])

  const resetFilters = () => setFilters(initialFilters)

  useEffect(() => {
    if (filters) {
      loadBookings(filters)
    }
  }, [
    loadBookings,
    filters
  ])

  const shouldDisplayResults = bookings.length > 0 && !isLoading
  const shouldDisplayNoResults = filters && bookings.length === 0 && !isLoading

  return (
    <>
      <Filters
        filters={filters}
        initialFilters={initialFilters}
        isLoading={isLoading}
        offerrerVenues={offerrerVenues}
        setFilters={setFilters}
      />

      {shouldDisplayResults && (
        <BookingsTable
          bookings={bookings}
          locationStatuses={locationStatuses}
        />
      )}
      
      {isLoading && <Spinner />}
      {shouldDisplayNoResults && <NoResults resetFilters={resetFilters} />}
      {!filters && <ChooseFiltersMessage />}
    </>
  )
}

export default Booking