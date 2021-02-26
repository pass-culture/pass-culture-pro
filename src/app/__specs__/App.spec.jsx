import '@testing-library/jest-dom'
import { act, render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router'

import { URL_FOR_MAINTENANCE } from 'utils/config'

import App from '../App'

jest.spyOn(window, 'scrollTo').mockImplementation()

const getCurrentUser = async () => Promise.resolve()
jest.mock('repository/pcapi/pcapi', () => ({
  getCurrentUser,
}))

const mockHistoryPush = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
  useLocation: () => ({
    pathname: '',
  }),
}))

const renderApp = async props => {
  return await act(async () => {
    await render(
      <MemoryRouter>
        <App {...props}>
          <p>
            {'Sub component'}
          </p>
        </App>
      </MemoryRouter>
    )
  })
}

describe('src | App', () => {
  it('should render App and children components when isMaintenanceActivated is false', async () => {
    // Given
    const props = {
      currentUser: {
        id: 'fake_user_id',
      },
      isMaintenanceActivated: false,
      getCurrentUser,
    }

    // When
    await renderApp(props)

    // Then
    expect(mockHistoryPush).not.toHaveBeenCalledWith(URL_FOR_MAINTENANCE)
    expect(screen.getByText('Sub component')).toBeInTheDocument()
  })

  it('should render a Redirect component when isMaintenanceActivated is true', async () => {
    // Given
    const props = {
      currentUser: {
        id: 'fake_user_id',
      },
      isMaintenanceActivated: true,
      getCurrentUser,
    }

    // When
    await renderApp(props)

    // Then
    expect(mockHistoryPush).toHaveBeenCalledWith(URL_FOR_MAINTENANCE)
  })
})
