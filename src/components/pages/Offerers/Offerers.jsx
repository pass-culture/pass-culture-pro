import { showNotification } from 'pass-culture-shared'
import PropTypes from 'prop-types'
import { stringify } from 'query-string'
import React, { Component, Fragment } from 'react'
import { Form } from 'react-final-form'
import LoadingInfiniteScroll from 'react-loading-infinite-scroller'
import { NavLink } from 'react-router-dom'
import { assignData, requestData } from 'redux-saga-data'

import OffererItemContainer from './OffererItem/OffererItemContainer'
import PendingOffererItem from './OffererItem/PendingOffererItem'
import HeroSection from '../../layout/HeroSection/HeroSection'
import Icon from '../../layout/Icon'
import Main from '../../layout/Main'
import Spinner from '../../layout/Spinner'
import TextField from '../../layout/form/fields/TextField'
import { offererNormalizer } from '../../../utils/normalizers'
import { mapApiToBrowser, translateQueryParamsToApiParams } from '../../../utils/translate'

import createVenueForOffererUrl from './utils/createVenueForOffererUrl'

class Offerers extends Component {
  constructor(props) {
    super(props)
    const { dispatch } = props

    this.state = {
      hasMore: false,
      isLoading: false,
    }

    dispatch(assignData({ offerers: [], pendingOfferers: [] }))
  }

  componentDidMount() {
    this.handleRequestData()
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props
    if (location.search !== prevProps.location.search) {
      this.handleRequestData()
    }
  }

  showNotification = url => {
    const { dispatch } = this.props
    dispatch(
      showNotification({
        tag: 'offerers',
        text:
          'Commencez par créer un lieu pour accueillir vos offres physiques (événements, livres, abonnements…)',
        type: 'info',
        url: url,
        urlLabel: 'Nouveau lieu',
      })
    )
  }

  handleFail = () => {
    this.setState({
      hasMore: false,
      isLoading: false,
    })
  }

  handleRequestData = () => {
    const { currentUser, dispatch, offerers, query } = this.props
    const { isAdmin } = currentUser || {}
    const queryParams = query.parse()
    const apiParams = translateQueryParamsToApiParams(queryParams)
    const apiParamsString = stringify(apiParams)
    const apiPath = `/offerers?${apiParamsString}`

    this.setState({ isLoading: true }, () => {
      dispatch(
        requestData({
          apiPath,
          handleFail: this.handleFail,
          handleSuccess: this.handleSuccess,
          normalizer: offererNormalizer,
        })
      )
    })

    const url = createVenueForOffererUrl(offerers)
    const offerersHaveNotOffers = !currentUser.hasOffers && !currentUser.hasPhysicalVenues
    const offerersHaveOnlyDigitalOffers = currentUser.hasOffers && !currentUser.hasPhysicalVenues

    const userHasNoOffersInAPhysicalVenueYet =
      offerersHaveNotOffers || offerersHaveOnlyDigitalOffers

    if (userHasNoOffersInAPhysicalVenueYet) {
      this.showNotification(url)
    }

    if (!isAdmin) {
      const notValidatedUserOfferersParams = Object.assign(
        {
          validated: false,
        },
        apiParams
      )
      const notValidatedUserOfferersSearch = stringify(notValidatedUserOfferersParams)
      const notValidatedUserOfferersPath = `/offerers?${notValidatedUserOfferersSearch}`
      dispatch(
        requestData({
          apiPath: notValidatedUserOfferersPath,
          normalizer: offererNormalizer,
          stateKey: 'pendingOfferers',
        })
      )
    }
  }

  handleOnKeywordsSubmit = values => {
    const { dispatch, query } = this.props
    const { keywords } = values

    const isEmptyKeywords = typeof keywords === 'undefined' || keywords === ''

    if (!isEmptyKeywords) {
      dispatch(assignData({ offerers: [], pendingOfferers: [] }))
    }

    query.change({
      [mapApiToBrowser.keywords]: isEmptyKeywords ? null : keywords,
      page: null,
    })
  }

  renderTextField = () => (
    <Fragment>
      <button
        className="button is-primary is-outlined search-ok ml12"
        type="submit"
      >
        {'OK'}
      </button>
      <button
        className="button is-secondary"
        disabled
        type="button"
      >
        &nbsp;
        <Icon svg="ico-filter" />
        &nbsp;
      </button>
    </Fragment>
  )

  renderForm = ({ handleSubmit }) => (
    <form onSubmit={handleSubmit}>
      {'Rechercher une structure :'}
      <TextField
        id="search"
        name="keywords"
        placeholder="Saisissez un ou plusieurs mots complets"
        renderValue={this.renderTextField}
      />
    </form>
  )

  render() {
    const { pendingOfferers, offerers, query } = this.props
    const queryParams = query.parse()
    const { hasMore, isLoading } = this.state

    const sectionTitle =
      offerers.length > 1 ? 'Vos structures juridiques' : 'Votre structure juridique'

    const initialValues = {
      keywords: queryParams[mapApiToBrowser.keywords],
    }

    const url = createVenueForOffererUrl(offerers)

    return (
      <Main name="offerers">
        <HeroSection title={sectionTitle}>
          <p className="subtitle">
            {'Pour présenter vos offres, vous devez d’abord '}
            <a href={url}> {'créer un nouveau lieu '} </a> {' lié à une structure.'}
            <br />
            {'Sans lieu, vous pouvez uniquement '}
            <a href="/offres/creation"> {'ajouter des offres numériques.'} </a>
          </p>
          <div className="title-action-links">
            <NavLink
              className="cta button is-primary is-outlined"
              to="/structures/creation"
            >
              {'+ Ajouter une structure'}
              <span
                className="tip-icon"
                data-place="bottom"
                data-tip="<p>Ajouter les SIREN des structures que vous souhaitez gérer au global avec ce compte (par exemple, un réseau de grande distribution ou de franchisés).</p>"
                data-type="info"
              >
                <Icon svg="picto-tip" />
              </span>
            </NavLink>
          </div>
        </HeroSection>

        <Form
          initialValues={initialValues}
          onSubmit={this.handleOnKeywordsSubmit}
          render={this.renderForm}
        />

        <br />

        {pendingOfferers.length > 0 && (
          <ul
            className="main-list offerers-list"
            id="pending-offerer-list"
          >
            {pendingOfferers.map(o => (
              <PendingOffererItem
                key={o.siren}
                offerer={o}
              />
            ))}
          </ul>
        )}

        <LoadingInfiniteScroll
          className="main-list offerers-list"
          element="ul"
          hasMore={hasMore}
          isLoading={isLoading}
          loader={<Spinner key="spinner" />}
          useWindow
        >
          {offerers.map(offerer => (
            <OffererItemContainer
              key={offerer.id}
              offerer={offerer}
            />
          ))}
        </LoadingInfiniteScroll>
      </Main>
    )
  }
}

PropTypes.propTypes = {
  currentUser: PropTypes.shape().isRequired,
  dispatch: PropTypes.func.isRequired,
  offerers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  pendingOfferers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  query: PropTypes.shape().isRequired,
}

export default Offerers
