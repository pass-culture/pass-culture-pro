import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import { OffererClass } from './OffererClass'
import HeroSection from '../../../layout/HeroSection/HeroSection'
import Main from '../../../layout/Main'
import Venues from './Venues/Venues'

/* eslint-disable */
class OffererDetails extends PureComponent {
  render() {
    const { offerer, venues } = this.props

    return (
      <Main
        backTo={{ label: 'Vos structures juridiques', path: '/structures' }}
        name="offerer"
      >
        <HeroSection
          subtitle={offerer.name}
          title="Structure"
        >
          <p className="subtitle">
            {'Détails de la structure rattachée, des lieux et des fournisseurs de ses offres.'}
          </p>
        </HeroSection>
        <div>
          <div>
            <label>
              {'SIREN : '}
            </label>
            <span>
              {offerer.siren}
            </span>
          </div>
          <div>
            <label>
              {'Désignation : '}
            </label>
            <span>
              {offerer.name}
            </span>
          </div>
          <div>
            <label>
              {'Siège social : '}
            </label>
            <span>
              {offerer.address}
            </span>
          </div>
          <div>
            <label>
              {'Code postal : '}
            </label>
            <span>
              {offerer.postalCode}
            </span>
          </div>
          <div>
            <label>
              {'Ville : '}
            </label>
            <span>
              {offerer.city}
            </span>
          </div>
        </div>

        <div className="section">
          <h2 className="main-list-title">
            {'Informations bancaires'}
            <span className="is-pulled-right is-size-7 has-text-grey">
              {!offerer.adminUserOfferer &&
              "Vous avez besoin d'être administrateur de la structure pour modifier ces informations."}
            </span>
          </h2>
          {offerer.name && !offerer.areBankInformationProvided() && (
            <p className="bank-instructions-label">
              {
                'Le pass Culture vous contactera prochainement afin d’enregistrer vos coordonnées bancaires. Une fois votre BIC / IBAN renseigné, ces informations apparaitront ci-dessous.'
              }
            </p>
          )}
        </div>
        <div>
          <div>
            <label>
              {'BIC : '}
            </label>
            <span>
              {offerer.bic}
            </span>
          </div>
          <div>
            <label>
              {'IBAN : '}
            </label>
            <span>
              {offerer.iban}
            </span>
          </div>
        </div>

        <Venues
          offererId={offerer.id}
          venues={venues}
        />
      </Main>
    )
  }
}

OffererDetails.propTypes = {
  offerer: PropTypes.instanceOf(OffererClass).isRequired,
}

export default OffererDetails
