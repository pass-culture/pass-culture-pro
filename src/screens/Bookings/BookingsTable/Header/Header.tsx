import React, { useMemo } from 'react'
import { CSVLink } from 'react-csv'

import Icon from 'components/layout/Icon'
import { pluralize } from 'utils/pluralize'

import generateBookingsCsvFile from '../utils/generateBookingsCsvFile'

import styles from './Header.module.scss'

interface IHeaderProps {
  filteredBookings: ITableBooking[]
}

const Header = ({ filteredBookings }: IHeaderProps): JSX.Element => {
  const csvData = useMemo(
    () => generateBookingsCsvFile(filteredBookings),
    [filteredBookings]
  )
  /* @debt standards "Gaël: remove png null icon attribute when Icon is correctly typed "*/
  return (
    <div className={styles['bookings-header']}>
      <span>
        {pluralize(filteredBookings.length, 'réservation')}
      </span>
      <span className={styles['bookings-header-csv-download']}>
        <CSVLink
          data={csvData}
          filename="Réservations Pass Culture.csv"
          separator=";"
        >
          <Icon
            alt="Télécharger le CSV"
            png={null}
            svg="ico-download"
          />
          Télécharger le CSV
        </CSVLink>
      </span>
    </div>
  )
}

export default Header
