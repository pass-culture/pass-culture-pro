import '@testing-library/jest-dom'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { DEFAULT_FILTERS } from 'constants/booking'

import { setDefaultProps, filtersUtils, findCalendarWithinTestId } from '../__tests-utils__'
import BookingsScreen from '../Bookings'

jest.mock('utils/date', () => ({
  ...jest.requireActual('utils/date'),
  getToday: jest.fn().mockReturnValue(new Date('2020-06-15T12:00:00Z')),
}))

const renderBookingsScreen = props => render(<BookingsScreen {...props} />)

describe('screen: Bookings / top filters', () => {
  let props

  beforeEach(() => {
    props = setDefaultProps()
  })

  it('initialy render filters with default values', async () => {
    renderBookingsScreen(props)
    const { elements, expectFiltersValuesToBe } = filtersUtils()

    expect(elements.venueSelect).toBeInTheDocument()
    expect(elements.eventDateInput).toBeInTheDocument()
    expect(elements.periodStartInput).toBeInTheDocument()
    expect(elements.periodEndInput).toBeInTheDocument()

    expectFiltersValuesToBe({
      venueSelect: DEFAULT_FILTERS.offerVenueId,
      eventDateInput: '',
      periodStartInput: '16/05/2020',
      periodEndInput: '15/06/2020',
    })

    expect(elements.displayResultsBtn).toBeInTheDocument()

    expect(elements.resetFilterBtn).toBeInTheDocument()
    expect(elements.resetFilterBtn).toBeDisabled()
  })

  it('should pre-select a venue filter option when locationVenuId is provided', () => {
    props = {
      ...props,
      locationVenueId: 'VENUE_1',
    }
    renderBookingsScreen(props)
    const { expectFiltersValuesToBe } = filtersUtils()

    expectFiltersValuesToBe({
      venueSelect: 'VENUE_1',
      eventDateInput: '',
      periodStartInput: '16/05/2020',
      periodEndInput: '15/06/2020',
    })
  })

  it('should display/hide a message indicating the filters changed and do not reflect current results', async () => {
    renderBookingsScreen(props)
    const { setFilters, elements } = filtersUtils()

    userEvent.click(elements.displayResultsBtn)

    setFilters({ venueSelect: 'VENUE_1' })

    await waitFor(() =>
      expect(
        screen.queryByText(
          'Vos filtres ont été modifiés. Veuillez cliquer sur « Afficher » pour actualiser votre recherche.'
        )
      ).toBeInTheDocument()
    )

    userEvent.click(elements.resetFilterBtn)

    await waitFor(() =>
      expect(
        screen.queryByText(
          'Vos filtres ont été modifiés. Veuillez cliquer sur « Afficher » pour actualiser votre recherche.'
        )
      ).not.toBeInTheDocument()
    )
  })

  it('should enable the "reset filters" button when any of the filters changed', async () => {
    renderBookingsScreen(props)
    const { expectFiltersValuesToBe, setFilters, elements } = filtersUtils()
    const initialFilterValues = {
      venueSelect: 'all',
      eventDateInput: '',
      periodStartInput: '16/05/2020',
      periodEndInput: '15/06/2020',
    }
    expectFiltersValuesToBe(initialFilterValues)
    expect(elements.resetFilterBtn).toBeDisabled()

    const changedFilterValues = {
      venueSelect: 'VENUE_1',
    }

    setFilters(changedFilterValues)

    await waitFor(() => expect(elements.resetFilterBtn).toBeEnabled())
    expectFiltersValuesToBe({ ...initialFilterValues, ...changedFilterValues })

    userEvent.click(elements.resetFilterBtn)

    await waitFor(() => expect(elements.venueSelect).toHaveValue(initialFilterValues.venueSelect))
    expectFiltersValuesToBe(initialFilterValues)
  })

  it('should load bookings using the rights filters params', async () => {
    renderBookingsScreen(props)
    const { elements } = filtersUtils()

    userEvent.click(elements.displayResultsBtn)

    await waitFor(() =>
      expect(props.getAllBookings).toHaveBeenCalledWith({
        bookingBeginningDate: new Date('2020-05-15T22:00:00.000Z'),
        bookingEndingDate: new Date('2020-06-14T22:00:00.000Z'),
        offerEventDate: DEFAULT_FILTERS.offerEventDate,
        offerVenueId: DEFAULT_FILTERS.offerVenueId,
      })
    )
  })

  it('should allow to select period ending date before today', async () => {
    renderBookingsScreen(props)
    const { elements } = filtersUtils()

    userEvent.click(elements.periodEndInput)
    const { getDayButton, expectDayButton } = findCalendarWithinTestId('period-filter-end-picker')

    const yesterdayEndingButton = getDayButton('June 14')
    expectDayButton(yesterdayEndingButton).toBeEnabled()
    await waitFor(() => userEvent.click(yesterdayEndingButton))
    expect(elements.periodEndInput.value).toBe('14/06/2020')
  })

  it('should not allow to select period ending date after today', async () => {
    renderBookingsScreen(props)
    const { elements } = filtersUtils()

    userEvent.click(elements.periodEndInput)
    const { getDayButton, expectDayButton } = findCalendarWithinTestId('period-filter-end-picker')

    const tomorrowEndingDate = getDayButton('June 16')
    expectDayButton(tomorrowEndingDate).toBeDisabled()
    await waitFor(() => userEvent.click(tomorrowEndingDate))

    expect(elements.periodEndInput.value).toBe('15/06/2020')
  })

  it('should not allow to select period ending date before selected beginning date', async () => {
    renderBookingsScreen(props)
    const { elements } = filtersUtils()
    const initialEndValue = '15/06/2020'

    userEvent.click(elements.periodEndInput)
    const { getDayButton, previousMonthButton, expectDayButton } = findCalendarWithinTestId(
      'period-filter-end-picker'
    )
    await waitFor(() => userEvent.click(previousMonthButton))

    const endDateBtn = await waitFor(() => getDayButton('May 15'))

    expectDayButton(endDateBtn).toBeDisabled()
    await waitFor(() => userEvent.click(endDateBtn))

    expect(elements.periodEndInput.value).not.toBe('15/05/2020')
    expect(elements.periodEndInput.value).toStrictEqual(initialEndValue)
  })

  it('should not allow to select period beginning date after ending date', async () => {
    renderBookingsScreen(props)
    const { elements } = filtersUtils()

    userEvent.click(elements.periodStartInput)
    const initialBegginingDateValue = '16/05/2020'

    const { getDayButton, expectDayButton, nextMonthButton } = findCalendarWithinTestId(
      'period-filter-begin-picker'
    )

    await waitFor(() => userEvent.click(nextMonthButton))
    const begginingDateBtn = getDayButton('June 17')
    await waitFor(() => userEvent.click(begginingDateBtn))

    expectDayButton(begginingDateBtn).toBeDisabled()
    expect(elements.periodStartInput.value).not.toBe('17/06/2020')
    expect(elements.periodStartInput.value).toStrictEqual(initialBegginingDateValue)
  })
})
