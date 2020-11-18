import React from 'react'
import { Link } from 'react-router-dom'

import Icon from 'components/layout/Icon'

export const CreateOfferActionLink = () => (
  <Link
    className="cta button is-primary"
    to="/offres/creation"
  >
    <span className="icon">
      <Icon svg="ico-offres-w" />
    </span>
    <span>
      {'Créer une offre'}
    </span>
  </Link>
)
