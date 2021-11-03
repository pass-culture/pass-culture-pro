import React from 'react'

import Icon from 'components/layout/Icon'

import styles from './NoFilteredBookings.module.scss'

interface INoFilteredBookings {
  resetFilters(): void;
}

const NoFilteredBookings = ({ resetFilters }:INoFilteredBookings): JSX.Element => (
  <div className={styles['no-bookings']}>
    <Icon
      alt={null}
      className={styles['no-bookings-icon']}
      png={null}
      svg="ico-search-gray"
    />
    <p className={styles['no-bookings-paragraph']}>
      Aucune réservation trouvée pour votre recherche
    </p>
    <p className={styles['no-bookings-paragraph']}>
      Vous pouvez modifier votre recherche ou
      {' '}
      <button
        className={styles['no-bookings-button']}
        onClick={resetFilters}
        type="button"
      >
        afficher toutes les réservations
      </button>
    </p>
  </div>
)

export default NoFilteredBookings
