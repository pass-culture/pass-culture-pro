import PropTypes from 'prop-types'
import React, { Fragment, PureComponent } from 'react'
import { Link } from 'react-router-dom'

import Select from 'components/layout/inputs/Select'
import TextInput from 'components/layout/inputs/TextInput/TextInput'
import Main from 'components/layout/Main'
import Spinner from 'components/layout/Spinner'
import Titles from 'components/layout/Titles/Titles'
import { OffersStatusFilters } from 'components/pages/Offers/OffersStatusFilters/OffersStatusFilters'
import { SVGFilter } from 'components/svg/SVGFilter'
import { formatAndOrderVenues, fetchAllVenuesByProUser } from 'services/venuesService'
import { mapApiToBrowser, translateQueryParamsToApiParams } from 'utils/translate'

import { ALL_OFFERS, ALL_VENUES, ALL_OFFERERS, ALL_VENUES_OPTION, DEFAULT_PAGE, EXCLUDING_STATUS_VALUE } from './_constants'
import ActionsBar from './ActionsBar/'
import OfferItemContainer from './OfferItem/OfferItemContainer'

class Offers extends PureComponent {
  constructor(props) {
    super(props)

    const {
      active,
      inactive,
      name: nameKeywords,
      offererId,
      page,
      venueId: selectedVenueId,
    } = translateQueryParamsToApiParams(props.query.parse())

    this.state = {
      isLoading: false,
      nameSearchValue: nameKeywords || ALL_OFFERS,
      offersCount: 0,
      page: page || DEFAULT_PAGE,
      pageCount: null,
      offererId: offererId || ALL_OFFERERS,
      offerer: null,
      selectedVenueId: selectedVenueId || ALL_VENUES,
      venueOptions: [],
      statusFilters: {
        active: active !== EXCLUDING_STATUS_VALUE,
        inactive: inactive !== EXCLUDING_STATUS_VALUE,
      },
      areStatusFiltersVisible: false,
    }
  }

  componentDidMount() {
    const { offererId } = this.state
    const { getOfferer } = this.props

    if (offererId !== ALL_OFFERERS) {
      getOfferer(offererId).then(offerer => this.setState({ offerer }))
    }

    this.getPaginatedOffersWithFilters({ shouldTriggerSpinner: true })
    this.fetchAndFormatVenues(offererId)
  }

  componentWillUnmount() {
    const { closeNotification, notification } = this.props
    if (notification && notification.tag === 'offers-activation') {
      closeNotification()
    }
  }

  updateUrlMatchingState = () => {
    const { query } = this.props
    const {
      page,
      nameSearchValue,
      selectedVenueId,
      offererId,
      statusFilters,
    } = this.state

    query.change({
      page: page === DEFAULT_PAGE ? null : page,
      [mapApiToBrowser.name]: nameSearchValue === ALL_OFFERS ? null : nameSearchValue,
      [mapApiToBrowser.venueId]: selectedVenueId === ALL_VENUES ? null : selectedVenueId,
      [mapApiToBrowser.offererId]: offererId === ALL_OFFERERS ? null : offererId,
      [mapApiToBrowser.active]: statusFilters.active ? null : EXCLUDING_STATUS_VALUE,
      [mapApiToBrowser.inactive]: statusFilters.inactive ? null : EXCLUDING_STATUS_VALUE,
    })
  }

  updateStatusFilters = (name, status) => {
    const { statusFilters } = this.state
    const numberOfCheckedFiltersBeforeUpdate = Object.keys(statusFilters).filter(
      key => statusFilters[key]
    ).length
    const numberOfCheckedFiltersAfterUpdate = status
      ? numberOfCheckedFiltersBeforeUpdate + 1
      : numberOfCheckedFiltersBeforeUpdate - 1

    if (numberOfCheckedFiltersAfterUpdate >= 1) {
      this.setState({
        statusFilters: {
          ...statusFilters,
          [name]: status,
        },
      })
    }
  }

  loadAndUpdateOffers() {
    const { loadOffers } = this.props
    const { nameSearchValue, selectedVenueId, offererId, page, statusFilters } = this.state

    loadOffers({ nameSearchValue, selectedVenueId, offererId, page, statusFilters })
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
    const { nameSearchValue, selectedVenueId, offererId, page, statusFilters } = this.state
    saveSearchFilters({
      name: nameSearchValue,
      venueId: selectedVenueId,
     offererId, page,
      active: !statusFilters.active && EXCLUDING_STATUS_VALUE,
      inactive: !statusFilters.inactive && EXCLUDING_STATUS_VALUE,
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
        this.getPaginatedOffersWithFilters({ shouldTriggerSpinner: true })
      }
    )
  }

  handleOnOffererClick = () => {
    this.setState({ offererId: ALL_OFFERERS, offerer: null, page: DEFAULT_PAGE }, () => {
      this.getPaginatedOffersWithFilters({ shouldTriggerSpinner: true })
      this.fetchAndFormatVenues()
    })
  }

  storeNameSearchValue = event => {
    this.setState({ nameSearchValue: event.target.value })
  }

  storeSelectedVenue = event => {
    this.setState({ selectedVenueId: event.target.value })
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

  getOffersActionsBar = () => {
    return <ActionsBar refreshOffers={this.getPaginatedOffersWithFilters} />
  }

  toggleStatusFiltersVisibility = () => {
    const { areStatusFiltersVisible } = this.state
    this.setState({ areStatusFiltersVisible: !areStatusFiltersVisible })
  }

  render() {
    const {
      currentUser,
      handleOnDeactivateAllVenueOffersClick,
      handleOnActivateAllVenueOffersClick,
      offers,
      query,
      selectedOfferIds,
    } = this.props

    const { isAdmin } = currentUser || {}
    const { venueId } = translateQueryParamsToApiParams(query.parse())
    const {
      areStatusFiltersVisible,
      nameSearchValue,
      offersCount,
      offerer,
      page,
      pageCount,
      isLoading,
      selectedVenueId,
      statusFilters,
      venueOptions,
    } = this.state

    const actionLink = !isAdmin ? (
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
    ) : null

    return (
      <Main
        PageActionsBar={this.getOffersActionsBar}
        id="offers"
        name="offers"
      >
        <Titles
          action={actionLink}
          title="Offres"
        />
        {offerer && (
          <span className="offerer-filter">
            {offerer.name}
            <button
              onClick={this.handleOnOffererClick}
              type="button"
            >
              <Icon
                alt="Supprimer le filtre"
                svg="ico-close-b"
              />
            </button>
          </span>
        )}
        <form onSubmit={this.handleOnSubmit}>
          <TextInput
            label="Nom de l’offre"
            name="offre"
            onChange={this.storeNameSearchValue}
            placeholder="Rechercher par nom d’offre"
            value={nameSearchValue}
          />
          <Select
            defaultOption={ALL_VENUES_OPTION}
            handleSelection={this.storeSelectedVenue}
            label="Lieu"
            name="lieu"
            options={venueOptions}
            selectedValue={selectedVenueId}
          />
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

        <div className="offers-count">
          {`${offersCount} ${offersCount <= 1 ? 'offre' : 'offres'}`}
        </div>

        <div className="section">
          {offers.length > 0 && venueId && (
            <div className="offers-list-actions">
              <button
                className="button deactivate is-tertiary is-small"
                onClick={handleOnDeactivateAllVenueOffersClick(venueId)}
                type="button"
              >
                {'Désactiver toutes les offres'}
              </button>

              <button
                className="button activate is-tertiary is-small"
                onClick={handleOnActivateAllVenueOffersClick(venueId)}
                type="button"
              >
                {'Activer toutes les offres'}
              </button>
            </div>
          )}
          {isLoading && <Spinner />}
          {offers.length > 0 && !isLoading && (
            <Fragment>
              <table>
                <thead>
                  <tr>
                    <th />
                    <th />
                    <th />
                    <th>
                      {'Lieu'}
                    </th>
                    <th>
                      {'Stock'}
                    </th>
                    <th className="th-with-filter">
                      <span>
                        {'Statut'}
                      </span>
                      <button
                        onClick={this.toggleStatusFiltersVisibility}
                        type="button"
                      >
                        <SVGFilter alt="Filtrer les offres par statut" />
                      </button>
                      {areStatusFiltersVisible && (
                        <OffersStatusFilters
                          refreshOffers={this.handleOnSubmit}
                          statusFilters={statusFilters}
                          updateStatusFilters={this.updateStatusFilters}
                        />
                      )}
                    </th>
                    <th />
                    <th />
                  </tr>
                </thead>
                <tbody className="offers-list">
                  {offers.map(offer => (
                    <OfferItemContainer
                      isSelected={selectedOfferIds.includes(offer.id)}
                      key={offer.id}
                      offer={offer}
                      refreshOffers={this.getPaginatedOffersWithFilters}
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
          )}
        </div>
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
  handleOnActivateAllVenueOffersClick: PropTypes.func.isRequired,
  handleOnDeactivateAllVenueOffersClick: PropTypes.func.isRequired,
  hideActionsBar: PropTypes.func.isRequired,
  loadOffers: PropTypes.func.isRequired,
  offers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  query: PropTypes.shape({
    change: PropTypes.func.isRequired,
    parse: PropTypes.func.isRequired,
  }).isRequired,
  saveSearchFilters: PropTypes.func.isRequired,
  selectedOfferIds: PropTypes.arrayOf(PropTypes.string),
  setSelectedOfferIds: PropTypes.func.isRequired,
  showActionsBar: PropTypes.func.isRequired,
  venue: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
}

export default Offers
