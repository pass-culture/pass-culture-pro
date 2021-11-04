/*
 * @debt complexity "Gaël: file over 300 lines"
 * @debt complexity "Gaël: the file contains eslint error(s) based on our new config"
 * @debt rtl "Gaël: bad use of act in testing library"
 */

import '@testing-library/jest-dom'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'

import NotificationContainer from 'components/layout/Notification/NotificationContainer'
import { BOOKING_STATUS } from 'components/pages/Bookings/BookingsRecapTable/CellsFormatter/utils/bookingStatusConverter'
import { DEFAULT_PRE_FILTERS } from 'components/pages/Bookings/PreFilters/_constants'
import { getVenuesForOfferer, loadFilteredBookingsRecap } from 'repository/pcapi/pcapi'
import { configureTestStore } from 'store/testUtils'
import { bookingRecapFactory, venueFactory } from 'utils/apiFactories'
import { getNthCallNthArg } from 'utils/testHelpers'

import BookingsRecapContainer from '../BookingsRecapContainer'
import { downLoadCSVFile } from '../downloadCSVBookings'

jest.mock('repository/pcapi/pcapi', () => ({
  getVenuesForOfferer: jest.fn(),
  loadFilteredBookingsRecap: jest.fn(),
}))

jest.mock('../downloadCSVBookings', () => ({
  downLoadCSVFile: jest.fn(),
}))

jest.mock('utils/date', () => ({
  ...jest.requireActual('utils/date'),
  getToday: jest.fn().mockReturnValue(new Date('2020-06-15T12:00:00Z')),
}))

const renderBookingsRecap = async (props, store = {}, routerState) => {
  await act(async () => {
    await render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: '/reservations', state: routerState }]}>
          <BookingsRecapContainer {...props} />
          <NotificationContainer />
        </MemoryRouter>
      </Provider>
    )
  })
}

describe('components | BookingsRecap | Pro user', () => {
  let props
  let store
  let venue

  beforeEach(() => {
    let emptyBookingsRecapPage = {
      bookings_recap: [],
      page: 0,
      pages: 0,
      total: 0,
    }
    loadFilteredBookingsRecap.mockResolvedValue(emptyBookingsRecapPage)
    props = {
      location: {
        state: null,
      },
    }
    store = configureTestStore({
      data: {
        users: [{ publicName: 'René', isAdmin: false, email: 'rené@example.com' }],
      },
    })
    venue = venueFactory()
    getVenuesForOfferer.mockResolvedValue([venue])
  })

  afterEach(() => {
    loadFilteredBookingsRecap.mockReset()
  })

  it('should show a pre-filter section', async () => {
    // When
    await renderBookingsRecap(props, store)

    // Then
    const eventDateFilter = screen.getByLabelText('Date de l’évènement')
    const eventVenueFilter = screen.getByLabelText('Lieu')
    const eventBookingPeriodFilter = screen.getByText('Période de réservation')
    expect(eventDateFilter).toBeInTheDocument()
    expect(eventVenueFilter).toBeInTheDocument()
    expect(eventBookingPeriodFilter).toBeInTheDocument()
    expect(eventVenueFilter).toHaveValue(DEFAULT_PRE_FILTERS.offerVenueId)
    expect(eventDateFilter).not.toHaveValue()
  })

  it('should init venue pre-filter with venueId in router state', async () => {
    // When
    await renderBookingsRecap(props, store, { venueId: venue.id, statuses: [] })

    // Then
    const eventVenueFilter = screen.getByLabelText('Lieu')
    expect(eventVenueFilter).toHaveValue(venue.id)
  })

  it('should request bookings pre-filtered by venue and period when coming from home page', async () => {
    // Given
    loadFilteredBookingsRecap.mockResolvedValue({
      page: 1,
      pages: 1,
      total: 1,
      bookings_recap: [bookingRecapFactory()],
    })

    // When
    await renderBookingsRecap(props, store, {
      venueId: venue.id,
      statuses: [
        BOOKING_STATUS.CANCELLED,
        BOOKING_STATUS.CONFIRMED,
        BOOKING_STATUS.REIMBURSED,
        BOOKING_STATUS.VALIDATED,
      ],
    })
    const statusFilterButton = await screen.findByText('Statut')
    fireEvent.click(statusFilterButton)

    // Then
    expect(screen.getByLabelText('Lieu')).toHaveValue(venue.id)
    expect(getNthCallNthArg(loadFilteredBookingsRecap, 1).venueId).toBe(venue.id)
    expect(getNthCallNthArg(loadFilteredBookingsRecap, 1).bookingPeriodBeginningDate).toStrictEqual(
      DEFAULT_PRE_FILTERS.bookingBeginningDate
    )
    expect(getNthCallNthArg(loadFilteredBookingsRecap, 1).bookingPeriodEndingDate).toStrictEqual(
      DEFAULT_PRE_FILTERS.bookingEndingDate
    )
    expect(screen.getByRole('checkbox', { name: 'réservé', checked: true })).toBeInTheDocument()
  })

  it('should ask user to select a pre-filter before clicking on "Afficher"', async () => {
    // When
    await renderBookingsRecap(props, store)

    // Then
    expect(loadFilteredBookingsRecap).not.toHaveBeenCalled()
    const choosePreFiltersMessage = screen.getByText(
      'Pour visualiser vos réservations, veuillez sélectionner un ou plusieurs des filtres précédents et cliquer sur « Afficher »'
    )
    expect(choosePreFiltersMessage).toBeInTheDocument()
  })

  it('should request bookings of venue requested by user when user clicks on "Afficher"', async () => {
    // Given
    let bookingRecap = bookingRecapFactory()
    loadFilteredBookingsRecap.mockResolvedValue({
      page: 1,
      pages: 1,
      total: 1,
      bookings_recap: [bookingRecap],
    })
    await renderBookingsRecap(props, store)

    // When
    userEvent.selectOptions(screen.getByLabelText('Lieu'), venue.id)
    fireEvent.click(screen.getByRole('button', { name: 'Afficher' }))

    // Then
    await screen.findAllByText(bookingRecap.stock.offer_name)
    expect(getNthCallNthArg(loadFilteredBookingsRecap, 1).venueId).toBe(venue.id)
  })

  it('should warn user that his prefilters returned no booking when no bookings where returned by selected pre-filters', async () => {
    // Given
    loadFilteredBookingsRecap.mockResolvedValue({
      page: 1,
      pages: 0,
      total: 0,
      bookings_recap: [],
    })
    await renderBookingsRecap(props, store)

    // When
    fireEvent.click(screen.getByRole('button', { name: 'Afficher' }))

    // Then
    const noBookingsForPreFilters = await screen.findByText(
      'Aucune réservation trouvée pour votre recherche.'
    )
    expect(noBookingsForPreFilters).toBeInTheDocument()
  })

  it('should allow user to reset its pre-filters in the no bookings warning', async () => {
    // Given
    loadFilteredBookingsRecap.mockResolvedValue({
      page: 1,
      pages: 0,
      total: 0,
      bookings_recap: [],
    })
    await renderBookingsRecap(props, store)
    userEvent.selectOptions(screen.getByLabelText('Lieu'), venue.id)
    fireEvent.click(screen.getByRole('button', { name: 'Afficher' }))

    // When
    const resetButton = await screen.findByText('réinitialiser tous les filtres.')
    fireEvent.click(resetButton)

    // Then
    expect(screen.getByLabelText('Lieu')).toHaveValue(DEFAULT_PRE_FILTERS.offerVenueId)
  })

  it('should not allow user to reset prefilters when none were applied', async () => {
    // Given
    let bookingRecap = bookingRecapFactory()
    loadFilteredBookingsRecap.mockResolvedValue({
      page: 1,
      pages: 1,
      total: 1,
      bookings_recap: [bookingRecap],
    })
    await renderBookingsRecap(props, store)

    // When
    fireEvent.click(screen.getByRole('button', { name: 'Afficher' }))

    // Then
    expect(screen.queryByText('Réinitialiser les filtres')).not.toBeInTheDocument()
  })

  it('should allow user to reset prefilters when some where applied', async () => {
    // Given
    let bookingRecap = bookingRecapFactory()
    loadFilteredBookingsRecap.mockResolvedValue({
      page: 1,
      pages: 1,
      total: 1,
      bookings_recap: [bookingRecap],
    })
    await renderBookingsRecap(props, store)
    userEvent.selectOptions(screen.getByLabelText('Lieu'), venue.id)
    const defaultBookingPeriodBeginningDateInput = '16/05/2020'
    const defaultBookingPeriodEndingDateInput = '15/06/2020'
    const bookingPeriodBeginningDateInput = screen.getByDisplayValue(
      defaultBookingPeriodBeginningDateInput
    )
    fireEvent.click(bookingPeriodBeginningDateInput)
    fireEvent.click(screen.getAllByText('5')[0])
    const bookingPeriodEndingDateInput = screen.getByDisplayValue(
      defaultBookingPeriodEndingDateInput
    )
    fireEvent.click(bookingPeriodEndingDateInput)
    fireEvent.click(screen.getAllByText('5')[0])
    fireEvent.click(screen.getByRole('button', { name: 'Afficher' }))

    // When
    const resetButton = await screen.findByText('Réinitialiser les filtres')
    fireEvent.click(resetButton)

    // Then
    expect(screen.getByLabelText('Lieu')).toHaveValue(DEFAULT_PRE_FILTERS.offerVenueId)
    expect(
      await screen.findByDisplayValue(defaultBookingPeriodBeginningDateInput)
    ).toBeInTheDocument()
    expect(await screen.findByDisplayValue(defaultBookingPeriodEndingDateInput)).toBeInTheDocument()
  })

  it('should ask user to select a pre-filter when user reset them', async () => {
    // Given
    let bookingRecap = bookingRecapFactory()
    loadFilteredBookingsRecap.mockResolvedValue({
      page: 1,
      pages: 1,
      total: 1,
      bookings_recap: [bookingRecap],
    })
    await renderBookingsRecap(props, store)
    userEvent.selectOptions(screen.getByLabelText('Lieu'), venue.id)
    fireEvent.click(screen.getByRole('button', { name: 'Afficher' }))

    // When
    const resetButton = await screen.findByText('Réinitialiser les filtres')
    fireEvent.click(resetButton)

    // Then
    expect(screen.queryByText('Réinitialiser les filtres')).not.toBeInTheDocument()
    const choosePreFiltersMessage = screen.getByText(
      'Pour visualiser vos réservations, veuillez sélectionner un ou plusieurs des filtres précédents et cliquer sur « Afficher »'
    )
    expect(choosePreFiltersMessage).toBeInTheDocument()
  })

  it('should have a CSV download button', async () => {
    // When
    await renderBookingsRecap(props, store)

    // Then
    expect(screen.getByRole('button', { name: 'Télécharger' })).toBeInTheDocument()
  })

  it('should fetch API for CSV when clicking on the download button and disable button while its loading', async () => {
    // Given
    await renderBookingsRecap(props, store)

    // When
    const downloadButton = screen.getByRole('button', { name: 'Télécharger' })
    fireEvent.click(downloadButton)

    // Then
    expect(downloadButton).toBeDisabled()
    expect(downLoadCSVFile).toHaveBeenCalledWith({
      "bookingPeriodBeginningDate": DEFAULT_PRE_FILTERS.bookingBeginningDate,
      "bookingPeriodEndingDate": DEFAULT_PRE_FILTERS.bookingEndingDate,
      "eventDate": "all",
      "page": 1,
      "venueId": "all",
    })
    await waitFor(() => expect(downloadButton).toBeEnabled())
  })

  it('should display an error message on CSV download when API returns a status other than 200', async () => {
    // Given
    downLoadCSVFile.mockReturnValueOnce('error')
    await renderBookingsRecap(props, store)

    // When
    await fireEvent.click(screen.getByRole('button', { name: 'Télécharger' }))

    // Then
    expect(screen.getByText('Une erreur s\'est produite. Veuillez réessayer ultérieurement.')).toBeInTheDocument()
  })

  it('should fetch bookings for the filtered venue as many times as the number of pages', async () => {
    // Given
    const bookings1 = bookingRecapFactory()
    const bookings2 = bookingRecapFactory()
    const paginatedBookingRecapReturned = {
      page: 1,
      pages: 2,
      total: 2,
      bookings_recap: [bookings1],
    }
    const secondPaginatedBookingRecapReturned = {
      page: 2,
      pages: 2,
      total: 2,
      bookings_recap: [bookings2],
    }
    loadFilteredBookingsRecap
      .mockResolvedValueOnce(paginatedBookingRecapReturned)
      .mockResolvedValueOnce(secondPaginatedBookingRecapReturned)
    await renderBookingsRecap(props, store)

    // When
    userEvent.selectOptions(screen.getByLabelText('Lieu'), venue.id)
    await fireEvent.click(screen.getByRole('button', { name: 'Afficher' }))

    // Then
    const secondBookingRecap = await screen.findAllByText(bookings2.stock.offer_name)
    expect(secondBookingRecap).toHaveLength(2)
    const firstBookingRecap = screen.getAllByText(bookings1.stock.offer_name)
    expect(firstBookingRecap).toHaveLength(2)

    expect(loadFilteredBookingsRecap).toHaveBeenCalledTimes(2)
    expect(getNthCallNthArg(loadFilteredBookingsRecap, 1).page).toBe(1)
    expect(getNthCallNthArg(loadFilteredBookingsRecap, 1).venueId).toBe(venue.id)
    expect(getNthCallNthArg(loadFilteredBookingsRecap, 2).page).toBe(2)
    expect(getNthCallNthArg(loadFilteredBookingsRecap, 2).venueId).toBe(venue.id)
  })

  it('should request bookings of event date requested by user when user clicks on "Afficher"', async () => {
    // Given
    let bookingRecap = bookingRecapFactory()
    loadFilteredBookingsRecap.mockResolvedValue({
      page: 1,
      pages: 1,
      total: 1,
      bookings_recap: [bookingRecap],
    })
    await renderBookingsRecap(props, store)

    // When
    fireEvent.click(screen.getByLabelText('Date de l’évènement'))
    fireEvent.click(screen.getByText('8'))
    fireEvent.click(screen.getByRole('button', { name: 'Afficher' }))

    // Then
    await screen.findAllByText(bookingRecap.stock.offer_name)
    expect(getNthCallNthArg(loadFilteredBookingsRecap, 1).eventDate).toStrictEqual(
      new Date(2020, 5, 8)
    )
  })

  it('should request bookings of default period when user clicks on "Afficher" without selecting a period', async () => {
    // Given
    let bookingRecap = bookingRecapFactory()
    loadFilteredBookingsRecap.mockResolvedValue({
      page: 1,
      pages: 1,
      total: 1,
      bookings_recap: [bookingRecap],
    })
    await renderBookingsRecap(props, store)

    // When
    fireEvent.click(screen.getByRole('button', { name: 'Afficher' }))

    // Then
    await screen.findAllByText(bookingRecap.stock.offer_name)
    expect(getNthCallNthArg(loadFilteredBookingsRecap, 1).bookingPeriodBeginningDate).toStrictEqual(
      DEFAULT_PRE_FILTERS.bookingBeginningDate
    )
    expect(getNthCallNthArg(loadFilteredBookingsRecap, 1).bookingPeriodEndingDate).toStrictEqual(
      DEFAULT_PRE_FILTERS.bookingEndingDate
    )
  })

  it('should request bookings of selected period when user clicks on "Afficher"', async () => {
    // Given
    let bookingRecap = bookingRecapFactory()
    loadFilteredBookingsRecap.mockResolvedValue({
      page: 1,
      pages: 1,
      total: 1,
      bookings_recap: [bookingRecap],
    })
    await renderBookingsRecap(props, store)

    const bookingPeriodWrapper = screen.getByText('Période de réservation')
    const [beginningPeriodInput, endingPeriodInput] = within(
      bookingPeriodWrapper
    ).getAllByPlaceholderText('JJ/MM/AAAA')

    // When
    fireEvent.click(beginningPeriodInput)
    fireEvent.click(screen.getByText('10'))
    fireEvent.click(endingPeriodInput)
    fireEvent.click(screen.getAllByText('5')[0])
    fireEvent.click(screen.getByRole('button', { name: 'Afficher' }))

    // Then
    await screen.findAllByText(bookingRecap.stock.offer_name)
    expect(getNthCallNthArg(loadFilteredBookingsRecap, 1).bookingPeriodBeginningDate).toStrictEqual(
      new Date(2020, 4, 10)
    )
    expect(getNthCallNthArg(loadFilteredBookingsRecap, 1).bookingPeriodEndingDate).toStrictEqual(
      new Date(2020, 5, 5)
    )
  })

  it('should set default beginning period date when user empties it and clicks on "Afficher"', async () => {
    // Given
    let bookingRecap = bookingRecapFactory()
    loadFilteredBookingsRecap.mockResolvedValue({
      page: 1,
      pages: 1,
      total: 1,
      bookings_recap: [bookingRecap],
    })
    await renderBookingsRecap(props, store)

    const bookingPeriodWrapper = screen.getByText('Période de réservation')
    const [beginningPeriodInput, endingPeriodInput] = within(
      bookingPeriodWrapper
    ).getAllByPlaceholderText('JJ/MM/AAAA')
    fireEvent.click(endingPeriodInput)
    fireEvent.click(screen.getByText('12'))

    // When
    fireEvent.change(beginningPeriodInput, { target: { value: '' } })
    fireEvent.click(screen.getByRole('button', { name: 'Afficher' }))

    // Then
    await screen.findAllByText(bookingRecap.stock.offer_name)
    const thirtyDaysBeforeEndingDate = new Date(2020, 4, 13)
    expect(getNthCallNthArg(loadFilteredBookingsRecap, 1).bookingPeriodBeginningDate).toStrictEqual(
      thirtyDaysBeforeEndingDate
    )
  })

  it('should set default ending period date when user empties it and clicks on "Afficher"', async () => {
    // Given
    let bookingRecap = bookingRecapFactory()
    loadFilteredBookingsRecap.mockResolvedValue({
      page: 1,
      pages: 1,
      total: 1,
      bookings_recap: [bookingRecap],
    })
    await renderBookingsRecap(props, store)

    const bookingPeriodWrapper = screen.getByText('Période de réservation')
    const [beginningPeriodInput, endingPeriodInput] = within(
      bookingPeriodWrapper
    ).getAllByPlaceholderText('JJ/MM/AAAA')
    fireEvent.click(beginningPeriodInput)
    fireEvent.click(screen.getByText('10'))

    // When
    fireEvent.change(endingPeriodInput, { target: { value: '' } })
    fireEvent.click(screen.getByRole('button', { name: 'Afficher' }))

    // Then
    await screen.findAllByText(bookingRecap.stock.offer_name)
    const thirtyDaysAfterBeginningDate = new Date(2020, 5, 9)
    expect(getNthCallNthArg(loadFilteredBookingsRecap, 1).bookingPeriodEndingDate).toStrictEqual(
      thirtyDaysAfterBeginningDate
    )
  })

  it('should not be possible to select ending period date greater than today', async () => {
    // Given
    let bookingRecap = bookingRecapFactory()
    loadFilteredBookingsRecap.mockResolvedValue({
      page: 1,
      pages: 1,
      total: 1,
      bookings_recap: [bookingRecap],
    })
    await renderBookingsRecap(props, store)

    const bookingPeriodWrapper = screen.getByText('Période de réservation')
    const endingPeriodInput = within(bookingPeriodWrapper).getAllByPlaceholderText('JJ/MM/AAAA')[1]

    // When
    fireEvent.click(endingPeriodInput)
    fireEvent.click(screen.getByText('16'))
    fireEvent.click(screen.getByRole('button', { name: 'Afficher' }))

    // Then
    await screen.findAllByText(bookingRecap.stock.offer_name)
    expect(getNthCallNthArg(loadFilteredBookingsRecap, 1).bookingPeriodEndingDate).toStrictEqual(
      DEFAULT_PRE_FILTERS.bookingEndingDate
    )
  })

  it('should reset bookings recap list when applying filters', async () => {
    // Given
    const booking = bookingRecapFactory()
    const otherVenueBooking = bookingRecapFactory()
    const otherVenue = venueFactory()
    getVenuesForOfferer.mockResolvedValue([venue, otherVenue])
    const paginatedBookingRecapReturned = {
      page: 1,
      pages: 1,
      total: 1,
      bookings_recap: [booking],
    }
    const otherVenuePaginatedBookingRecapReturned = {
      page: 1,
      pages: 1,
      total: 1,
      bookings_recap: [otherVenueBooking],
    }
    loadFilteredBookingsRecap
      .mockResolvedValueOnce(otherVenuePaginatedBookingRecapReturned)
      .mockResolvedValueOnce(paginatedBookingRecapReturned)
    await renderBookingsRecap(props, store)

    userEvent.selectOptions(screen.getByLabelText('Lieu'), otherVenue.id)
    fireEvent.click(screen.getByRole('button', { name: 'Afficher' }))
    await screen.findAllByText(otherVenueBooking.stock.offer_name)

    // When
    userEvent.selectOptions(screen.getByLabelText('Lieu'), venue.id)
    await fireEvent.click(screen.getByRole('button', { name: 'Afficher' }))

    // Then
    const firstBookingRecap = await screen.findAllByText(booking.stock.offer_name)
    expect(firstBookingRecap).toHaveLength(2)
    expect(screen.queryByText(otherVenueBooking.stock.offer_name)).not.toBeInTheDocument()
  })

  it('should show notification with information message when there are more than 5 pages', async () => {
    // Given
    const bookingsRecap = { pages: 6, bookings_recap: [] }
    loadFilteredBookingsRecap
      .mockResolvedValueOnce({ ...bookingsRecap, page: 1 })
      .mockResolvedValueOnce({ ...bookingsRecap, page: 2 })
      .mockResolvedValueOnce({ ...bookingsRecap, page: 3 })
      .mockResolvedValueOnce({ ...bookingsRecap, page: 4 })
      .mockResolvedValueOnce({ ...bookingsRecap, page: 5 })
      .mockResolvedValueOnce({ ...bookingsRecap, page: 6 })
    await renderBookingsRecap(props, store)

    // when
    userEvent.selectOptions(screen.getByLabelText('Lieu'), venue.id)
    await userEvent.click(screen.getByText('Afficher', { selector: 'button' }))

    // Then
    const informationalMessage = await screen.findByText(
      'L’affichage des réservations a été limité à 5 000 réservations. Vous pouvez modifier les filtres pour affiner votre recherche.'
    )
    expect(informationalMessage).toBeInTheDocument()
    expect(loadFilteredBookingsRecap).toHaveBeenCalledTimes(5)
  })

  it('should not show notification with information message when there are 5 pages or less', async () => {
    // Given
    const bookingsRecap = { pages: 5, bookings_recap: [] }
    loadFilteredBookingsRecap
      .mockResolvedValueOnce({ ...bookingsRecap, page: 1 })
      .mockResolvedValueOnce({ ...bookingsRecap, page: 2 })
      .mockResolvedValueOnce({ ...bookingsRecap, page: 3 })
      .mockResolvedValueOnce({ ...bookingsRecap, page: 4 })
      .mockResolvedValueOnce({ ...bookingsRecap, page: 5 })
    await renderBookingsRecap(props, store)

    // when
    userEvent.selectOptions(screen.getByLabelText('Lieu'), venue.id)
    await userEvent.click(screen.getByText('Afficher', { selector: 'button' }))

    // Then
    await waitFor(() => expect(loadFilteredBookingsRecap).toHaveBeenCalledTimes(5))
    const informationalMessage = screen.queryByText(
      'L’affichage des réservations a été limité à 5 000 réservations. Vous pouvez modifier les filtres pour affiner votre recherche.'
    )
    expect(informationalMessage).not.toBeInTheDocument()
  })

  it('should inform the user that the filters have been modified when at least one of them was and before clicking on the "Afficher" button', async () => {
    // Given
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: '/reservations', state: undefined }]}>
          <BookingsRecapContainer {...props} />
          <NotificationContainer />
        </MemoryRouter>
      </Provider>
    )
    userEvent.click(screen.getByRole('button', { name: 'Afficher' }))

    // When
    userEvent.selectOptions(
      screen.getByLabelText('Lieu'),
      await screen.findByText(venue.publicName)
    )

    // Then
    const informationalMessage = screen.getByText(
      'Vos filtres ont été modifiés. Veuillez cliquer sur « Afficher » pour actualiser votre recherche.'
    )
    expect(informationalMessage).toBeInTheDocument()
  })

  it('should not inform the user when the selected filter is the same than the actual filter', async () => {
    // Given
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: '/reservations', state: undefined }]}>
          <BookingsRecapContainer {...props} />
          <NotificationContainer />
        </MemoryRouter>
      </Provider>
    )
    userEvent.selectOptions(
      screen.getByLabelText('Lieu'),
      await screen.findByText(venue.publicName)
    )

    // When
    userEvent.selectOptions(screen.getByLabelText('Lieu'), screen.getByText('Tous les lieux'))

    // Then
    const informationalMessage = screen.queryByText(
      'Vos filtres ont été modifiés. Veuillez cliquer sur « Afficher » pour actualiser votre recherche.'
    )
    expect(informationalMessage).not.toBeInTheDocument()
  })

  it('should not inform the user of pre-filter modifications before first click on "Afficher" button', async () => {
    // Given
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: '/reservations', state: undefined }]}>
          <BookingsRecapContainer {...props} />
          <NotificationContainer />
        </MemoryRouter>
      </Provider>
    )

    // When
    userEvent.selectOptions(
      screen.getByLabelText('Lieu'),
      await screen.findByText(venue.publicName)
    )

    // Then
    const informationalMessage = screen.queryByText(
      'Vos filtres ont été modifiés. Veuillez cliquer sur « Afficher » pour actualiser votre recherche.'
    )
    expect(informationalMessage).not.toBeInTheDocument()
  })
})
