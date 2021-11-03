import React from 'react'

import { ReactComponent as DuoSvg } from 'icons/ico-duo.svg'

import styles from './Cells.module.scss'

interface IBookingIsDuoCellProps {
  value: ITableBooking['isDuo']
}

const BookingIsDuoCell = ({
  value 
}: IBookingIsDuoCellProps): JSX.Element => (
  <span className={styles['bookings-duo-icon']}>
    {value && <DuoSvg title="Réservation DUO" />}
  </span>
)

export default BookingIsDuoCell
