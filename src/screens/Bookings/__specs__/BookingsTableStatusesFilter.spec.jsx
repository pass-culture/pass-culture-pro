import '@testing-library/jest-dom'

import { render, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import {
  setDefaultProps,
  tableBookingsFactory,
  waitForTableAndOpenStatusesFilters,
} from '../__tests-utils__'
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

  return {
    ...utils,
    waitForTableAndOpenStatusesFilters,
  }
}
const statusesLabels = ['réservé', 'annulé', 'confirmé', 'remboursé', 'validé']
const statuses = ['booked', 'cancelled', 'confirmed', 'reimbursed', 'validated']

describe('screen: Bookings / statuses filters', () => {
  let props

  beforeEach(() => {
    props = setDefaultProps()
  })

  it('should display status filters checkboxes when user click on the status table head cell', async () => {
    const bookings = statuses.map(status => ({ status }))

    const { waitForTableAndOpenStatusesFilters } = renderBookingsScreen(props, bookings)
    const { statusHeadCell } = await waitForTableAndOpenStatusesFilters()

    statusesLabels.forEach(statusLabel => {
      const statusCheckBox = within(statusHeadCell).getByLabelText(statusLabel)
      expect(statusCheckBox).toBeInTheDocument()
      expect(statusCheckBox).toBeChecked()
    })
  })

  it('should only display status filters for statuses existing in the bookings data', async () => {
    const bookings = [
      {
        status: 'cancelled',
      },
    ]

    const { waitForTableAndOpenStatusesFilters } = renderBookingsScreen(props, bookings)
    const { statusHeadCell } = await waitForTableAndOpenStatusesFilters()
    const canceledStatusCheckbox = within(statusHeadCell).getByLabelText('annulé')

    expect(canceledStatusCheckbox).toBeInTheDocument()
    expect(canceledStatusCheckbox).toBeChecked()

    statusesLabels
      .filter(label => label !== 'annulé')
      .forEach(statusLabel => {
        expect(within(statusHeadCell).queryByLabelText(statusLabel)).not.toBeInTheDocument()
      })
  })

  it('should remove results based on selected statuses', async () => {
    const bookings = statuses.map(status => ({ status }))

    const { waitForTableAndOpenStatusesFilters } = renderBookingsScreen(props, bookings)
    const { statusHeadCell, getRows, getRow } = await waitForTableAndOpenStatusesFilters()

    const cancelledStatusCheckBox = within(statusHeadCell).getByLabelText('annulé')
    userEvent.click(cancelledStatusCheckBox)
    expect(cancelledStatusCheckBox).not.toBeChecked()

    let tableRows = getRows()
    expect(tableRows).toHaveLength(bookings.length - 1)

    tableRows.forEach((_row, index) => {
      const statusFlag = getRow(index).getCell('status').children[0].children[1]
      expect(statusFlag.textContent).not.toContain('annulé')
    })
  })

  it('should unselect statuses at load time if location statuses props are set', async () => {
    props = {
      ...props,
      locationStatuses: ['cancelled'],
    }

    const bookings = statuses.map(status => ({ status }))

    const { waitForTableAndOpenStatusesFilters } = renderBookingsScreen(props, bookings)
    const { statusHeadCell, getRows, getRow } = await waitForTableAndOpenStatusesFilters()

    const cancelledStatusCheckBox = within(statusHeadCell).getByLabelText('annulé')
    expect(cancelledStatusCheckBox).not.toBeChecked()

    let tableRows = getRows()
    expect(tableRows).toHaveLength(bookings.length - 1)

    tableRows.forEach((_row, index) => {
      const statusFlag = getRow(index).getCell('status').children[0].children[1]
      expect(statusFlag.textContent).not.toContain('annulé')
    })
  })
})
