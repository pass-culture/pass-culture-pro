import PropTypes from 'prop-types'
import React, { Fragment } from 'react'

import Banner from 'components/layout/Banner/Banner'
import Icon from 'components/layout/Icon'
import { DEMARCHES_SIMPLIFIEES_OFFERER_RIB_UPLOAD_PROCEDURE_URL } from 'utils/config'

import { Offerer } from '../Offerer'

const BankInformation = ({ offerer }) => (
  <div className="section op-content-section bank-information">
    <div className="main-list-title title-actions-container">
      <h2 className="main-list-title-text">
        {'Coordonnées bancaires de la structure'}
      </h2>

      {offerer.areBankInformationProvided && (
        <a
          className="tertiary-link"
          href={DEMARCHES_SIMPLIFIEES_OFFERER_RIB_UPLOAD_PROCEDURE_URL}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon
            alt=""
            svg="ico-external-site"
          />
          {'Modifier'}
        </a>
      )}
    </div>

    {offerer.areBankInformationProvided ? (
      <Fragment>
        <p className="bi-subtitle">
          {
            'Les coordonnées bancaires ci-dessous seront attribuées à tous les lieux sans coordonnées bancaires propres :'
          }
        </p>
        <div className="op-detail">
          <span>
            {'IBAN : '}
          </span>
          <span>
            {offerer.iban}
          </span>
        </div>
        <div className="op-detail">
          <span>
            {'BIC : '}
          </span>
          <span>
            {offerer.bic}
          </span>
        </div>
      </Fragment>
    ) : offerer.demarchesSimplifieesApplicationId ? (
      <Banner
        href={`https://www.demarches-simplifiees.fr/dossiers/${offerer.demarchesSimplifieesApplicationId}`}
        linkTitle="Accéder au dossier"
      >
        {'Votre dossier est en cours pour cette structure'}
      </Banner>
    ) : (
      <Fragment>
        <p className="bi-subtitle">
          {'Aucune coordonnée bancaire renseignée'}
        </p>
        <Banner
          href={DEMARCHES_SIMPLIFIEES_OFFERER_RIB_UPLOAD_PROCEDURE_URL}
          linkTitle="Renseignez les coordonnées bancaires de la structure"
        >
          {'Renseignez vos coordonnées bancaires pour être remboursé de vos offres éligibles'}
        </Banner>
      </Fragment>
    )}
    <Banner
      href="https://aide.passculture.app/fr/article/acteurs-determiner-ses-modalites-de-remboursement-1ab6g2m/"
      linkTitle="En savoir plus sur les remboursements"
      type="notification-info"
    />
  </div>
)

BankInformation.propTypes = {
  offerer: PropTypes.instanceOf(Offerer).isRequired,
}

export default BankInformation
