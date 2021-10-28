import cx from 'classnames'
import React from 'react'

import Icon from 'components/layout/Icon'

import { statusDisplayInfos } from '../utils/statusDisplayInfos'

import BookingStatusCellHistory from './BookingStatusCellHistory'
import styles from './Cells.module.scss'


interface IBookingStatusCell { 
  row: {
    original: ITableBooking
  } 
}

const BookingStatusCell = ({ row }: IBookingStatusCell): JSX.Element => {  
  const bookingDisplayInfo = statusDisplayInfos(
    row.original.status
  )

  /* @debt standards "Gaël: remove null and png icon attributes when Icon is correctly typed "*/
  return (
    <div
      className={cx(
        styles['booking-status-label'],
        styles['booking-status-wrapper'],
        styles[bookingDisplayInfo.statusColorClass]
      )}
    >
      <Icon
        alt={null}
        png={null}
        svg={bookingDisplayInfo.svgIconFilename}
      />
      <span>
        {bookingDisplayInfo.status}
      </span>
      <div className={styles['booking-status-tooltip']}>
        <BookingStatusCellHistory bookingRecapInfo={row.original} />
      </div>
    </div>
  )
}

export default BookingStatusCell
