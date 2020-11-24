import React, { useEffect, useState } from 'react'

import PageTitle from 'components/layout/PageTitle/PageTitle'
import Titles from 'components/layout/Titles/Titles'
import * as pcapi from 'repository/pcapi/pcapi'

import OfferForm from './OfferForm/OfferForm'

const OfferDetails = (props) => {
  // TODO (rlecellier) : plugé sur un container avec withRouter, à terme utiliser le hook useRouter
  const { match } = props

  const [offer, setOffer] = useState(null)

  useEffect(() => {
    async function loadOffer(offerId) {
      const editOffer = await pcapi.loadOffer(offerId)
      setOffer(editOffer)
    }
    if (match.params.offerId) {
      loadOffer(match.params.offerId)
    }
  }, [match.params.offerId])


  let title = 'Ajouter une offre'
  let pageTitle = 'Nouvelle une offre'
  if (offer) {
    title = 'Éditer une offre'
    pageTitle = 'Éditer une offre'
  }

  function handleSubmitOffer(values) {
    if (offer) {
      pcapi.createOffer(values)
    } else {
      pcapi.updateOffer(values)
    }
  }

  return (
    <div>
      <PageTitle title={pageTitle} />
      <Titles
        subtitle={offer && offer.name}
        title={title}
      />
      <OfferForm
        handleSubmit={handleSubmitOffer}
        offer={offer}
      />
    </div>
  )
}

export default OfferDetails
