import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { Route, MemoryRouter } from 'react-router'

import * as pcapi from 'repository/pcapi/pcapi'

import OfferDetailsContainer from '../OfferDetailsContainer'

const renderOffers = (props) => {
  return render(
    <MemoryRouter initialEntries={['/offres/v2/ABC12/edition']}>
      <Route path="/offres/v2/:offerId/edition">
        <OfferDetailsContainer {...props} />
      </Route>
    </MemoryRouter>
  )
}

jest.mock('repository/pcapi/pcapi', () => ({
  loadOffer: jest.fn(),
}))

describe('offerDetails - Edition', () => {
  const editedOffer = {
    id: 'ABC12',
    name: 'My edited offer'
  }

  beforeEach(() => {
    pcapi.loadOffer.mockResolvedValue(editedOffer)
  })

  describe('render when editing an existing offer', () => {
    it('should have title "Éditer une offre"', () => {
      // When
      renderOffers({})

      // Then
      const title = screen.getByRole("heading", { level: 1 })
      expect(title.textContent).toBe('Éditer une offre')
    })

    it('should have offer name as subtitle', () => {
      // When
      renderOffers({})

      // Then
      const title = screen.getByRole("heading", { level: 1 })
      expect(title.textContent).toBe('Éditer une offre')
    })
  })
})
