import get from 'lodash.get'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'

import { SVGStars } from '../../../svg/SVGStars'

import MediationItem from './MediationItem/MediationItem'

class MediationsManager extends PureComponent {
  hasAtLeastOneActiveMediation() {
    const { hasMediations, atLeastOneActiveMediation } = this.props
    return hasMediations && atLeastOneActiveMediation
  }

  render() {
    const { mediations, offer } = this.props

    return (
      <div className="mediation-manager">
        {!this.hasAtLeastOneActiveMediation() && (
          <p className="info-message">
            {"Ajoutez une accroche pour mettre cette offre en avant dans l'application."}
          </p>
        )}

        <div className="box content has-text-centered">
          <ul className="mediations-list">
            {mediations.map(m => (
              <MediationItem
                key={m.id}
                mediation={m}
              />
            ))}
          </ul>
          <p>
            {offer && (
              <Link
                className="secondary-link"
                to={`/offres/${get(offer, 'id')}/accroches/nouveau`}
              >
                <SVGStars />
                <span>
                  {'Ajouter une accroche'}
                </span>
              </Link>
            )}
          </p>
        </div>
      </div>
    )
  }
}

MediationsManager.propTypes = {
  mediations: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  offer: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
}

export default MediationsManager
