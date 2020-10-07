import { Icon } from 'pass-culture-shared'
import PropTypes from 'prop-types'
import React, { Fragment, PureComponent } from 'react'
import { Link } from 'react-router-dom'

import { mapApiToBrowser, translateQueryParamsToApiParams } from '../../../utils/translate'
import TextInput from '../../layout/inputs/TextInput/TextInput'
import Main from '../../layout/Main'
import Spinner from '../../layout/Spinner'

import Titles from '../../layout/Titles/Titles'
import OfferItemContainer from './OfferItem/OfferItemContainer'
import Select from '../../layout/inputs/Select'
import { ALL_OFFERS, ALL_VENUES, ALL_VENUES_OPTION, DEFAULT_PAGE } from './_constants'
import { fetchAllVenuesByProUser } from '../../../services/venuesService'
import formatAndOrderVenues from '../Bookings/BookingsRecapTable/utils/formatAndOrderVenues'

class Offers extends PureComponent {
  constructor(props) {
    super(props)

    const { name: nameKeywords, page, venueId: selectedVenue } = translateQueryParamsToApiParams(
      props.query.parse()
    )

    this.state = {
      isLoading: false,
      nameSearchValue: nameKeywords || ALL_OFFERS,
      page: page || DEFAULT_PAGE,
      pageCount: null,
      selectedVenue: selectedVenue || ALL_VENUES,
      venueOptions: [],
    }
  }

  componentDidMount() {
    this.getPaginatedOffersWithFilters()
    fetchAllVenuesByProUser().then(venues =>
      this.setState({ venueOptions: formatAndOrderVenues(venues) })
    )
  }

  componentWillUnmount() {
    const { closeNotification, notification } = this.props
    if (notification && notification.tag === 'offers-activation') {
      closeNotification()
    }
  }

  updateUrlMatchingState = () => {
    const { query } = this.props
    const { page, nameSearchValue, selectedVenue } = this.state

    query.change({
      page: page === DEFAULT_PAGE ? null : page,
      [mapApiToBrowser.name]: nameSearchValue === ALL_OFFERS ? null : nameSearchValue,
      [mapApiToBrowser.venueId]: selectedVenue === ALL_VENUES ? null : selectedVenue,
    })
  }

  getPaginatedOffersWithFilters = () => {
    const { loadTypes, loadOffers, types } = this.props
    const { nameSearchValue, selectedVenue, page } = this.state
    types.length === 0 && loadTypes()

    const handleSuccess = (page, pageCount) => {
      this.setState(
        {
          isLoading: false,
          page,
          pageCount,
        },
        () => {
          this.updateUrlMatchingState()
        }
      )
    }

    const handleFail = () =>
      this.setState({
        isLoading: false,
      })

    this.setState({ isLoading: true }, () => {
      loadOffers({ nameSearchValue, selectedVenue, page }, handleSuccess, handleFail)
    })
  }

  handleOnSubmit = event => {
    event.preventDefault()

    this.setState(
      {
        page: DEFAULT_PAGE,
      },
      () => {
        this.getPaginatedOffersWithFilters()
      }
    )
  }

  storeNameSearchValue = event => {
    this.setState({ nameSearchValue: event.target.value })
  }

  storeSelectedVenue = event => {
    this.setState({ selectedVenue: event.target.value })
  }

  onPreviousPageClick = () => {
    const { page } = this.state
    this.setState({ page: page - 1 }, () => {
      this.getPaginatedOffersWithFilters()
    })
  }

  onNextPageClick = () => {
    const { page } = this.state
    this.setState({ page: page + 1 }, () => {
      this.getPaginatedOffersWithFilters()
    })
  }

  render() {
    const {
      currentUser,
      handleOnDeactivateAllVenueOffersClick,
      handleOnActivateAllVenueOffersClick,
      offers,
      query,
    } = this.props

    const { isAdmin } = currentUser || {}
    const { venueId } = translateQueryParamsToApiParams(query.parse())
    const { nameSearchValue, page, pageCount, isLoading, selectedVenue, venueOptions } = this.state

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
        id="offers"
        name="offers"
      >
        <Titles
          action={actionLink}
          title="Offres"
        />
        <form
          className="section"
          onSubmit={this.handleOnSubmit}
        >
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
            selectedValue={selectedVenue}
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

        <div className="section">
          {offers && venueId && (
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
                    <th>
                      {'Lieu'}
                    </th>
                    <th>
                      {'Stock'}
                    </th>
                    <th>
                      {'Statut'}
                    </th>
                    <th />
                    <th />
                  </tr>
                </thead>
                <tbody className="offers-list">
                  {offers.map(offer => (
                    <OfferItemContainer
                      key={offer.id}
                      offer={offer}
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
  venue: undefined,
}

Offers.propTypes = {
  closeNotification: PropTypes.func.isRequired,
  currentUser: PropTypes.shape().isRequired,
  handleOnActivateAllVenueOffersClick: PropTypes.func.isRequired,
  handleOnDeactivateAllVenueOffersClick: PropTypes.func.isRequired,
  loadOffers: PropTypes.func.isRequired,
  loadTypes: PropTypes.func.isRequired,
  offers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  venue: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
}

export default Offers
