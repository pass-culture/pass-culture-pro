import React from 'react'

import styles from '../Bookings.module.scss'

import { ReactComponent as MessageIconSvg } from './assets/message-icon.svg'

const ChooseFiltersMessage = (): JSX.Element => (
  <div className={styles.warning}>
    <MessageIconSvg aria-hidden />
    <p>
      Pour visualiser vos réservations, veuillez sélectionner un ou plusieurs des filtres précédents
      et cliquer sur «&nbsp;Afficher&nbsp;»
    </p>
  </div>
)

export default ChooseFiltersMessage
