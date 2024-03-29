/*
* @debt directory "Gaël: this file should be migrated within the new directory structure"
*/

import { addDays, subDays } from 'date-fns'
import PropTypes from 'prop-types'
import React from 'react'

import PeriodSelector from 'components/layout/inputs/PeriodSelector/PeriodSelector'
import { DEFAULT_BOOKING_PERIOD } from 'components/pages/Bookings/PreFilters/_constants'
import { getToday } from 'utils/date'

const FilterByBookingPeriod = ({
  updateFilters,
  selectedBookingBeginningDate,
  selectedBookingEndingDate,
}) => {
  function handleBookingBeginningDateChange(bookingBeginningDate) {
    updateFilters({
      bookingBeginningDate: bookingBeginningDate
        ? bookingBeginningDate
        : subDays(selectedBookingEndingDate, DEFAULT_BOOKING_PERIOD),
    })
  }

  function handleBookingEndingDateChange(bookingEndingDate) {
    updateFilters({
      bookingEndingDate: bookingEndingDate
        ? bookingEndingDate
        : addDays(selectedBookingBeginningDate, DEFAULT_BOOKING_PERIOD),
    })
  }

  return (
    <PeriodSelector
      changePeriodBeginningDateValue={handleBookingBeginningDateChange}
      changePeriodEndingDateValue={handleBookingEndingDateChange}
      label="Période de réservation"
      maxDateEnding={getToday()}
      periodBeginningDate={selectedBookingBeginningDate || undefined}
      periodEndingDate={selectedBookingEndingDate}
      todayDate={getToday()}
    />
  )
}

FilterByBookingPeriod.propTypes = {
  selectedBookingBeginningDate: PropTypes.oneOfType([PropTypes.shape(), PropTypes.string])
    .isRequired,
  selectedBookingEndingDate: PropTypes.oneOfType([PropTypes.shape(), PropTypes.string]).isRequired,
  updateFilters: PropTypes.func.isRequired,
}

export default FilterByBookingPeriod
