import { Icon } from 'pass-culture-shared'
import React from 'react'
import PropTypes from 'prop-types'
import { formatLocalTimeDateString } from '../../../../utils/timezone'

const displayBookingDate = booking => {
  if (!booking) {
    return null
  }

  if (booking.date) {
    return formatLocalTimeDateString(booking.date, booking.venueDepartementCode)
  }

  return 'Permanent'
}

const DeskState = ({ message, level, booking }) => (
  <div className="desk-state">
    <table className="booking-summary">
      <tbody>
        <tr>
          <th>Utilisateur :</th>
          <td>{booking && booking.userName}</td>
        </tr>
        <tr>
          <th>Offre :</th>
          <td>{booking && booking.offerName}</td>
        </tr>
        <tr>
          <th>Date de l'offre :</th>
          <td>{displayBookingDate(booking)}</td>
        </tr>
      </tbody>
    </table>
    <div className={`state ${level}`}>
      {level === 'success' && <Icon svg="picto-validation" />}
      {level === 'error' && <Icon svg="picto-echec" />}
      <span>{message}</span>
    </div>
  </div>
)

DeskState.propTypes = {
  booking: PropTypes.shape({
    date: PropTypes.string,
    offerName: PropTypes.string,
    userName: PropTypes.string,
    venueDepartementCode: PropTypes.string,
  }),
  message: PropTypes.string.isRequired,
  level: PropTypes.string.isRequired,
}

export default DeskState
