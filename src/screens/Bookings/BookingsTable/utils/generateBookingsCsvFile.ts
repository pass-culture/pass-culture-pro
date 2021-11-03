/*
* @debt complexity "Gaël: the file contains eslint error(s) based on our new config"
*/

import { format } from 'date-fns-tz'

import { FORMAT_DD_MM_YYYY_HH_mm, toDateStrippedOfTimezone } from 'utils/date'

import { statusDisplayInfos } from './statusDisplayInfos'

export const CSV_HEADERS = [
  'Lieu',
  'Nom de l’offre',
  "Date de l'évènement",
  'ISBN',
  'Nom et prénom du bénéficiaire',
  'Email du bénéficiaire',
  'Téléphone du bénéficiaire',
  'Date et heure de réservation',
  'Date et heure de validation',
  'Contremarque',
  'Prix de la réservation',
  'Statut de la contremarque',
]

const formatEventDatetimeIfEventType = (booking: ITableBooking): string =>  booking.date ? format(
  toDateStrippedOfTimezone(booking.date),
  FORMAT_DD_MM_YYYY_HH_mm
) : ''

const formatVenue = (booking: ITableBooking): string => {
  if (booking.venue.isVirtual) {
    return `${booking.offererName} - Offre numérique`
  }
  return booking.venue.name
}

const formatBookingDate = (date: Date): string => format(
  toDateStrippedOfTimezone(date),
  FORMAT_DD_MM_YYYY_HH_mm
)

const formatValidatedBookingDate = (booking: ITableBooking): string => {
  const validatedStatus = booking.statusHistory.find(
    status => status.status === 'validated'
  )
  return validatedStatus
    ? format(toDateStrippedOfTimezone(validatedStatus.date), FORMAT_DD_MM_YYYY_HH_mm)
    : ''
}

const generateBookingsCsvFile = (bookings: ITableBooking[]): string[][] => {
  const csv_data = [CSV_HEADERS]

  bookings.forEach(booking => {
    const bookingArray = [
      formatVenue(booking),
      booking.offer.name.replace(/"/g, '""'),
      formatEventDatetimeIfEventType(booking),
      booking.offer.isbn || '',
      `${booking.beneficiary.lastname} ${booking.beneficiary.firstname}`,
      booking.beneficiary.email,
      booking.beneficiary.phonenumber,
      formatBookingDate(booking.date),
      formatValidatedBookingDate(booking),
      booking.token,
      booking.amount.toLocaleString('fr-FR'),
      statusDisplayInfos(booking.status).status
    ]

    csv_data.push(bookingArray)
  })

  return csv_data
}

export default generateBookingsCsvFile
