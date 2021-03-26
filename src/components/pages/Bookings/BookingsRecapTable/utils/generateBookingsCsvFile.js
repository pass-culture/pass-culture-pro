import { format } from 'date-fns-tz'

import { FORMAT_DD_MM_YYYY_HH_mm, toDateStrippedOfTimezone } from 'utils/date'

import { getBookingStatusDisplayInformations } from '../CellsFormatter/utils/bookingStatusConverter'

export const CSV_HEADERS = [
  'Lieu',
  'Nom de l’offre',
  "Date de l'évènement",
  'ISBN',
  'Nom et prénom du bénéficiaire',
  'Email du bénéficiaire',
  'Date et heure de réservation',
  'Contremarque',
  'Prix de la réservation',
  'Statut de la contremarque',
]

function formatEventDatetimeIfEventType(booking) {
  if (booking.stock.type === 'event') {
    return format(
      toDateStrippedOfTimezone(booking.stock.event_beginning_datetime),
      FORMAT_DD_MM_YYYY_HH_mm
    )
  } else {
    return ''
  }
}

const generateBookingsCsvFile = bookings => {
  let csv_data = [CSV_HEADERS]

  bookings.forEach(booking => {
    const bookingArray = []
    const offerNameWithEscapedDoubleQuotes = booking.stock.offer_name.replace(/"/g, '""')

    if (booking.venue.is_virtual) {
      bookingArray.push(`${booking.offerer.name} - Offre numérique`)
    } else {
      bookingArray.push(booking.venue.name)
    }
    bookingArray.push(offerNameWithEscapedDoubleQuotes)
    bookingArray.push(formatEventDatetimeIfEventType(booking))
    bookingArray.push(booking.stock.offer_isbn || '')
    bookingArray.push(`${booking.beneficiary.lastname} ${booking.beneficiary.firstname}`)
    bookingArray.push(booking.beneficiary.email)
    const bookingDatetimeFormatted = format(
      toDateStrippedOfTimezone(booking.booking_date),
      FORMAT_DD_MM_YYYY_HH_mm
    )
    bookingArray.push(bookingDatetimeFormatted)
    bookingArray.push(booking.booking_token)
    bookingArray.push(booking.booking_amount)
    bookingArray.push(getBookingStatusDisplayInformations(booking.booking_status).status)
    csv_data.push(bookingArray)
  })
  return csv_data
}

export default generateBookingsCsvFile
