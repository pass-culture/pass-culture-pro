import { tableBookingsFactory } from '../../../__tests-utils__'
import generateBookingsCsvFile, { CSV_HEADERS } from '../generateBookingsCsvFile'

describe('generateBookingsCsvFile', () => {
  it('should return data with csv header', () => {
    const bookings = []
    const result = generateBookingsCsvFile(bookings)
    expect(result).toStrictEqual([CSV_HEADERS])
  })

  it('should return data with all bookings', () => {
    const bookings = tableBookingsFactory([{ status: 'validated' }, { status: 'cancelled' }])
    const result = generateBookingsCsvFile(bookings)
    expect(result).toMatchInlineSnapshot(`
Array [
  Array [
    "Lieu",
    "Nom de l’offre",
    "Date de l'évènement",
    "ISBN",
    "Nom et prénom du bénéficiaire",
    "Email du bénéficiaire",
    "Téléphone du bénéficiaire",
    "Date et heure de réservation",
    "Date et heure de validation",
    "Contremarque",
    "Prix de la réservation",
    "Statut de la contremarque",
  ],
  Array [
    "venue name",
    "name",
    "15/05/2020 22:00",
    "",
    "lastname firstname",
    "user@email.com",
    "+33608255840",
    "15/05/2020 22:00",
    "",
    "TOKEN",
    "1",
    "validé",
  ],
  Array [
    "venue name",
    "name",
    "15/05/2020 22:00",
    "",
    "lastname firstname",
    "user@email.com",
    "+33608255840",
    "15/05/2020 22:00",
    "",
    "TOKEN",
    "1",
    "annulé",
  ],
]
`)
  })

  it('should add isbn only when stock has isbn value', () => {
    const bookings = tableBookingsFactory([{ offer: { isbn: '78931456214' } }, {}])
    const result = generateBookingsCsvFile(bookings)

    expect(result[1][3]).toMatchInlineSnapshot(`"78931456214"`)
    expect(result[2][3]).toMatchInlineSnapshot(`""`)
  })

  it('should return data with all bookings using offerer name when venue is virtual', () => {
    const bookings = tableBookingsFactory([{ venue: { isVirtual: true } }, {}])
    const result = generateBookingsCsvFile(bookings)

    expect(result[1][0]).toMatchInlineSnapshot(`"offererName - Offre numérique"`)
    expect(result[2][0]).toMatchInlineSnapshot(`"venue name"`)
  })
})
