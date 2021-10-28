import '@testing-library/jest-dom'

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

describe('screen: Bookings / table pagination', () => {
  let props

  beforeEach(() => {
    props = {
      ...setDefaultProps(),
    }
  })

  it('displays only one page for 20 bookings or less', async () => {
    const bookings = Array(20).fill({})
    const { waitForTable } = renderBookingsScreen(props, bookings)
    const { getRows } = await waitForTable()

    const paginationWrapper = screen.getByTestId('table-pagination')
    const nextPageButton = within(paginationWrapper).getByLabelText('Page suivante')
    const prevPageButton = within(paginationWrapper).getByLabelText('Page précédente')

    expect(getRows()).toHaveLength(20)
    expect(within(paginationWrapper).getByText('Page 1/1')).toBeInTheDocument()
    expect(nextPageButton).toBeDisabled()
    expect(prevPageButton).toBeDisabled()
  })

  it('displays multiple pages and allow page navigation for more than 20 items', async () => {
    const bookings = Array(21).fill({})
    const { waitForTable } = renderBookingsScreen(props, bookings)
    const { getRows } = await waitForTable()

    const paginationWrapper = screen.getByTestId('table-pagination')
    const nextPageButton = within(paginationWrapper).getByLabelText('Page suivante')
    const prevPageButton = within(paginationWrapper).getByLabelText('Page précédente')

    expect(getRows()).toHaveLength(20)
    expect(within(paginationWrapper).getByText('Page 1/2')).toBeInTheDocument()
    expect(nextPageButton).toBeEnabled()
    expect(prevPageButton).toBeDisabled()

    userEvent.click(nextPageButton)
    expect(getRows()).toHaveLength(1)
    expect(within(paginationWrapper).getByText('Page 2/2')).toBeInTheDocument()
    expect(nextPageButton).toBeDisabled()
    expect(prevPageButton).toBeEnabled()

    userEvent.click(prevPageButton)
    expect(getRows()).toHaveLength(20)
    expect(within(paginationWrapper).getByText('Page 1/2')).toBeInTheDocument()
    expect(nextPageButton).toBeEnabled()
    expect(prevPageButton).toBeDisabled()
  })
})
