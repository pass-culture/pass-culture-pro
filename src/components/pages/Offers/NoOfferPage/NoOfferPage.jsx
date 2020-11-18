import React from 'react'
import { Link } from 'react-router-dom'

import Icon from 'components/layout/Icon'

export const NoOfferPage = () => (
  <div className="no-search-results">
    <Icon
      className="image"
      svg="ico-ticket-gray"
    />

    <p className="highlight">
      {'Aucune offre'}
    </p>
    <p>
      {"Vous n'avez pas encore créé d'offre."}
    </p>

    <Link
      className="primary-button with-icon"
      to="/offres/creation"
    >
      <Icon svg="ico-plus" />
      {'Créer ma première offre'}
    </Link>
  </div>
)
