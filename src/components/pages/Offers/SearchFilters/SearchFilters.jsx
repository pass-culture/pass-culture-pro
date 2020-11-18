import moment from 'moment/moment'
import PropTypes from 'prop-types'
import React, { Fragment } from 'react'

import Icon from 'components/layout/Icon'
import PeriodSelector from 'components/layout/inputs/PeriodSelector/PeriodSelector'
import Select from 'components/layout/inputs/Select'
import TextInput from 'components/layout/inputs/TextInput/TextInput'
import {
  ALL_TYPES_OPTION,
  ALL_VENUES_OPTION,
  CREATION_MODES_FILTERS,
  DEFAULT_CREATION_MODE,
} from 'components/pages/Offers/_constants'

export const SearchFilters = props => {
  const formattedPeriodBeginningDate =
    props.currentSearchFilters.periodBeginningDate && moment(props.currentSearchFilters.periodBeginningDate)
  const formattedPeriodEndingDate =
    props.currentSearchFilters.periodEndingDate && moment(props.currentSearchFilters.periodEndingDate)

  return (
    <Fragment>
      {props.offererName && (
        <span className="offerer-filter">
          {props.offererName}
          <button
            onClick={props.handleOffererFilterRemoval}
            type="button"
          >
            <Icon
              alt="Supprimer le filtre par structure"
              svg="ico-close-b"
            />
          </button>
        </span>
      )}
      <form onSubmit={props.handleOnSubmit}>
        <TextInput
          label="Nom de l’offre"
          name="offre"
          onChange={props.handleNameSearchValue}
          placeholder="Rechercher par nom d’offre"
          value={props.currentSearchFilters.name}
        />
        <div className="form-row">
          <Select
            defaultOption={ALL_VENUES_OPTION}
            handleSelection={props.handleVenueSelection}
            label="Lieu"
            name="lieu"
            options={props.venueOptions}
            selectedValue={props.currentSearchFilters.venueId}
          />
          <Select
            defaultOption={ALL_TYPES_OPTION}
            handleSelection={props.handleTypeSelection}
            label="Catégories"
            name="type"
            options={props.typeOptions}
            selectedValue={props.currentSearchFilters.typeId}
          />
          <Select
            defaultOption={DEFAULT_CREATION_MODE}
            handleSelection={props.handleCreationModeSelection}
            label="Mode de création"
            name="creationMode"
            options={CREATION_MODES_FILTERS}
            selectedValue={props.currentSearchFilters.creationMode}
          />
          <PeriodSelector
            changePeriodBeginningDateValue={props.changePeriodBeginningDateValue}
            changePeriodEndingDateValue={props.changePeriodEndingDateValue}
            isDisabled={false}
            label="Période de l’évènement"
            maxDateBeginning={formattedPeriodEndingDate}
            minDateEnding={formattedPeriodBeginningDate}
            periodBeginningDate={formattedPeriodBeginningDate}
            periodEndingDate={formattedPeriodEndingDate}
          />
        </div>
        <div className="search-separator">
          <div className="separator" />
          <button
            className="primary-button"
            type="submit"
          >
            {'Lancer la recherche'}
          </button>
          <div className="separator" />
        </div>
      </form>
    </Fragment>
  )
}

SearchFilters.defaultProps = {
  offererName: '',
}

SearchFilters.propTypes = {
  changePeriodBeginningDateValue: PropTypes.func.isRequired,
  changePeriodEndingDateValue: PropTypes.func.isRequired,
  currentSearchFilters: PropTypes.shape({
    name: PropTypes.string,
    venueId: PropTypes.string,
    typeId: PropTypes.string,
    creationMode: PropTypes.string,
    periodBeginningDate: PropTypes.string,
    periodEndingDate: PropTypes.string,
  }).isRequired,
  handleCreationModeSelection: PropTypes.func.isRequired,
  handleNameSearchValue: PropTypes.func.isRequired,
  handleOffererFilterRemoval: PropTypes.func.isRequired,
  handleOnSubmit: PropTypes.func.isRequired,
  handleTypeSelection: PropTypes.func.isRequired,
  handleVenueSelection: PropTypes.func.isRequired,
  offererName: PropTypes.string,
  typeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    })
  ).isRequired,
  venueOptions: PropTypes.arrayOf(
    PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    })
  ).isRequired,
}
