// eslint-disable react/no-multi-comp
import cx from 'classnames'
import { format } from 'date-fns-tz'
import React from 'react'

import { toDateStrippedOfTimezone } from 'utils/date'

import { statusDisplayInfos } from '../utils/statusDisplayInfos'

import styles from './Cells.module.scss'

interface IBookingStatusCellHistoryProps {
  bookingRecapInfo: ITableBooking
} 

const statusDateFormater = (
  item: IBookingStatusHistoryItem,
  dateFormat: string
): string => item.date 
  ? format(toDateStrippedOfTimezone(item.date), dateFormat)
  : '-'

const BookingStatusCellHistory = ({
  bookingRecapInfo 
}: IBookingStatusCellHistoryProps): JSX.Element => {

  const amount: string = bookingRecapInfo.amount 
    ? `${bookingRecapInfo.amount}\u00A0€`.replace('.', ',')
    : 'Gratuit'

  return (
    <>
      <div className={styles['status-history-offer-title']}>
        {bookingRecapInfo.offer.name}
      </div>
      <div className={styles['status-history-offer-amount']}>
        {`Prix : ${amount}`}
      </div>
      <div className={styles['status-history-title']}>
        Historique
      </div>
      <ul>
        {bookingRecapInfo.statusHistory.map((item: IBookingStatusHistoryItem): JSX.Element => {
          const statusInfos = statusDisplayInfos(item.status)
          return (
            <li 
              key={statusInfos.label}
              className={styles['status-history-item']}
            >
              <span className={cx(styles['status-history-disc'], styles[statusInfos.statusColorClass])} />
              {`${statusInfos.label} : ${statusDateFormater(item, statusInfos.dateFormat)}`}
            </li>
          )
        }
        )}
      </ul>
    </>
  )
}

export default BookingStatusCellHistory
