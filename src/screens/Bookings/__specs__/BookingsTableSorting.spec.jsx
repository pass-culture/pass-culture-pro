import '@testing-library/jest-dom'

import { render, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { setDefaultProps, tableBookingsFactory, tableUtils } from '../__tests-utils__'
import BookingsScreen from '../Bookings'

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

  const { waitForTable } = tableUtils()

  const checkSortOrder = async (cellName, usesCases) => {
    const { getHeadCell, getRow } = await waitForTable()
    const targetHeadCell = getHeadCell(cellName)
    const targetSortButton = within(targetHeadCell).getByRole('button')

    usesCases.initialOrder.forEach((textContent, index) => {
      expect(getRow(index).getCell(cellName).textContent).toContain(textContent)
    })

    userEvent.click(targetSortButton)

    usesCases.firstClickOrder.forEach((textContent, index) => {
      expect(getRow(index).getCell(cellName).textContent).toContain(textContent)
    })

    userEvent.click(targetSortButton)

    usesCases.secondClickOrder.forEach((textContent, index) => {
      expect(getRow(index).getCell(cellName).textContent).toContain(textContent)
    })

    userEvent.click(targetSortButton)

    usesCases.initialOrder.forEach((textContent, index) => {
      expect(getRow(index).getCell(cellName).textContent).toContain(textContent)
    })
  }

  return {
    ...utils,
    checkSortOrder,
  }
}

describe('screen: Bookings / sorting', () => {
  let props

  beforeEach(() => {
    props = setDefaultProps()
  })

  it('should sort results by offer name', async () => {
    const bookings = ['CCCC', 'AAAA', 'BBBB'].map(name => ({ offer: { name } }))
    const { checkSortOrder } = renderBookingsScreen(props, bookings)

    await checkSortOrder('offerName', {
      initialOrder: ['CCCC', 'AAAA', 'BBBB'],
      firstClickOrder: ['AAAA', 'BBBB', 'CCCC'],
      secondClickOrder: ['CCCC', 'BBBB', 'AAAA'],
    })
  })

  it('should sort results by beneficiary name', async () => {
    const bookings = ['CCCC', 'AAAA', 'BBBB'].map(lastname => ({ beneficiary: { lastname } }))
    const { checkSortOrder } = renderBookingsScreen(props, bookings)

    await checkSortOrder('beneficiary', {
      initialOrder: ['CCCC', 'AAAA', 'BBBB'],
      firstClickOrder: ['AAAA', 'BBBB', 'CCCC'],
      secondClickOrder: ['CCCC', 'BBBB', 'AAAA'],
    })
  })

  it('should sort beneficiary by firstname if they have the same lastname', async () => {
    const bookings = ['cccc', 'aaaa', 'bbbb'].map(firstname => ({
      beneficiary: { firstname, lastname: 'AAAA' },
    }))
    const { checkSortOrder } = renderBookingsScreen(props, bookings)

    await checkSortOrder('beneficiary', {
      initialOrder: ['AAAA cccc', 'AAAA aaaa', 'AAAA bbbb'],
      firstClickOrder: ['AAAA aaaa', 'AAAA bbbb', 'AAAA cccc'],
      secondClickOrder: ['AAAA cccc', 'AAAA bbbb', 'AAAA aaaa'],
    })
  })

  it('should sort reservation date', async () => {
    const bookings = [
      '2020-06-15T12:00:00Z',
      '2020-06-18T12:00:00Z',
      '2019-03-15T12:00:00Z',
    ].map(date => ({ date }))
    const { checkSortOrder } = renderBookingsScreen(props, bookings)

    await checkSortOrder('bookingDate', {
      initialOrder: ['15/06/2020', '18/06/2020', '15/03/2019'],
      firstClickOrder: ['15/03/2019', '15/06/2020', '18/06/2020'],
      secondClickOrder: ['18/06/2020', '15/06/2020', '15/03/2019'],
    })
  })
})
