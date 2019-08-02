import React from 'react'
import PropTypes from 'prop-types'

import DownloadButtonContainer from '../../layout/DownloadButton/DownloadButtonContainer'
import Main from '../../layout/Main'
import HeroSection from '../../layout/HeroSection/HeroSection'
import FilterByVenueContainer from './FilterByVenue/FilterByVenueContainer'

import CsvTableButtonContainer from '../../layout/CsvTableButton/CsvTableButtonContainer'
import FilterByOfferContainer from './FilterByOffer/FilterByOfferContainer'

const Bookings = ({ pathToCsvFile, showButtons, showOfferSection }) => (
  <Main name="bookings">
    <HeroSection title="Suivi des réservations">
      <p className="subtitle">
        {'Téléchargez le récapitulatif des réservations de vos offres.'}
        <br />
        <br />
        {'Le fichier est au format CSV, compatible avec tous les tableurs et éditeurs de texte.'}
      </p>
    </HeroSection>
    <hr />
    <FilterByVenueContainer />
    {showOfferSection && (
    <FilterByOfferContainer />
    )}
    {showButtons && (
      <div id="buttons-container">
        <div className="control flex-columns items-center flex-end">
          <DownloadButtonContainer
            filename="reservations_pass_culture"
            href={pathToCsvFile}
            mimeType="text/csv"
          >
            {'Télécharger la liste des réservations'}
          </DownloadButtonContainer>
        </div>
        <br />
        <div className="control flex-columns items-center flex-end">
          <CsvTableButtonContainer href={pathToCsvFile}>
            {'Afficher la liste des réservations'}
          </CsvTableButtonContainer>
        </div>
      </div>
    )}
  </Main>
)

Bookings.defaultProps = {
  pathToCsvFile: '',
  showButtons: false,
  showOfferSection: false,
}

Bookings.propTypes = {
  pathToCsvFile: PropTypes.string,
  showButtons: PropTypes.bool,
  showOfferSection: PropTypes.bool,
}

export default Bookings
