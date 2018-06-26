import classnames from 'classnames'
import get from 'lodash.get'
import moment from 'moment'
import React, { Component } from 'react'
import Dotdotdot from 'react-dotdotdot'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'

import Price from './Price'
import Icon from './layout/Icon'
import Thumb from './layout/Thumb'
import { requestData } from '../reducers/data'
import createSelectEvent from '../selectors/createEvent'
import createSelectMediations from '../selectors/createMediations'
import createSelectMaxDate from '../selectors/createMaxDate'
import createSelectCurrentThing from '../selectors/createThing'
import createSelectOccurences from '../selectors/createOccurences'
import createSelectStock from '../selectors/createStock'
import createSelectThumbUrl from '../selectors/createThumbUrl'
import { pluralize } from '../utils/string'
import { occasionNormalizer } from '../utils/normalizers'

class OccasionItem extends Component {

  onDeactivateClick = event => {
    const {
      occasion,
      requestData
    } = this.props
    const {
      id,
      isActive,
    } = (occasion || {})
    requestData(
      'PATCH',
      `occasions/${id}`,
        {
          body: {
            occasion: {
              isActive: !isActive
            }
          },
          key: 'occasions',
          normalizer: occasionNormalizer,
          isMergingDatum: true,
          isMutatingDatum: true,
          isMutaginArray: false
        }
      )
  }

  onDeleteClick = () => {
    const {
      occasion,
      requestData,
    } = this.props
    const { id } = (occasion || {})
    requestData('DELETE', `occasions/${id}`, { key: 'occasions' })
  }

  render() {
    const {
      event,
      isActive,
      mediations,
      occasion,
      occurences,
      stock,
      thing,
      thumbUrl,
    } = this.props
    const {
      available,
      maxDate,
      groupSizeMin,
      groupSizeMax,
      priceMin,
      priceMax,
    } = (stock || {})
    const {
      id
    } = (occasion || {})
    const {
      createdAt,
      eventType,
      name,
    } = (event || thing || {})

    const mediationsLength = get(mediations, 'length')
    return (
      <li className={classnames('occasion-item', { active: isActive })}>
        <Thumb alt='offre' src={thumbUrl} />
        <div className="list-content">
          <NavLink className='name' to={`/offres/${id}`} title={name}>
            <Dotdotdot clamp={1}>{name}</Dotdotdot>
          </NavLink>
          <ul className='infos'>
            {moment(createdAt).isAfter(moment().add(-1, 'days')) && <li><div className='recently-added'></div></li>}
            <li className='is-uppercase'>{get(eventType, 'label')}</li>
            <li className='has-text-primary'>{pluralize(get(occurences, 'length'), 'date')}</li>
            <li>{maxDate && `jusqu'au ${maxDate.format('DD/MM/YYYY')}`}</li>
            {groupSizeMin > 0 && <li>{groupSizeMin === groupSizeMax ? groupSizeMin : `entre ${groupSizeMin} et ${groupSizeMax} personnes`}</li>}
            {available > 0 && <li>restent {available}</li>}
            <li>{priceMin === priceMax ? <Price value={priceMin} /> : (<span><Price value={priceMin} /> - <Price value={priceMax} /></span>)}</li>
          </ul>
          <ul className='actions'>
            <li>
              <NavLink  to={`offres/${id}${mediationsLength ? '' : '/accroches/nouveau'}`} className={`button is-small ${mediationsLength ? 'is-secondary' : 'is-primary is-outlined'}`}>
                <span className='icon'><Icon svg='ico-stars' /></span>
                <span>{get(mediations, 'length') ? 'Accroches' : 'Ajouter une Accroche'}</span>
              </NavLink>
            </li>
            <li>
              <button className='button is-secondary is-small' onClick={this.onDeactivateClick}>{isActive ? ('X Désactiver') : ('Activer')}</button>
              <NavLink  to={`offres/${id}`} className="button is-secondary is-small">
                <Icon svg='ico-pen-r' />
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="is-pulled-right" key={2}>
          <button className="delete is-small"
            onClick={this.onDeleteClick} />
        </div>
      </li>
    )
  }
}

OccasionItem.defaultProps = {
  maxDescriptionLength: 300,
}



export default connect(
  () => {
    const selectEvent =  createSelectEvent()
    const selectThing =  createSelectCurrentThing()
    const selectOccurences = createSelectOccurences()
    const selectMediations = createSelectMediations(
      selectEvent,
      selectThing
    )
    const selectMaxDate = createSelectMaxDate(
      selectOccurences
    )
    const selectStock = createSelectStock(
      selectOccurences
    )
    const selectThumbUrl = createSelectThumbUrl(
      selectMediations
    )
    return (state, ownProps) => ({
      event: selectEvent(state, ownProps),
      maxDate: selectMaxDate(state, ownProps),
      mediations: selectMediations(state, ownProps),
      occurences: selectOccurences(state, ownProps),
      stock: selectStock(state, ownProps),
      thing: selectThing(state, ownProps),
      thumbUrl: selectThumbUrl(state, ownProps)
    })
  },
  { requestData }
)(OccasionItem)
