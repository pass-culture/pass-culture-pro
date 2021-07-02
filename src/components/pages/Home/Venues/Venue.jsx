import * as PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

import useActiveFeature from 'components/hooks/useActiveFeature'
import Icon from 'components/layout/Icon'
import { BOOKING_STATUS } from 'components/pages/Bookings/BookingsRecapTableLegacy/CellsFormatter/utils/bookingStatusConverter'
import { ReactComponent as IcoPlus } from 'icons/ico-plus.svg'

import VenueStat from './VenueStat'

const Venue = ({ id, isVirtual, name, offererId, publicName, venueStats }) => {
  const venueStatData = [
    {
      count: venueStats.activeOffersCount.toString(),
      label: 'Offres actives',
      link: `/offres?lieu=${id}&statut=active`,
    },
    {
      count: venueStats.activeBookingsQuantity.toString(),
      label: 'Réservations en cours',
      link: {
        pathname: '/reservations',
        state: {
          venueId: id,
          statuses: [
            BOOKING_STATUS.CANCELLED,
            BOOKING_STATUS.CONFIRMED,
            BOOKING_STATUS.REIMBURSED,
            BOOKING_STATUS.VALIDATED,
          ],
        },
      },
    },
    {
      count: venueStats.validatedBookingsQuantity.toString(),
      label: 'Réservations validées',
      link: {
        pathname: '/reservations',
        state: {
          venueId: id,
          statuses: [BOOKING_STATUS.BOOKED, BOOKING_STATUS.CANCELLED],
        },
      },
    },
    {
      count: venueStats.soldOutOffersCount.toString(),
      label: 'Offres stocks épuisés',
      link: `/offres?lieu=${id}&statut=epuisee`,
    },
  ]

  const isVenueV2Enabled = useActiveFeature('ENABLE_NEW_VENUE_PAGES')

  let editVenueLink = `/structures/${offererId}/lieux/${id}`
  if (!isVenueV2Enabled) {
    editVenueLink += '?modification'
  }

  return (
    <div className="h-section-row nested offerer-venue">
      <div className={`h-card h-card-${isVirtual ? 'primary' : 'secondary'}`}>
        <div className="h-card-inner">
          <div className="h-card-header-row">
            <h3 className="h-card-title">
              <Icon
                className="h-card-title-ico"
                svg={isVirtual ? 'ico-screen-play' : 'ico-box'}
              />
              <span
                className="title-text"
                title={publicName || name}
              >
                {publicName || name}
              </span>
            </h3>
            {!isVirtual && (
              <Link
                className="tertiary-link"
                to={editVenueLink}
              >
                <Icon svg="ico-outer-pen" />
                {'Modifier'}
              </Link>
            )}
          </div>
          <div className="venue-stats">
            {venueStatData.map(stat => (
              <Fragment key={stat.label}>
                <VenueStat stat={stat} />
                <div className="separator" />
              </Fragment>
            ))}

            <div className="h-card-col v-add-offer-link">
              <Link
                className="tertiary-link"
                to={`/offres/creation?structure=${offererId}&lieu=${id}`}
              >
                <IcoPlus />
                <div>
                  {isVirtual ? 'Créer une nouvelle offre numérique' : 'Créer une nouvelle offre'}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Venue.defaultProps = {
  id: '',
  isVirtual: false,
  offererId: '',
  publicName: '',
}

Venue.propTypes = {
  id: PropTypes.string,
  isVirtual: PropTypes.bool,
  name: PropTypes.string.isRequired,
  offererId: PropTypes.string,
  publicName: PropTypes.string,
  venueStats: PropTypes.shape({
    activeBookingsQuantity: PropTypes.number,
    activeOffersCount: PropTypes.number,
    soldOutOffersCount: PropTypes.number,
    validatedBookingsQuantity: PropTypes.number,
  }).isRequired,
}

export default Venue
