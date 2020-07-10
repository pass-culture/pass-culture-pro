import React from 'react'
import * as PropTypes from 'prop-types'
import moment from 'moment'
import { getBookingStatusDisplayInformations } from './utils/bookingStatusConverter'

const BookingStatusCellHistory = ({ bookingStatusHistory }) => {
  const bookingsStatusHistoryItems = bookingStatusHistory.map(item => {
    const displayInfoFromStatus = getBookingStatusDisplayInformations(item.status)
    return (
      <li key={displayInfoFromStatus.status}>
        <span className={`colored-disc ${displayInfoFromStatus.historyClassName}`} />
        {`${displayInfoFromStatus.status} : ${computeDateForStatus(
          item,
          displayInfoFromStatus.dateFormat
        )}`}
      </li>
    )
  })

  function computeDateForStatus(item, dateFormat) {
    return item.date ? moment.parseZone(item.date).format(dateFormat) : '-'
  }

  return (<div className="booking-status-history">
    {bookingsStatusHistoryItems}
  </div>)
}

BookingStatusCellHistory.propTypes = {
  bookingStatusHistory: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
}

export default BookingStatusCellHistory
