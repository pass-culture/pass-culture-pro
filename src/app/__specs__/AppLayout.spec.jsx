import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'

import { PortalRenderer } from 'app/PortalProvider'
import { getStubStore } from 'utils/stubStore'

import AppLayout from '../AppLayout'

describe('src | app | AppLayout', () => {
  let portalContent

  it('should render PortalRenderer content', async () => {
    // when
    const store = getStubStore({
      data: (state = { users: [{}], offerers: [] }) => state,
      modal: (
        state = {
          config: {},
        }
      ) => state,
    })
    const { unmount } = render(
      <Provider store={store}>
        <MemoryRouter>
          <AppLayout layoutConfig={{}}>
            <PortalRenderer>
              <div data-testid="portal-renderer-content" />
            </PortalRenderer>
          </AppLayout>
        </MemoryRouter>
      </Provider>,
      { container: document.body }
    )
    await waitFor(() => (portalContent = screen.getByTestId('portal-renderer-content')))

    // then
    expect(document.body.contains(portalContent)).toBe(true)
    unmount()
    expect(document.body.contains(portalContent)).toBe(false)
  })
})
