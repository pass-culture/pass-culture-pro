import { format } from 'date-fns-tz'
import React from 'react'

import { FORMAT_DD_MM_YYYY_HH_mm, toDateStrippedOfTimezone } from 'utils/date'

import styles from './Cells.module.scss'

interface IBookingOfferCellProps {
  value: ITableBooking['offer']
}

const BookingOfferCell = ({ value }: IBookingOfferCellProps): JSX.Element => {
  const offer = value
  const eventBeginningDatetime = offer.eventBeginningDate
  const isbn = offer.isbn

  const eventDatetimeFormatted = eventBeginningDatetime
    ? format(toDateStrippedOfTimezone(eventBeginningDatetime), FORMAT_DD_MM_YYYY_HH_mm)
    : null

  return (
    <a
      href={`/offres/${offer.id}/edition`}
      rel="noopener noreferrer"
      target="_blank"
      title={`${offer.name} (ouverture dans un nouvel onglet)`}
    >
      <div className={styles['booking-offer-name']}>
        {offer.name}
      </div>
      {(isbn || eventBeginningDatetime) && (
        <div className={styles['booking-offer-additional-info']}>
          {eventDatetimeFormatted || isbn}
        </div>
      )}
    </a>
  )
}

export default BookingOfferCell
