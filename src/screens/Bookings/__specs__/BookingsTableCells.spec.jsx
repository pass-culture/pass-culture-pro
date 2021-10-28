import '@testing-library/jest-dom'

import { render, screen, within } from '@testing-library/react'
import React from 'react'

import { setDefaultProps, tableBookingsFactory, tableUtils } from '../__tests-utils__'
import BookingsScreen from '../Bookings'

jest.mock('utils/date', () => ({
  ...jest.requireActual('utils/date'),
  getToday: jest.fn().mockReturnValue(new Date('2020-06-15T12:00:00Z')),
}))

const renderBookingsScreen = (props, bookingList = [{}]) => {
  const propsWithBooking = {
    ...props,
    getAllBookings: jest.fn().mockResolvedValue({
      hasReachedBookingsCountLimit: true,
      requestStatus: 'success',
      bookingList: tableBookingsFactory(bookingList),
    }),
  }

  const utils = render(<BookingsScreen {...propsWithBooking} />)

  const { waitForTable, selectFirstRowCell } = tableUtils()

  return {
    ...utils,
    waitForTable,
    selectFirstRowCell,
  }
}

describe('screen: Bookings / table cells', () => {
  let props

  beforeEach(() => {
    props = {
      ...setDefaultProps(),
    }
  })

  it('displays the number of bookings', async () => {
    const bookings = [{}, {}, {}, {}]
    const { waitForTable } = renderBookingsScreen(props, bookings)
    await waitForTable()
    expect(screen.getByText(`${bookings.length} réservations`)).toBeInTheDocument()
  })

  it('displays a csv download link', async () => {
    const bookings = [{}, {}, {}, {}]
    const { waitForTable } = renderBookingsScreen(props, bookings)
    await waitForTable()
    expect(screen.getByRole('link', { name: /Télécharger le CSV$/i })).toBeInTheDocument()
  })

  it('displays the right columns headers', async () => {
    const { waitForTable } = renderBookingsScreen(props, [{}])
    const { getHeadCell, tableHead } = await waitForTable()

    expect(tableHead.children).toHaveLength(6)

    const OfferName = getHeadCell('offerName')
    expect(OfferName.textContent).toMatchInlineSnapshot(`"Nom de l'offre"`)
    expect(within(OfferName).getByRole('button')).toBeInTheDocument()

    const IsDuo = getHeadCell('isDuo')
    expect(IsDuo.textContent).toMatchInlineSnapshot(`""`)

    const beneficiary = getHeadCell('beneficiary')
    expect(beneficiary.textContent).toMatchInlineSnapshot(`"Bénéficiaire"`)
    expect(within(beneficiary).getByRole('button')).toBeInTheDocument()

    const bookingDate = getHeadCell('bookingDate')
    expect(bookingDate.textContent).toMatchInlineSnapshot(`"Réservation"`)
    expect(within(bookingDate).getByRole('button')).toBeInTheDocument()

    const bookingToken = getHeadCell('bookingToken')
    expect(bookingToken.textContent).toMatchInlineSnapshot(`"Contremarque"`)

    const status = getHeadCell('status')
    expect(status.textContent).toMatchInlineSnapshot(`"Statut"`)
  })

  it('displays correctly the offerName Cells', async () => {
    const bookings = [
      {
        offer: {
          eventBeginningDate: '2020-05-15T22:00:00.000Z',
        },
      },
      {
        offer: {
          isbn: '9864752235',
        },
      },
    ]
    const { waitForTable } = renderBookingsScreen(props, bookings)
    const { getRow } = await waitForTable()
    const eventOfferNameCell = getRow(0).getCell('offerName')
    const eventOfferLink = within(eventOfferNameCell).getByRole('link')

    expect(eventOfferLink).toBeInTheDocument()
    expect(eventOfferLink.href).toContain(`offres/id/edition`)
    expect(eventOfferLink.target).toBe('_blank')
    expect(eventOfferLink.textContent).toContain('15/05/2020 22:00')
    expect(eventOfferLink.textContent).toContain('name')

    const bookOfferNameCell = getRow(1).getCell('offerName')
    const bookOfferLink = within(bookOfferNameCell).getByRole('link')
    expect(bookOfferLink.textContent).toContain('9864752235')
  })

  it('displays correctly the isDuo Cell', async () => {
    const bookings = [{ isDuo: true }, { isDuo: false }]

    const { waitForTable } = renderBookingsScreen(props, bookings)
    const { getRow } = await waitForTable()
    const duoRowDuoCell = getRow(0).getCell('isDuo')
    const soloRowDuoCell = getRow(1).getCell('isDuo')

    expect(within(duoRowDuoCell).getByTitle('Réservation DUO')).toBeInTheDocument()
    expect(within(soloRowDuoCell).queryByTitle('Réservation DUO')).not.toBeInTheDocument()
  })

  it('displays correctly the beneficiary Cell', async () => {
    const beneficiary = {
      firstname: 'Laurent',
      lastname: 'Durond',
      email: 'laurentdurond@example.com',
      phonenumber: '33608255840',
    }
    const { selectFirstRowCell } = renderBookingsScreen(props, [{ beneficiary }])
    const beneficiaryCell = await selectFirstRowCell('beneficiary')
    expect(beneficiaryCell.textContent).toContain(
      `${beneficiary.lastname} ${beneficiary.firstname}`
    )
    expect(beneficiaryCell.textContent).toContain(beneficiary.email)
    expect(beneficiaryCell.textContent).toContain(beneficiary.phonenumber)
  })

  it('displays correctly the booking date Cell', async () => {
    const booking = {
      date: '2020-05-15T22:00:00.000Z',
    }
    const { selectFirstRowCell } = renderBookingsScreen(props, [booking])
    const dateCell = await selectFirstRowCell('bookingDate')
    expect(dateCell.textContent).toContain('15/05/2020')
    expect(dateCell.textContent).toContain('22:00')
  })

  it('displays correctly the token Cell', async () => {
    const booking = {
      token: 'TOKEN',
    }
    const { selectFirstRowCell } = renderBookingsScreen(props, [booking])
    const tokenCell = await selectFirstRowCell('bookingToken')
    expect(tokenCell.textContent).toContain(booking.token)
  })

  it('displays correctly the booking status Cell', async () => {
    const booking = {
      status: 'validated',
    }
    const { selectFirstRowCell } = renderBookingsScreen(props, [booking])
    const statusCell = await selectFirstRowCell('status')
    const statusTag = statusCell.children[0].children[1]
    expect(statusTag.textContent).toStrictEqual('validé')
  })
})
