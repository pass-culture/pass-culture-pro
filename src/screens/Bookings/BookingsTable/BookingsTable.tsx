import React, { useState, useEffect, useMemo, useCallback } from 'react'

import { NB_BOOKINGS_PER_PAGE } from 'constants/booking'

import Columns from './Columns'
import { ALL_BOOKING_STATUS, DEFAULT_OMNISEARCH_FIELD } from './Filters/_constants'
import Filters from './Filters/Filters'
import Header from './Header'
import NoFilteredBookings from './NoFilteredBookings'
import Table from './Table'
import filterBookingsRecap from './utils/filterBookingsRecap'

interface IBookingTableProps {
  locationStatuses: BookingStatus[];
  bookings: ITableBooking[];
}

const BookingsTable = ({ bookings, locationStatuses }: IBookingTableProps): JSX.Element => {
  const [filteredBookings, setFilteredBookings] = useState(bookings)
  const [currentPage, setCurrentPage] = useState(0)
  const initialFilters = useMemo<{
    byKeyWord: SearchByTextFilters;
    bookingStatus: BookingStatus[];
  }>(() => ({
    byKeyWord: {
      field: DEFAULT_OMNISEARCH_FIELD,
      text: ''
    },
    bookingStatus: locationStatuses?.length
      ? locationStatuses
      : [...ALL_BOOKING_STATUS],
  }), [locationStatuses])

  const [filters, setFilters] = useState(initialFilters)

  const setKeyWordFilters = useCallback((byKeyWord) => {
    setFilters(currentFilters => ({
      ...currentFilters,
      byKeyWord: {
        ...currentFilters.byKeyWord,
        ...byKeyWord
      },
    }))
  }, [])

  const setBookingStatusFilter = useCallback((bookingStatus) => {
    setFilters(currentFilters => ({
      ...currentFilters,
      bookingStatus,
    }))
  }, [])
  
  const columns = useMemo(
    () => Columns({
      bookings,
      bookingStatusFilter: filters.bookingStatus,
      setGlobalBookingStatusFilter: setBookingStatusFilter
    }),
    [filters, bookings, setBookingStatusFilter]
  )

  useEffect(() => {
    const filteredBookings = filterBookingsRecap(bookings, filters)
    setFilteredBookings(filteredBookings)
    setCurrentPage(0)
  }, [bookings, filters])

  const resetFilters = useCallback(() => {
    setFilters(initialFilters)
  }, [initialFilters])

  const nbBookings = filteredBookings?.length

  return (
    <>
      <Filters
        currentFilters={filters.byKeyWord}
        updateFilters={setKeyWordFilters}
      />
      {nbBookings > 0 ? (
        <>
          <Header
            filteredBookings={filteredBookings}
          />
          <Table
            columns={columns}
            currentPage={currentPage}
            data={filteredBookings}
            nbBookings={nbBookings}
            nbBookingsPerPage={NB_BOOKINGS_PER_PAGE}
            updateCurrentPage={setCurrentPage}
          />
        </>
      ) : (
        <NoFilteredBookings resetFilters={resetFilters} />
      )}
    </>
  )
}


export default BookingsTable
