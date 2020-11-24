import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router'

import OfferDetailsContainer from '../OfferDetailsContainer'

const renderOffers = (props) => {
  return render(
    <MemoryRouter initialEntries={['/offres/v2/creation']}>
      <OfferDetailsContainer {...props} />
    </MemoryRouter>
  )
}

jest.mock('repository/pcapi/pcapi', () => ({
  ...jest.requireActual('repository/pcapi/pcapi'),
  loadTypes: jest.fn().mockResolvedValue([]),
}))

describe('offerDetails - Creation', () => {

  describe('render when creating a new offer', () => {
    it('should have title "Ajouter une offre"', () => {
      // When
      renderOffers({})

      // Then
      const title = screen.getByRole("heading", { level: 1 })
      expect(title.textContent).toBe('Ajouter une offre')
    })

  })
})
