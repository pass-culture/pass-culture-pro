import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

/* @debt implementation "Gaël : move this within a specific calendar / period selector test util" */
export const findCalendarWithinTestId = calendarWrapperTestId => {
  const calendarWrapper = screen.queryByTestId(calendarWrapperTestId)

  const getDayButton = day =>
    within(calendarWrapper).getByRole('button', {
      name: content => {
        return content.includes(day)
      },
    })

  const previousMonthButton = within(calendarWrapper).queryByLabelText('Previous Month')
  const nextMonthButton = within(calendarWrapper).queryByLabelText('Next Month')

  const expectDayButton = dayButton => {
    return {
      toBeEnabled: () => {
        expect(dayButton.getAttribute('aria-disabled')).toBe('false')
        expect(dayButton.getAttribute('aria-label')).toMatch(/^Choose/)
      },

      toBeDisabled: () => {
        expect(dayButton.getAttribute('aria-disabled')).toBe('true')
        expect(dayButton.getAttribute('aria-label')).toMatch(/^Not available/)
      },
    }
  }

  return {
    getDayButton,
    previousMonthButton,
    nextMonthButton,
    expectDayButton,
  }
}

export const noFilterMessage = () =>
  screen.queryByText(
    'Pour visualiser vos réservations, veuillez sélectionner un ou plusieurs des filtres précédents et cliquer sur « Afficher »'
  )

export const noResultMessage = () =>
  screen.queryByText('Aucune réservation trouvée pour votre recherche.')

export const filtersUtils = () => {
  const elements = {
    venueSelect: screen.queryByLabelText('Lieu'),
    eventDateInput: screen.queryByLabelText('Date de l’évènement'),
    periodStartInput: screen.queryByLabelText('début de la période'),
    periodEndInput: screen.queryByLabelText('fin de la période'),
    resetFilterBtn: screen.queryByRole('button', { name: 'Réinitialiser les filtres' }),
    displayResultsBtn: screen.queryByRole('button', { name: 'Afficher' }),
  }

  const getRequireUpdateMessage = () =>
    screen.queryByText(
      'Vos filtres ont été modifiés. Veuillez cliquer sur « Afficher » pour actualiser votre recherche.'
    )

  const expectFiltersValuesToBe = ({
    venueSelect,
    eventDateInput,
    periodStartInput,
    periodEndInput,
  }) => {
    expect(elements.venueSelect.value).toStrictEqual(venueSelect)
    expect(elements.eventDateInput.value).toStrictEqual(eventDateInput)
    expect(elements.periodStartInput.value).toStrictEqual(periodStartInput)
    expect(elements.periodEndInput.value).toStrictEqual(periodEndInput)
  }

  const setFilters = ({
    venueSelect = null,
    eventDateInput = null,
    periodStartInput = null,
    periodEndInput = null,
  }) => {
    if (venueSelect) {
      userEvent.selectOptions(elements.venueSelect, venueSelect)
    }

    if (eventDateInput) {
      userEvent.clear(elements.eventDateInput)
      userEvent.paste(elements.eventDateInput, eventDateInput)
    }

    if (periodStartInput) {
      userEvent.clear(elements.periodStartInput)
      userEvent.paste(elements.periodStartInput, periodStartInput)
    }

    if (periodEndInput) {
      userEvent.clear(elements.periodEndInput)
      userEvent.paste(elements.periodEndInput, periodEndInput)
    }
  }

  return {
    elements,
    expectFiltersValuesToBe,
    getRequireUpdateMessage,
    setFilters,
  }
}

export const clickOnDisplayButton = () => {
  userEvent.click(screen.getByRole('button', { name: 'Afficher' }))
}

export const tableUtils = () => {
  const waitForTable = async () => {
    clickOnDisplayButton()
    const table = await screen.findByRole('table')
    const rows = within(table).queryAllByRole('row')

    const tableBodyRows = [...rows]
    tableBodyRows.shift()

    const getCellIndexByName = name =>
      ['offerName', 'isDuo', 'beneficiary', 'bookingDate', 'bookingToken', 'status'].indexOf(name)

    const getRow = rowIndex => {
      const table = screen.getByRole('table')
      const rows = within(table).queryAllByRole('row')

      rows.shift()
      const currentRow = rows[rowIndex]

      currentRow.getCell = cellName => {
        const cellIndex = getCellIndexByName(cellName)

        if (cellIndex !== -1) {
          return within(currentRow).getAllByRole('cell')[cellIndex]
        }
      }

      return currentRow
    }

    const getRows = () => {
      const rows = within(table).queryAllByRole('row')
      const tableBodyRows = [...rows]
      tableBodyRows.shift()

      return tableBodyRows
    }

    const getHeadCell = cellName =>
      within(rows[0]).getAllByRole('columnheader')[getCellIndexByName(cellName)]

    return {
      tableHead: rows[0],
      getHeadCell,
      tableBodyRows,
      getRow,
      getRows,
    }
  }

  const selectFirstRowCell = async cellName => {
    const { getRow } = await waitForTable()
    return getRow(0).getCell(cellName)
  }

  return {
    waitForTable,
    selectFirstRowCell,
  }
}

export const waitForTableAndOpenStatusesFilters = async () => {
  const { getHeadCell, getRows, getRow } = await tableUtils().waitForTable()
  const statusHeadCell = getHeadCell('status')
  const statusFilterButton = within(statusHeadCell).getByRole('button', { name: /^Statut/ })
  userEvent.click(statusFilterButton)

  return {
    statusHeadCell,
    getRows,
    getRow,
    statusFilterButton,
  }
}
