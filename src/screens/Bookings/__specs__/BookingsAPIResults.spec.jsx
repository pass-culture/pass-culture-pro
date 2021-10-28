import '@testing-library/jest-dom'

import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'

import {
  clickOnDisplayButton,
  tableBookingsFactory,
  setDefaultProps,
  noFilterMessage,
} from '../__tests-utils__'
import BookingsScreen from '../Bookings'

jest.mock('utils/date', () => ({
  ...jest.requireActual('utils/date'),
  getToday: jest.fn().mockReturnValue(new Date('2020-06-15T12:00:00Z')),
}))

const renderBookingsScreen = props => render(<BookingsScreen {...props} />)

describe('screen: Bookings / api results behaviors', () => {
  let props

  beforeEach(() => {
    props = setDefaultProps()
  })

  it('initialy render a message expecting user to click on "afficher"', async () => {
    renderBookingsScreen(props)
    await waitFor(() => expect(noFilterMessage()).toBeInTheDocument())
  })

  it('should display no result message if load bookings return empty results', async () => {
    renderBookingsScreen(props)
    clickOnDisplayButton()

    await waitFor(() =>
      expect(
        screen.queryByText('Aucune réservation trouvée pour votre recherche.')
      ).toBeInTheDocument()
    )
  })

  it('should display a table when there are corresponding results', async () => {
    const bookingList = tableBookingsFactory([{}])

    props = {
      ...props,
      getAllBookings: jest.fn().mockResolvedValue({
        hasReachedBookingsCountLimit: false,
        requestStatus: 'success',
        bookingList,
      }),
    }

    renderBookingsScreen(props)
    clickOnDisplayButton()
    await waitFor(() => expect(screen.queryByRole('table')).toBeInTheDocument())
  })

  it('should call showResultLimitNotification when server as reached the booking count limit', async () => {
    const bookingList = tableBookingsFactory([{}])

    props = {
      ...props,
      getAllBookings: jest.fn().mockResolvedValue({
        hasReachedBookingsCountLimit: true,
        requestStatus: 'success',
        bookingList,
      }),
    }

    renderBookingsScreen(props)
    clickOnDisplayButton()
    await waitFor(() => expect(props.showResultLimitNotification).toHaveBeenCalledWith())
  })

  it('should call notifyServerError when server encounter an unknown error', async () => {
    props = {
      ...props,
      getAllBookings: jest.fn().mockResolvedValue({
        hasReachedBookingsCountLimit: false,
        requestStatus: 'error',
        bookingList: [],
      }),
    }

    renderBookingsScreen(props)
    clickOnDisplayButton()
    await waitFor(() => expect(props.notifyServerError).toHaveBeenCalledWith())
  })
})
