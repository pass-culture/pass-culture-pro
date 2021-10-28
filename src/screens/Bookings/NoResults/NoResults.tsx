import React from 'react'

import Icon from 'components/layout/Icon'

import styles from '../Bookings.module.scss'

interface INoResultsProps {
  resetFilters():void;
}
/* @debt standards "Gaël: remove null icon attributes when Icon is correctly typed "*/
const NoResults = ({ resetFilters }: INoResultsProps): JSX.Element => (
  <div className={styles.warning}>
    <Icon
      alt={null}
      png={null}
      svg="ico-search-gray"
    />
    <p>
      Aucune réservation trouvée pour votre recherche.
    </p>
    <p>
      Veuillez modifier vos filtres et lancer une nouvelle recherche ou
      {' '}
      <button
        className="tertiary-button reset-filters-link"
        onClick={resetFilters}
        type="button"
      >
        réinitialiser tous les filtres.
      </button>
    </p>
  </div>
)

export default NoResults
