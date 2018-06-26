import get from 'lodash.get'
import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'

import Icon from './layout/Icon'
import createSelectOccasions from '../selectors/createOccasions'
import createSelectVenues from '../selectors/createVenues'


const OffererItem = ({
  occasions,
  venues,
  offerer
}) => {
  const {
    id,
    name,
    isActive,
  } = (offerer || {})
  const showPath = `/structures/${id}`
  return (
    <li className="offerer-item">
      <div className='list-content'>
        <p className="name">
          <NavLink to={showPath}>
            {name}
          </NavLink>
        </p>
        <ul className='actions'>
          {
            !isActive
              ? (
                <li className='is-italic'>En cours de validation : vous allez recevoir un e-mail.</li>
              )
              : [
              // J'ai déja ajouté Un lieu mais pas d'offres
              get(venues, 'length') > 0
                ? ([
                  <li>
                    <NavLink to={`/offres/nouveau`} className='has-text-primary'>
                      <Icon svg='ico-offres-r' />
                      Nouvelle offre
                    </NavLink>
                  </li>,
                  // J'ai au moins 1 offre
                  get(occasions, 'length') > 0 &&
                    <li>
                      <NavLink to={`/offres?offererId=${id}`} className='has-text-primary'>
                        <Icon svg='ico-offres-r' />
                        { occasions.length === 1 ?  (`${occasions.length} offre`) :
                        (`${occasions.length} offres`)}
                      </NavLink>
                    </li>,
                  get(occasions, 'length') === 0 &&
                  <li>0 offre</li>
                ])
                : (
                  <li className='is-italic'>Créez un lieu pour pouvoir y associer des offres.</li>
                ),
              // J'ai ajouté un lieu
              get(venues, 'length')  > 0 ?
              (
                <li>
                  <NavLink to={showPath}>
                    <Icon svg='ico-offres-r' />
                    { venues.length === 1 ?  (`${venues.length} lieu`) :
                    (`${venues.length} lieux`)}
                  </NavLink>
                </li>
              ) :
              // je n'ai pas encore ajouté de lieu
              <li>
                <NavLink to={`/structures/${get(offerer, 'id')}/lieux/nouveau`}
                className='has-text-primary'>
                <Icon svg='picto-structure' /> Ajouter un lieu
              </NavLink>
              </li>
            ]
          }
        </ul>
      </div>
      <div className='caret'>
        <NavLink to={showPath}>
          <Icon svg='ico-next-S' />
        </NavLink>
      </div>
    </li>
  )
}

export default connect(
  () => {
    const selectVenues = createSelectVenues()
    const selectOccasions = createSelectOccasions(selectVenues)
    return (state, ownProps) => ({
      occasions: selectOccasions(state, ownProps),
      venues: selectVenues(state, ownProps),
    })
  }
) (OffererItem)
