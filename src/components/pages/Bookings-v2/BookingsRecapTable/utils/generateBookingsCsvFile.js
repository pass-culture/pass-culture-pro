import moment from 'moment'
import { FORMAT_DD_MM_YYYY_HH_mm } from '../../../../../utils/date'
import { getStatusName } from '../CellsFormatter/utils/bookingStatusConverter'

export const CSV_HEADERS = [
  'Nom de l’offre',
  "Date de l'évènement",
  'ISBN',
  'Nom et prénom du bénéficiaire',
  'Email du bénéficiaire',
  'Date et heure de réservation',
  'Contremarque',
  'Statut de la contremarque',
]

function formatEventDatetimeIfEventType(booking) {
  if (booking.stock.type === 'event') {
    return moment.parseZone(booking.stock.event_beginning_datetime).format(FORMAT_DD_MM_YYYY_HH_mm)
  } else {
    return ''
  }
}

const generateBookingsCsvFile = bookings => {
  let csv_data = [CSV_HEADERS]

  bookings.forEach(booking => {
    const bookingArray = []

    bookingArray.push(booking.stock.offer_name)

    bookingArray.push(formatEventDatetimeIfEventType(booking))
    bookingArray.push(booking.stock.offer_isbn || '')

    bookingArray.push(booking.beneficiary.lastname.concat(' ', booking.beneficiary.firstname))
    bookingArray.push(booking.beneficiary.email)
    const bookingDatetimeFormatted = moment
      .parseZone(booking.booking_date)
      .format(FORMAT_DD_MM_YYYY_HH_mm)
    bookingArray.push(bookingDatetimeFormatted)
    bookingArray.push(booking.booking_token)
    bookingArray.push(getStatusName(booking.booking_status))
    csv_data.push(bookingArray)
  })
  return csv_data
}

export default generateBookingsCsvFile
