import PropTypes from 'prop-types'
import React, { Fragment, PureComponent } from 'react'
import { Link } from 'react-router-dom'

import Icon from 'components/layout/Icon'
import Main from 'components/layout/Main'
import PageTitle from 'components/layout/PageTitle/PageTitle'
import Spinner from 'components/layout/Spinner'
import Titles from 'components/layout/Titles/Titles'
import { CreateOfferActionLink } from 'components/pages/Offers/CreateOfferActionLink/CreateOfferActionLink'
import { NoOfferPage } from 'components/pages/Offers/NoOfferPage/NoOfferPage'
import { ResetFiltersLink } from 'components/pages/Offers/ResetFiltersLink/ResetFiltersLink'
import { SearchFilters } from 'components/pages/Offers/SearchFilters/SearchFilters'
import * as pcapi from 'repository/pcapi/pcapi'
import { fetchAllVenuesByProUser, formatAndOrderVenues } from 'repository/venuesService'
import { mapApiToBrowser, mapBrowserToApi, translateQueryParamsToApiParams } from 'utils/translate'

import {
  ADMINS_DISABLED_FILTERS_MESSAGE,
  DEFAULT_PAGE,
  DEFAULT_SEARCH_FILTERS,
} from './_constants'
import ActionsBarContainer from './ActionsBar/ActionsBarContainer'
import OfferItemContainer from './OfferItem/OfferItemContainer'
import StatusFiltersButton from './StatusFiltersButton'

class Offers extends PureComponent {
  constructor(props) {
    super(props)

    const { page, ...searchFilters } = translateQueryParamsToApiParams(props.query.parse())

    this.state = {
      isLoading: false,
      offersCount: 0,
      page: page || DEFAULT_PAGE,
      pageCount: null,
      searchFilters: {
        name: searchFilters.name || DEFAULT_SEARCH_FILTERS.name,
        offererId: searchFilters.offererId || DEFAULT_SEARCH_FILTERS.offererId,
        venueId: searchFilters.venueId || DEFAULT_SEARCH_FILTERS.venueId,
        typeId: searchFilters.typeId || DEFAULT_SEARCH_FILTERS.typeId,
        status: searchFilters.status
          ? mapBrowserToApi[searchFilters.status]
          : DEFAULT_SEARCH_FILTERS.status,
        creationMode: searchFilters.creationMode
          ? mapBrowserToApi[searchFilters.creationMode]
          : DEFAULT_SEARCH_FILTERS.creationMode,
        periodBeginningDate:
          searchFilters.periodBeginningDate || DEFAULT_SEARCH_FILTERS.periodBeginningDate,
        periodEndingDate: searchFilters.periodEndingDate || DEFAULT_SEARCH_FILTERS.periodEndingDate,
      },
      offerer: null,
      venueOptions: [],
      isStatusFiltersVisible: false,
      areAllOffersSelected: false,
      typeOptions: [],
    }
  }

  componentDidMount() {
    const { searchFilters } = this.state
    const { getOfferer } = this.props

    if (searchFilters.offererId !== DEFAULT_SEARCH_FILTERS.offererId) {
      getOfferer(searchFilters.offererId).then(offerer => this.setState({ offerer }))
    }

    this.getPaginatedOffersWithFilters({ shouldTriggerSpinner: true })
    this.fetchAndFormatVenues(searchFilters.offererId)
    this.fetchTypeOptions()
  }

  componentWillUnmount() {
    const { closeNotification, notification, setSelectedOfferIds, hideActionsBar } = this.props
    if (notification && notification.tag === 'offers-activation') {
      closeNotification()
    }

    setSelectedOfferIds([])
    hideActionsBar()
  }

  updateUrlMatchingState = () => {
    const { query } = this.props

    const { searchFilters, page } = this.state
    let queryParams = Object.keys(searchFilters).reduce((params, field) => {
      return {
        ...params,
        [mapApiToBrowser[field]]:
          searchFilters[field] === DEFAULT_SEARCH_FILTERS[field] ? null : searchFilters[field],
      }
    }, {})

    const fieldsWithTranslatedValues = ['statut', 'creation']
    fieldsWithTranslatedValues.forEach(field => {
      if (queryParams[field]) {
        queryParams[field] = mapApiToBrowser[queryParams[field]]
      }
    })

    if (page !== DEFAULT_PAGE) {
      queryParams.page = page
    }

    query.change(queryParams)
  }

  fetchTypeOptions = () => {
    pcapi.loadTypes().then(types => {
      let typeOptions = types.map(type => ({
        id: type.value,
        displayName: type.proLabel,
      }))
      this.setState({
        typeOptions: typeOptions.sort((a, b) => a.displayName.localeCompare(b.displayName)),
      })
    })
  }

  loadAndUpdateOffers() {
    const { loadOffers } = this.props
    const { searchFilters, page } = this.state

    loadOffers({ ...searchFilters, page })
      .then(({ page, pageCount, offersCount }) => {
        this.setState(
          {
            isLoading: false,
            offersCount,
            page,
            pageCount,
          },
          () => {
            this.updateUrlMatchingState()
          }
        )
      })
      .catch(() => {
        this.setState({
          isLoading: false,
        })
      })
  }

  getPaginatedOffersWithFilters = ({ shouldTriggerSpinner }) => {
    const { saveSearchFilters } = this.props
    const { searchFilters, page } = this.state
    saveSearchFilters({
      ...searchFilters,
      page: parseInt(page),
    })
    shouldTriggerSpinner && this.setState({ isLoading: true })
    this.loadAndUpdateOffers()
  }

  fetchAndFormatVenues = offererId => {
    fetchAllVenuesByProUser(offererId).then(venues =>
      this.setState({ venueOptions: formatAndOrderVenues(venues) })
    )
  }

  handleOnSubmit = event => {
    event.preventDefault()

    this.setState(
      {
        page: DEFAULT_PAGE,
      },
      () => {
        this.setIsStatusFiltersVisible(false)
        this.getPaginatedOffersWithFilters({ shouldTriggerSpinner: true })
      }
    )
  }

  hasSearchFilters(searchFilters, filterNames = Object.keys(searchFilters)) {
    return filterNames
      .map(
        filterName =>
          searchFilters[filterName] !==
          { ...DEFAULT_SEARCH_FILTERS, page: DEFAULT_PAGE }[filterName]
      )
      .includes(true)
  }

  isAdminForbidden(searchFilters) {
    const { currentUser } = this.props
    return currentUser.isAdmin && !this.hasSearchFilters(searchFilters, ['venueId', 'offererId'])
  }

  handleOffererFilterRemoval = () => {
    const newSearchFilters = {
      offererId: DEFAULT_SEARCH_FILTERS.offererId,
      status: this.getDefaultStatusIfNecessary(this.state.searchFilters.venueId),
    }
    this.setSearchFilters(newSearchFilters)
    this.setState({ offerer: null, page: DEFAULT_PAGE }, () => {
      this.getPaginatedOffersWithFilters({ shouldTriggerSpinner: true })
      this.fetchAndFormatVenues()
    })
  }

  getDefaultStatusIfNecessary(venueId, offererId = DEFAULT_SEARCH_FILTERS.offererId) {
    const isVenueFilterSelected = venueId !== DEFAULT_SEARCH_FILTERS.venueId
    const isOffererFilterApplied = offererId !== DEFAULT_SEARCH_FILTERS.offererId
    const isFilterByVenuOrOfferer = isVenueFilterSelected || isOffererFilterApplied

    return this.props.currentUser.isAdmin && !isFilterByVenuOrOfferer
      ? DEFAULT_SEARCH_FILTERS.status
      : this.state.searchFilters.status
  }

  setSearchFilters(newSearchFilters) {
    const { searchFilters } = this.state
    const updatedSearchFilters = {
      ...searchFilters,
      ...newSearchFilters,
    }
    this.setState({ searchFilters: updatedSearchFilters })
  }

  storeNameSearchValue = event => {
    this.setSearchFilters({ name: event.target.value })
  }

  storeSelectedVenue = event => {
    const selectedVenueId = event.target.value
    const newSearchFilters = {
      venueId: selectedVenueId,
      status: this.getDefaultStatusIfNecessary(selectedVenueId, this.state.searchFilters.offererId),
    }
    this.setSearchFilters(newSearchFilters)
  }

  storeSelectedType = event => {
    this.setSearchFilters({ typeId: event.target.value })
  }

  updateStatusFilter = selectedStatus => {
    this.setSearchFilters({ status: selectedStatus })
  }

  storeCreationMode = event => {
    this.setSearchFilters({ creationMode: event.target.value })
  }

  onPreviousPageClick = () => {
    const { page } = this.state
    this.setState({ page: page - 1 }, () => {
      this.getPaginatedOffersWithFilters({ shouldTriggerSpinner: true })
    })
  }

  onNextPageClick = () => {
    const { page } = this.state
    this.setState({ page: page + 1 }, () => {
      this.getPaginatedOffersWithFilters({ shouldTriggerSpinner: true })
    })
  }

  selectOffer = (offerId, selected) => {
    const { hideActionsBar, setSelectedOfferIds, selectedOfferIds, showActionsBar } = this.props
    let newSelectedOfferIds = [...selectedOfferIds]
    if (selected) {
      newSelectedOfferIds.push(offerId)
    } else {
      const offerIdIndex = newSelectedOfferIds.indexOf(offerId)
      newSelectedOfferIds.splice(offerIdIndex, 1)
    }
    setSelectedOfferIds(newSelectedOfferIds)
    newSelectedOfferIds.length ? showActionsBar() : hideActionsBar()
  }

  selectAllOffers = () => {
    const { offers, showActionsBar, setSelectedOfferIds, hideActionsBar } = this.props
    const { areAllOffersSelected } = this.state

    const selectedOfferIds = areAllOffersSelected ? [] : offers.map(offer => offer.id)
    selectedOfferIds.length ? showActionsBar() : hideActionsBar()
    setSelectedOfferIds(selectedOfferIds)

    this.toggleSelectAllCheckboxes()
  }

  toggleSelectAllCheckboxes = () => {
    const { areAllOffersSelected } = this.state
    this.setState({ areAllOffersSelected: !areAllOffersSelected })
  }

  getOffersActionsBar = () => {
    const { selectedOfferIds } = this.props
    const { areAllOffersSelected, offersCount } = this.state

    return (
      <ActionsBarContainer
        areAllOffersSelected={areAllOffersSelected}
        nbSelectedOffers={areAllOffersSelected ? offersCount : selectedOfferIds.length}
        refreshOffers={this.getPaginatedOffersWithFilters}
        toggleSelectAllCheckboxes={this.toggleSelectAllCheckboxes}
      />
    )
  }

  setIsStatusFiltersVisible = isStatusFiltersVisible => {
    this.setState({ isStatusFiltersVisible })
  }

  changePeriodBeginningDateValue = periodBeginningDate => {
    const dateToFilter = periodBeginningDate
      ? periodBeginningDate.format()
      : DEFAULT_SEARCH_FILTERS.periodBeginningDate
    this.setSearchFilters({ periodBeginningDate: dateToFilter })
  }

  changePeriodEndingDateValue = periodEndingDate => {
    const dateToFilter = periodEndingDate
      ? periodEndingDate.endOf('day').format()
      : DEFAULT_SEARCH_FILTERS.periodEndingDate
    this.setSearchFilters({ periodEndingDate: dateToFilter })
  }

  renderTableHead = () => {
    const { offers, savedSearchFilters } = this.props
    const { areAllOffersSelected, isStatusFiltersVisible, searchFilters } = this.state

    return (
      <thead>
        <tr>
          <th className="th-checkbox">
            <input
              checked={areAllOffersSelected}
              className="select-offer-checkbox"
              disabled={this.isAdminForbidden(savedSearchFilters) || !offers.length}
              id="select-offer-checkbox"
              onChange={this.selectAllOffers}
              type="checkbox"
            />
          </th>
          <th
            className={`th-checkbox-label ${
              this.isAdminForbidden(savedSearchFilters) || !offers.length ? 'label-disabled' : ''
            }`}
          >
            <label
              htmlFor="select-offer-checkbox"
              title={
                this.isAdminForbidden(savedSearchFilters)
                  ? ADMINS_DISABLED_FILTERS_MESSAGE
                  : undefined
              }
            >
              {areAllOffersSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
            </label>
          </th>
          <th />
          <th>
            {'Lieu'}
          </th>
          <th>
            {'Stock'}
          </th>
          <th className="th-with-filter">
            <StatusFiltersButton
              disabled={this.isAdminForbidden(searchFilters)}
              isStatusFiltersVisible={isStatusFiltersVisible}
              refreshOffers={this.handleOnSubmit}
              setIsStatusFiltersVisible={this.setIsStatusFiltersVisible}
              status={searchFilters.status}
              updateStatusFilter={this.updateStatusFilter}
            />
          </th>
          <th />
          <th />
        </tr>
      </thead>
    )
  }

  renderTable = () => {
    const { offers, selectedOfferIds } = this.props
    const { areAllOffersSelected, offersCount, page, pageCount } = this.state

    return (
      <Fragment>
        <div className="offers-count">
          {`${offersCount} ${offersCount <= 1 ? 'offre' : 'offres'}`}
        </div>
        <table>
          {this.renderTableHead()}
          <tbody className="offers-list">
            {offers.map(offer => (
              <OfferItemContainer
                disabled={areAllOffersSelected}
                isSelected={areAllOffersSelected || selectedOfferIds.includes(offer.id)}
                key={offer.id}
                offer={offer}
                selectOffer={this.selectOffer}
              />
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={this.onPreviousPageClick}
            type="button"
          >
            <Icon
              alt="Aller à la page précédente"
              svg="ico-left-arrow"
            />
          </button>
          <span>
            {`Page ${page}/${pageCount}`}
          </span>
          <button
            disabled={page === pageCount}
            onClick={this.onNextPageClick}
            type="button"
          >
            <Icon
              alt="Aller à la page suivante"
              svg="ico-right-arrow"
            />
          </button>
        </div>
      </Fragment>
    )
  }

  resetFilters = () => {
    this.setState({ offerer: null, searchFilters: { ...DEFAULT_SEARCH_FILTERS } }, () => {
      this.getPaginatedOffersWithFilters({ shouldTriggerSpinner: true })
    })
  }

  renderNoResultsForFilters = () => (
    <div>
      <table>
        {this.renderTableHead()}
      </table>

      <div className="search-no-results">
        <Icon
          alt="Illustration de recherche"
          svg="ico-search-gray"
        />
        <p>
          {'Aucune offre trouvée pour votre recherche'}
        </p>
        <p>
          {'Vous pouvez modifer votre recherche ou'}
          <br />
          <Link
            className="reset-filters-link"
            onClick={this.resetFilters}
            to="/offres"
          >
            {'afficher toutes les offres'}
          </Link>
        </p>
      </div>
    </div>
  )

  renderSearchResults = () => {
    const { offers, savedSearchFilters } = this.props
    const { isLoading } = this.state

    if (isLoading) {
      return <Spinner />
    }

    if (offers.length) {
      return this.renderTable()
    }

    if (this.hasSearchFilters(savedSearchFilters)) {
      return this.renderNoResultsForFilters()
    }

    return null
  }

  render() {
    const { currentUser, offers, savedSearchFilters } = this.props
    const { isLoading, searchFilters, typeOptions, venueOptions, offerer } = this.state
    const { isAdmin } = currentUser || {}

    const hasOffers = !!offers.length || this.hasSearchFilters(savedSearchFilters)

    return (
      <Main
        PageActionsBar={this.getOffersActionsBar}
        id="offers"
        name="offers"
      >
        <PageTitle title="Vos offres" />
        {isLoading || hasOffers ? (
          <Fragment>
            <Titles
              action={!isAdmin ? <CreateOfferActionLink /> : undefined}
              title="Offres"
            />
            <span className="subtitle-container">
              <h3 className="subtitle">
                {'Rechercher une offre'}
              </h3>
              <ResetFiltersLink
                hasActiveSearchFilter={this.hasSearchFilters(savedSearchFilters)}
                resetFilters={this.resetFilters}
              />
            </span>
            <SearchFilters
              changePeriodBeginningDateValue={this.changePeriodBeginningDateValue}
              changePeriodEndingDateValue={this.changePeriodEndingDateValue}
              currentSearchFilters={searchFilters}
              handleCreationModeSelection={this.storeCreationMode}
              handleNameSearchValue={this.storeNameSearchValue}
              handleOffererFilterRemoval={this.handleOffererFilterRemoval}
              handleOnSubmit={this.handleOnSubmit}
              handleTypeSelection={this.storeSelectedType}
              handleVenueSelection={this.storeSelectedVenue}
              offererName={offerer ? offerer.name : undefined}
              typeOptions={typeOptions}
              venueOptions={venueOptions}
            />
            <div className="section">
              {this.renderSearchResults()}
            </div>
          </Fragment>
        ) : (
          <NoOfferPage />
        )}
      </Main>
    )
  }
}

Offers.defaultProps = {
  selectedOfferIds: [],
  venue: undefined,
}

Offers.propTypes = {
  closeNotification: PropTypes.func.isRequired,
  currentUser: PropTypes.shape().isRequired,
  hideActionsBar: PropTypes.func.isRequired,
  loadOffers: PropTypes.func.isRequired,
  offers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  query: PropTypes.shape({
    change: PropTypes.func.isRequired,
    parse: PropTypes.func.isRequired,
  }).isRequired,
  saveSearchFilters: PropTypes.func.isRequired,
  savedSearchFilters: PropTypes.shape({
    name: PropTypes.string,
    offererId: PropTypes.string,
    venueId: PropTypes.string,
    typeId: PropTypes.string,
    status: PropTypes.string,
    creationMode: PropTypes.string,
  }).isRequired,
  selectedOfferIds: PropTypes.arrayOf(PropTypes.string),
  setSelectedOfferIds: PropTypes.func.isRequired,
  showActionsBar: PropTypes.func.isRequired,
  venue: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
}

export default Offers
