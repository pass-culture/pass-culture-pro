import '@testing-library/jest-dom'

import { render, within } from '@testing-library/react'
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

  const { selectFirstRowCell } = tableUtils()

  return {
    ...utils,
    selectFirstRowCell,
  }
}

describe('screen: Bookings / status history', () => {
  let baseBooking
  let props

  beforeEach(() => {
    props = {
      ...setDefaultProps(),
    }

    baseBooking = {
      status: 'validated',
      offer: {
        name: 'My Booking Name',
      },
      amount: '29.99',
      statusHistory: [
        { date: '2020-05-15T22:00:00.000Z', status: 'booked' },
        { date: '2020-05-16T22:00:00.000Z', status: 'validated' },
      ],
    }
  })

  it('displays correctly the booking status history', async () => {
    const { selectFirstRowCell } = renderBookingsScreen(props, [baseBooking])
    const statusCell = await selectFirstRowCell('status')
    const statusHistory = statusCell.children[0].children[2]

    expect(within(statusHistory).getByText(baseBooking.offer.name)).toBeInTheDocument()
    expect(within(statusHistory).getByText('Prix : 29,99 €', { exact: false })).toBeInTheDocument()
    expect(within(statusHistory).getAllByRole('listitem')).toHaveLength(
      baseBooking.statusHistory.length
    )
    expect(within(statusHistory).getByText('Réservé : 15/05/2020 22:00')).toBeInTheDocument()
    expect(
      within(statusHistory).getByText('Réservation validée : 16/05/2020 22:00')
    ).toBeInTheDocument()
  })

  it('displays free price when amount is null or 0', async () => {
    baseBooking = {
      ...baseBooking,
      amount: 0,
    }
    const { selectFirstRowCell } = renderBookingsScreen(props, [baseBooking])
    const statusCell = await selectFirstRowCell('status')
    const statusHistory = statusCell.children[0].children[2]
    expect(within(statusHistory).getByText('Prix : gratuit', { exact: false })).toBeInTheDocument()
  })

  it('does not display time for reimbursement history', async () => {
    baseBooking = {
      ...baseBooking,
      statusHistory: [{ date: '2020-05-15T22:00:00.000Z', status: 'reimbursed' }],
    }
    const { selectFirstRowCell } = renderBookingsScreen(props, [baseBooking])
    const statusCell = await selectFirstRowCell('status')
    const statusHistory = statusCell.children[0].children[2]
    const historyItem = within(statusHistory).getByRole('listitem')
    expect(historyItem.textContent).toStrictEqual('Remboursée : 15/05/2020')
  })

  it('should display a "-" when date is unknown', async () => {
    baseBooking = {
      ...baseBooking,
      statusHistory: [{ date: null, status: 'reimbursed' }],
    }
    const { selectFirstRowCell } = renderBookingsScreen(props, [baseBooking])
    const statusCell = await selectFirstRowCell('status')
    const statusHistory = statusCell.children[0].children[2]
    const historyItem = within(statusHistory).getByRole('listitem')
    expect(historyItem.textContent).toStrictEqual('Remboursée : -')
  })
})
