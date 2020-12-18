import '@testing-library/jest-dom'
import { act, render, screen } from '@testing-library/react'
import React from 'react'

import { App } from '../App'

const getCurrentUser = async () => Promise.resolve()

const renderApp = async props => {
  return await act(async () => {
    await render(
      <App {...props}>
        <p>
          {'Sub component'}
        </p>
      </App>
    )
  })
}

describe('src | App', () => {
  it('should render App and children components when isMaintenanceActivated is false', async () => {
    // Given
    const props = { modalOpen: false, isMaintenanceActivated: false, getCurrentUser }

    // When
    await renderApp(props)

    // Then
    expect(screen.getByText('Sub component')).toBeInTheDocument()
  })

  it('should render a Redirect component when isMaintenanceActivated is true', async () => {
    // Given
    const props = { modalOpen: false, isMaintenanceActivated: true, getCurrentUser }

    // When
    await renderApp(props)

    // Then
    expect(screen.queryByText('Sub component')).toBeNull()
  })
})
