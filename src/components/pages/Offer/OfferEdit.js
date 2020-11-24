import React, { useEffect, useState } from 'react'

import PageTitle from 'components/layout/PageTitle/PageTitle'
import Titles from 'components/layout/Titles/Titles'
import * as pcapi from 'repository/pcapi/pcapi'

import OfferForm from './OfferForm'

const OfferEdit = (props) => {
  // TODO (rlecellier) : plugé sur un container avec withRouter, a therme utilisé le hook useRouter
  const { match } = props

  const [offer, setOffer] = useState(null)

  useEffect(async () => {
    if (!match.params.offerId) {
      return
    }
    // fetch offer using pcapi client
    const editOffer = await pcapi.loadOffer(offerId)
    setOffer(editOffer)
  }, [match.params.offerId])


  let title = 'Ajouter une offre'
  let pageTitle = 'Nouvelle une offre'
  if (offer) {
    title = 'Éditer une offre'
    pageTitle = 'Éditer une offre'
  }

  const handleSubmitOffer = (values) => {
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
        action={actionLink}
        subtitle={offerId && offer.name}
        title={title}
      />
      <OfferForm
        offer={offer}
        handleSubmit={handleSubmitOffer}
      />
    </div>
  )
}

export default OfferEdit
