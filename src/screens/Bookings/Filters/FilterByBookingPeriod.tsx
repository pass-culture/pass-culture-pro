import { addDays, subDays } from 'date-fns'
import React, { FC } from 'react'

import PeriodSelector from 'components/layout/inputs/PeriodSelector/PeriodSelector'
import { DEFAULT_BOOKING_PERIOD } from 'constants/booking'
import { getToday } from 'utils/date'


interface IFilterByBookingPeriodProps {
  selectedBookingBeginningDate: Date;
  selectedBookingEndingDate: Date;
  updateFilters(filters: Partial<IBookingFilters>): void;
}

const FilterByBookingPeriod: FC<IFilterByBookingPeriodProps> = ({
  updateFilters,
  selectedBookingBeginningDate,
  selectedBookingEndingDate,
}) => {
  const handleBookingBeginningDateChange = (bookingBeginningDate: Date) => updateFilters({
    bookingBeginningDate: bookingBeginningDate
      ? bookingBeginningDate
      : subDays(selectedBookingEndingDate, DEFAULT_BOOKING_PERIOD),
  })

  const handleBookingEndingDateChange = (bookingEndingDate: Date) => updateFilters({
    bookingEndingDate: bookingEndingDate
      ? bookingEndingDate
      : addDays(selectedBookingBeginningDate, DEFAULT_BOOKING_PERIOD),
  })

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



export default FilterByBookingPeriod
