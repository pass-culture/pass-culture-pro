import {
  Icon,
  InfiniteScroller,
  requestData,
  withLogin,
  withPagination,
} from 'pass-culture-shared'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { NavLink } from 'react-router-dom'

import OffererItem from './offerers/OffererItem'
import HeroSection from '../layout/HeroSection'
import Main from '../layout/Main'
import offerersSelector from '../../selectors/offerers'
import { offererNormalizer } from '../../utils/normalizers'
import { mapApiToWindow, windowToApiQuery } from '../../utils/pagination'

class OfferersPage extends Component {
  handleDataRequest = (handleSuccess, handleFail) => {
    const { dispatch, pagination, search } = this.props
    const { apiQueryString, page, goToNextPage } = pagination

    // BECAUSE THE INFINITE SCROLLER CALLS ONCE THIS FUNCTION
    // BUT THEN PUSH THE SEARCH TO PAGE + 1
    // WE PASS AGAIN HERE FOR THE SAME PAGE
    // SO WE NEED TO PREVENT A SECOND CALL
    if (page !== 1 && search.page && page === Number(search.page)) {
      return
    }

    const path = `offerers?page=${page}&${apiQueryString}`

    dispatch(
      requestData('GET', path, {
        handleSuccess: (state, action) => {
          handleSuccess(state, action)
          goToNextPage()
        },
        handleFail,
        normalizer: offererNormalizer,
      })
    )
  }

  onSubmit = event => {
    const { pagination } = this.props

    event.preventDefault()

    const value = event.target.elements.search.value

    pagination.change({
      [mapApiToWindow.keywords]: value === '' ? null : value,
    })
  }

  render() {
    const { offerers, pagination } = this.props

    const { search } = pagination.apiQuery || {}

    return (
      <Main name="offerers" handleDataRequest={this.handleDataRequest}>
        <HeroSection title="Vos structures">
          <p className="subtitle">
            Pour présenter vos offres, vous devez d'abord créer un{' '}
            <b> nouveau lieu </b> lié à une structure.
            <br />
            Sans lieu, vous ne pouvez ajouter que des offres numériques.
          </p>
          <NavLink
            to={`/structures/nouveau`}
            className="cta button is-primary is-outlined">
            + Rattacher une structure supplémentaire
          </NavLink>
        </HeroSection>

        <form className="section" onSubmit={this.onSubmit}>
          <label className="label">Rechercher une structure :</label>
          <div className="field is-grouped">
            <p className="control is-expanded">
              <input
                id="search"
                className="input search-input"
                placeholder="Saisissez un ou plusieurs mots complets"
                type="text"
                defaultValue={search}
              />
            </p>
            <p className="control">
              <button type="submit" className="button is-primary is-outlined">
                OK
              </button>{' '}
              <button className="button is-secondary" disabled>
                &nbsp;
                <Icon svg="ico-filter" />
                &nbsp;
              </button>
            </p>
          </div>
        </form>

        <InfiniteScroller
          className="main-list offerers-list"
          handleLoadMore={(handleSuccess, handleFail) => {
            this.handleDataRequest(handleSuccess, handleFail)
            const { history, location, pagination } = this.props
            const { windowQueryString, page } = pagination
            history.push(
              `${location.pathname}?page=${page}&${windowQueryString}`
            )
          }}>
          {offerers.map(o => (
            <OffererItem key={o.id} offerer={o} />
          ))}
        </InfiniteScroller>
      </Main>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    offerers: offerersSelector(state),
  }
}

export default compose(
  withLogin({ failRedirect: '/connexion' }),
  withPagination({
    dataKey: 'offerers',
    defaultWindowQuery: {
      [mapApiToWindow.keywords]: null,
    },
    windowToApiQuery,
  }),
  connect(mapStateToProps)
)(OfferersPage)
