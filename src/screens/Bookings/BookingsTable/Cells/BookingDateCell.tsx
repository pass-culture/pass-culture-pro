import { format } from 'date-fns'
import React from 'react'

import { 
  FORMAT_DD_MM_YYYY,
  FORMAT_HH_mm,
  toDateStrippedOfTimezone
} from 'utils/date'

import styles from './Cells.module.scss'

interface IBookingDateCellProps {
  value: ITableBooking['date'];
}
const BookingDateCell = ({
  value 
}: IBookingDateCellProps): JSX.Element => {
  const bookingDate = toDateStrippedOfTimezone(value)
  const bookingDateDay = format(bookingDate, FORMAT_DD_MM_YYYY)
  const bookingDateHour = format(bookingDate, FORMAT_HH_mm)

  return (
    <div>
      <span>
        {bookingDateDay}
      </span>
      <br />
      <span className={styles['booking-date-subtitle']}>
        {bookingDateHour}
      </span>
    </div>
  )
}

export default BookingDateCell
