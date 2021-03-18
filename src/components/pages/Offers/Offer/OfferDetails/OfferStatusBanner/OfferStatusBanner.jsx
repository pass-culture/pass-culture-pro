import PropTypes from 'prop-types'
import React from 'react'

import Banner from 'components/layout/Banner/Banner'
import { OFFER_STATUS } from 'components/pages/Offers/Offers/domain/offerStatus'
import { CGU_URL } from 'utils/config'

const OfferStatusBanner = ({ status }) => {
  return (
    <div className="of-offer-status-banner">
      {status === OFFER_STATUS.REJECTED ? (
        <Banner
          href={CGU_URL}
          linkTitle="Consulter les Conditions Générales d'Utilisation"
          message="Votre offre a été refusée car elle ne respecte pas les Conditions Générales d'Utilisation du pass. Un email contenant les conditions d'éligibilité d'une offre a été envoyé à l'adresse mail attachée à votre compte."
        />
      ) : (
        <Banner
          message="Votre offre est en cours de validation par l'équipe du pass Culture. Une fois validée, vous recevrez un email de confirmation et votre offre sera automatiquement mise en ligne."
          type="notification-info"
        />
      )}
    </div>
  )
}

OfferStatusBanner.propTypes = {
  status: PropTypes.oneOf([OFFER_STATUS.REJECTED, OFFER_STATUS.AWAITING]).isRequired,
}

export default OfferStatusBanner