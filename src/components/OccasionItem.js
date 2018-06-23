import classnames from 'classnames'
import get from 'lodash.get'
import React, { Component } from 'react'
import Dotdotdot from 'react-dotdotdot'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'

import Price from './Price'
import Icon from './layout/Icon'
import Thumb from './layout/Thumb'
import { requestData } from '../reducers/data'
import createSelectEvent from '../selectors/event'
import createSelectMediations from '../selectors/mediations'
import createSelectCurrentThing from '../selectors/thing'
import createSelectOccasionItem from '../selectors/occasionItem'
import { pluralize } from '../utils/string'
import { modelToPath } from '../utils/translate'
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

  render() {
    const {
      isActive,
      occasionItem,
      occasion,
    } = this.props
    const {
      event,
      id,
      isActive,
      isNew,
      thing
    } = (occasion || {})
    const {
      createdAt,
      eventType,
      mediations,
      name,
      occurences
    } = (event || thing || {})
    const {
      available,
      maxDate,
      groupSizeMin,
      groupSizeMax,
      priceMin,
      priceMax,
      thumbUrl,
      type,
    } = (occasionItem || {})
<<<<<<< HEAD
    const mediationsLength = get(mediations, 'length')
=======
    const { path } = this.state
    const hasMediations = get(mediations, 'length')
>>>>>>> add isNew attribute to collections
    return (
      <li className={classnames('occasion-item', { active: isActive })}>
        <Thumb alt='offre' src={thumbUrl} />
        <div className="list-content">
          <NavLink className='name' to={`/offres/${id}`} title={name}>
            <Dotdotdot clamp={1}>{name}</Dotdotdot>
          </NavLink>
          <ul className='infos'>
            {isNew && <li><div className='recently-added'></div></li>}
            <li className='is-uppercase'>{type}</li>
            <li className='has-text-primary'>{pluralize(get(occurences, 'length'), 'date')}</li>
            <li>{maxDate && `jusqu'au ${maxDate.format('DD/MM/YYYY')}`}</li>
            {groupSizeMin > 0 && <li>{groupSizeMin === groupSizeMax ? groupSizeMin : `entre ${groupSizeMin} et ${groupSizeMax} personnes`}</li>}
            {available > 0 && <li>restent {available}</li>}
            <li>{priceMin === priceMax ? <Price value={priceMin} /> : (<span><Price value={priceMin} /> - <Price value={priceMax} /></span>)}</li>
          </ul>
          <ul className='actions'>
            <li>
              <NavLink  to={`offres/${id}${hasMediations ? '' : '/accroches/nouveau'}`} className={`button is-small ${hasMediations ? 'is-secondary' : 'is-primary is-outlined'}`}>
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
    const selectMediations = createSelectMediations(
      selectEvent,
      selectThing
    )
    const selectOccasionItem = createSelectOccasionItem(selectMediations)
    return (state, ownProps) => ({
      occasionItem: selectOccasionItem(state, ownProps)
    })
  },
  { requestData }
)(OccasionItem)
