import '@testing-library/jest-dom'

import { render, screen, within, waitFor } from '@testing-library/react'
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

  const waitForTableAndFillOmniSearch = async (option, searchTerm) => {
    const { getRow, getRows } = await waitForTable()

    const searchFieldSelect = screen.getByLabelText('Rechercher par')
    const searchFieldText = screen.getByLabelText('Terme à rechercher')

    userEvent.type(searchFieldText, searchTerm)
    userEvent.selectOptions(searchFieldSelect, option)

    return {
      getRow,
      getRows,
    }
  }

  return {
    ...utils,
    waitForTable,
    selectFirstRowCell,
    waitForTableAndFillOmniSearch,
  }
}

describe('screen: Bookings / omnisearch', () => {
  let props

  beforeEach(() => {
    props = setDefaultProps()
  })

  it('render the omnisearch fields when the table is present', async () => {
    const { waitForTable } = renderBookingsScreen(props)
    await waitForTable()

    const searchFieldSelect = screen.getByLabelText('Rechercher par')
    const getSearchFieldOption = name => within(searchFieldSelect).getByRole('option', { name })

    expect(screen.getByLabelText('Terme à rechercher')).toBeInTheDocument()
    expect(searchFieldSelect).toBeInTheDocument()
    expect(searchFieldSelect).toHaveValue('offerName')
    expect(within(searchFieldSelect).getAllByRole('option')).toHaveLength(4)

    expect(getSearchFieldOption('Offre')).toBeInTheDocument()
    expect(getSearchFieldOption('Bénéficiaire')).toBeInTheDocument()
    expect(getSearchFieldOption('ISBN')).toBeInTheDocument()
    expect(getSearchFieldOption('Contremarque')).toBeInTheDocument()
  })

  it('should match text field placeholder name with the search field option', async () => {
    const { waitForTable } = renderBookingsScreen(props)
    await waitForTable()

    const matchingOptionPlaceholders = {
      Offre: 'Rechercher par nom d’offre',
      Bénéficiaire: 'Rechercher par nom ou email',
      ISBN: 'Rechercher par ISBN',
      Contremarque: 'Rechercher par contremarque',
    }

    const searchFieldSelect = screen.getByLabelText('Rechercher par')
    const searchFieldText = screen.getByLabelText('Terme à rechercher')

    Object.keys(matchingOptionPlaceholders).forEach(searchFieldOption => {
      userEvent.selectOptions(searchFieldSelect, searchFieldOption)
      expect(searchFieldText.placeholder).toStrictEqual(
        matchingOptionPlaceholders[searchFieldOption]
      )
    })
  })

  it('should filter based on offer name', async () => {
    const bookings = ['aaaaa', 'bbbbb', 'aaaccc', 'ccc aaabbb'].map(name => ({ offer: { name } }))

    const { waitForTableAndFillOmniSearch } = renderBookingsScreen(props, bookings)
    const searchTerm = 'aaa'
    const { getRow, getRows } = await waitForTableAndFillOmniSearch('offerName', searchTerm)

    await waitFor(() => expect(getRows()).toHaveLength(3))

    getRows().forEach((_row, index) => {
      expect(getRow(index).getCell('offerName').textContent).toContain(searchTerm)
    })
  })

  it('should filter based on beneficiary', async () => {
    const bookings = [
      { lastname: 'jean' },
      { firstname: 'jean' },
      { email: 'jean@email.com' },
      {},
    ].map(beneficiary => ({ beneficiary }))

    const { waitForTableAndFillOmniSearch } = renderBookingsScreen(props, bookings)
    const searchTerm = 'jean'
    const { getRow, getRows } = await waitForTableAndFillOmniSearch('Bénéficiaire', searchTerm)

    await waitFor(() => expect(getRows()).toHaveLength(3))

    getRows().forEach((_row, index) => {
      expect(getRow(index).getCell('beneficiary').textContent).toContain(searchTerm)
    })
  })

  it('should filter based on token', async () => {
    const bookings = ['ABCDEFG', 'EABCDEF', 'DEFGHIJ'].map(token => ({ token }))

    const { waitForTableAndFillOmniSearch } = renderBookingsScreen(props, bookings)
    const searchTerm = 'ABC'
    const { getRow, getRows } = await waitForTableAndFillOmniSearch('Contremarque', searchTerm)

    await waitFor(() => expect(getRows()).toHaveLength(2))

    getRows().forEach((_row, index) => {
      expect(getRow(index).getCell('bookingToken').textContent).toContain(searchTerm)
    })
  })

  it('should filter based on ISBN', async () => {
    const bookings = [
      { isbn: '123456' },
      { isbn: null, name: '123456' },
      { isbn: '987451' },
    ].map(offer => ({ offer }))

    const { waitForTableAndFillOmniSearch } = renderBookingsScreen(props, bookings)
    const searchTerm = '123456'
    const { getRow, getRows } = await waitForTableAndFillOmniSearch('ISBN', searchTerm)

    await waitFor(() => expect(getRows()).toHaveLength(1))

    getRows().forEach((_row, index) => {
      expect(getRow(index).getCell('offerName').textContent).toContain(searchTerm)
    })
  })

  it('should display no results if no booking match filters', async () => {
    const bookings = [{}, {}, {}]
    const { waitForTableAndFillOmniSearch } = renderBookingsScreen(props, bookings)
    const searchTerm = 'NoMatchString'
    await waitForTableAndFillOmniSearch('offerName', searchTerm)

    await waitFor(() =>
      expect(
        screen.getByText('Aucune réservation trouvée pour votre recherche')
      ).toBeInTheDocument()
    )
  })
})
