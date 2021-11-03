import '@testing-library/jest-dom'
import { render, screen, waitFor, waitForElementToBeRemoved, within } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'

import NotificationContainer from 'components/layout/Notification/NotificationContainer'
import { MAX_LOADED_PAGES, BOOKING_STATUS } from 'constants/booking'
import { getVenuesForOfferer, loadFilteredBookingsRecap } from 'repository/pcapi/pcapi'
import {
  filtersUtils,
  noFilterMessage,
  noResultMessage,
  clickOnDisplayButton,
  tableUtils,
  waitForTableAndOpenStatusesFilters,
} from 'screens/Bookings/__tests-utils__'
import { configureTestStore } from 'store/testUtils'

import { venuesForOfferrerFactory, filteredBookingsRecapFactory } from '../__test-utils__'
import Bookings from '../Bookings'

jest.mock('repository/pcapi/pcapi', () => ({
  getVenuesForOfferer: jest.fn(),
  loadFilteredBookingsRecap: jest.fn(),
}))

jest.mock('utils/date', () => ({
  ...jest.requireActual('utils/date'),
  getToday: jest.fn().mockReturnValue(new Date('2020-06-15T12:00:00Z')),
}))

const renderBookingRoute = async (store = {}, routerState = undefined) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: '/reservations', state: routerState }]}>
        <Bookings />
        <NotificationContainer />
      </MemoryRouter>
    </Provider>
  )

describe('routes / Bookings', () => {
  let store
  let venues

  beforeEach(() => {
    let emptyBookingsRecapPage = {
      bookings_recap: [],
      page: 0,
      pages: 0,
      total: 0,
    }
    loadFilteredBookingsRecap.mockResolvedValue(emptyBookingsRecapPage)
    store = configureTestStore({
      data: {
        users: [{ publicName: 'René', isAdmin: false, email: 'rené@example.com' }],
      },
    })
    venues = venuesForOfferrerFactory([{}])
    getVenuesForOfferer.mockResolvedValue(venues)
  })

  afterEach(() => {
    loadFilteredBookingsRecap.mockReset()
    getVenuesForOfferer.mockReset()
  })

  it('mount and load, then remove loader when venues are loaded', async () => {
    renderBookingRoute(store)
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
    await waitForElementToBeRemoved(screen.queryByTestId('spinner'))
    expect(getVenuesForOfferer).toHaveBeenCalledWith()
  })

  it('display filters and message when loading is over', async () => {
    getVenuesForOfferer.mockResolvedValue(
      venuesForOfferrerFactory([{ id: 'venue_id_1' }, { id: 'venue_id_2', isVirtual: true }])
    )
    renderBookingRoute(store)
    await waitForElementToBeRemoved(screen.queryByTestId('spinner'))
    const { elements } = filtersUtils()
    expect(elements.venueSelect.options).toHaveLength(3)
    expect(elements.venueSelect.options[1].textContent).toStrictEqual(
      'offerer name - Offre numérique'
    )
    expect(elements.venueSelect.options[1].value).toStrictEqual('venue_id_2')
    expect(elements.venueSelect.options[2].textContent).toStrictEqual('public venue name')
    expect(elements.venueSelect.options[2].value).toStrictEqual('venue_id_1')

    expect(noFilterMessage()).toBeInTheDocument()
  })

  it('display an error notification if the server fail to return venues', async () => {
    getVenuesForOfferer.mockRejectedValue()
    renderBookingRoute(store)
    await waitForElementToBeRemoved(screen.queryByTestId('spinner'))
    const { elements } = filtersUtils()
    expect(elements.venueSelect.options).toHaveLength(1)

    expect(
      screen.getByText(
        'Nous avons rencontré un problème lors du chargement des données, essayez de recharger la page. Notre équipe à été informée de ce problème et travaille à sa résolution'
      )
    ).toBeInTheDocument()

    expect(noFilterMessage()).toBeInTheDocument()
  })

  it('display no results message when submiting and the server does not return any bookings', async () => {
    renderBookingRoute(store)
    await waitForElementToBeRemoved(screen.queryByTestId('spinner'))
    clickOnDisplayButton()
    await waitFor(() => expect(noResultMessage()).toBeInTheDocument())
  })

  it('display a table when submiting it return bookings', async () => {
    const bookings = [{}, {}, {}]
    loadFilteredBookingsRecap.mockResolvedValue({
      bookings_recap: filteredBookingsRecapFactory(bookings),
      page: 1,
      pages: 1,
      total: 1,
    })
    renderBookingRoute(store)
    await waitForElementToBeRemoved(screen.queryByTestId('spinner'))
    const { getRows } = await tableUtils().waitForTable()
    expect(getRows()).toHaveLength(bookings.length)
  })

  it('display an error notification if server fail for unknown reason', async () => {
    loadFilteredBookingsRecap.mockRejectedValue()
    renderBookingRoute(store)
    await waitForElementToBeRemoved(screen.queryByTestId('spinner'))
    clickOnDisplayButton()

    await waitFor(() =>
      expect(
        screen.getByText(
          'Nous avons rencontré un problème lors du chargement des données, essayez de recharger la page. Notre équipe à été informée de ce problème et travaille à sa résolution'
        )
      ).toBeInTheDocument()
    )

    expect(noResultMessage()).toBeInTheDocument()
  })

  it('should call loadFilteredBookingsRecap with pagination, and display notification when it reach the 5 pages limit', async () => {
    const bookingsPerPage = 10
    const baseResponse = {
      bookings_recap: filteredBookingsRecapFactory(Array(bookingsPerPage).fill({})),
      page: 1,
      pages: MAX_LOADED_PAGES + 1,
      total: 6000,
    }

    loadFilteredBookingsRecap
      .mockResolvedValueOnce(baseResponse)
      .mockResolvedValueOnce({ ...baseResponse, page: 2 })
      .mockResolvedValueOnce({ ...baseResponse, page: 3 })
      .mockResolvedValueOnce({ ...baseResponse, page: 4 })
      .mockResolvedValueOnce({ ...baseResponse, page: 5 })
      .mockResolvedValueOnce({ ...baseResponse, page: 6 })

    renderBookingRoute(store)
    await waitForElementToBeRemoved(screen.queryByTestId('spinner'))
    await tableUtils().waitForTable()

    await waitFor(() =>
      expect(
        screen.getByText(`${bookingsPerPage * MAX_LOADED_PAGES} réservations`)
      ).toBeInTheDocument()
    )

    expect(loadFilteredBookingsRecap).toHaveBeenCalledTimes(MAX_LOADED_PAGES)

    expect(
      screen.getByText(
        'L’affichage des réservations a été limité à 5 000 réservations. Vous pouvez modifier les filtres pour affiner votre recherche.'
      )
    ).toBeInTheDocument()
  })

  it('should pre select venue when venue is specified in location', async () => {
    const venueId = 'MY_VENUE_ID'
    getVenuesForOfferer.mockResolvedValue(
      venuesForOfferrerFactory([{ id: '1' }, { id: venueId }, { id: '2' }])
    )
    renderBookingRoute(store, { venueId })
    await waitForElementToBeRemoved(screen.queryByTestId('spinner'))
    const { elements } = filtersUtils()

    expect(elements.venueSelect.value).toStrictEqual(venueId)

    clickOnDisplayButton()

    await waitForElementToBeRemoved(screen.queryByTestId('spinner'))
    expect(loadFilteredBookingsRecap).toHaveBeenCalledWith(expect.objectContaining({ venueId }))
  })

  it('should pre select status filters if they specified in the location', async () => {
    const hiddenStatuses = ['booked', 'validated']
    const bookings = Object.values(BOOKING_STATUS).map(booking_status => ({ booking_status }))
    loadFilteredBookingsRecap.mockResolvedValueOnce({
      bookings_recap: filteredBookingsRecapFactory(bookings),
      page: 1,
      pages: 1,
      total: 1,
    })
    renderBookingRoute(store, { Statuses: hiddenStatuses })
    await waitForElementToBeRemoved(screen.queryByTestId('spinner'))

    const { statusHeadCell } = await waitForTableAndOpenStatusesFilters()

    expect(within(statusHeadCell).getByLabelText('réservé')).not.toBeChecked()
    expect(within(statusHeadCell).getByLabelText('validé')).not.toBeChecked()

    expect(within(statusHeadCell).getByLabelText('annulé')).toBeChecked()
    expect(within(statusHeadCell).getByLabelText('remboursé')).toBeChecked()
    expect(within(statusHeadCell).getByLabelText('confirmé')).toBeChecked()
  })
})
