import '@testing-library/jest-dom'
import { act, render, screen, within } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'

import * as pcapi from 'repository/pcapi/pcapi'
import { configureTestStore } from 'store/testUtils'

import HomepageContainer from '../../HomepageContainer'

jest.mock('repository/pcapi/pcapi', () => ({
  getOfferer: jest.fn(),
  getAllOfferersNames: jest.fn(),
  getVenueStats: jest.fn(),
}))

const renderHomePage = async () => {
  const store = configureTestStore({
    data: {
      users: [
        {
          id: 'fake_id',
          firstName: 'John',
          lastName: 'Do',
          email: 'john.do@dummy.xyz',
          phoneNumber: '01 00 00 00 00',
        },
      ],
    },
  })

  return await act(async () => {
    await render(
      <Provider store={store}>
        <MemoryRouter>
          <HomepageContainer />
        </MemoryRouter>
      </Provider>
    )
  })
}

describe('creationLinks', () => {
  let baseOfferers
  let baseOfferersNames
  let virtualVenue
  let physicalVenue
  let physicalVenueWithPublicName

  beforeEach(() => {
    virtualVenue = {
      id: 'test_venue_id_1',
      isVirtual: true,
      managingOffererId: 'GE',
      name: 'Le Sous-sol (Offre numérique)',
      offererName: 'Bar des amis',
      publicName: null,
      nOffers: 2,
    }

    physicalVenue = {
      id: 'test_venue_id_2',
      isVirtual: false,
      managingOffererId: 'GE',
      name: 'Le Sous-sol (Offre physique)',
      offererName: 'Bar des amis',
      publicName: null,
      nOffers: 2,
    }
    physicalVenueWithPublicName = {
      id: 'test_venue_id_3',
      isVirtual: false,
      managingOffererId: 'GE',
      name: 'Le deuxième Sous-sol (Offre physique)',
      offererName: 'Bar des amis',
      publicName: 'Le deuxième Sous-sol',
      nOffers: 2,
    }
    baseOfferers = [
      {
        address: 'LA COULÉE D’OR',
        city: 'Cayenne',
        name: 'Bar des amis',
        id: 'GE',
        postalCode: '97300',
        siren: '111111111',
        bic: 'test bic 01',
        iban: 'test iban 01',
        managedVenues: [virtualVenue, physicalVenue, physicalVenueWithPublicName],
      },
      {
        address: 'RUE DE NIEUPORT',
        city: 'Drancy',
        id: 'FQ',
        name: 'Club Dorothy',
        postalCode: '93700',
        siren: '222222222',
        bic: 'test bic 02',
        iban: 'test iban 02',
        managedVenues: [],
      },
    ]
    baseOfferersNames = baseOfferers.map(offerer => ({
      id: offerer.id,
      name: offerer.name,
    }))

    pcapi.getOfferer.mockResolvedValue(baseOfferers[0])
    pcapi.getAllOfferersNames.mockResolvedValue(baseOfferersNames)
    pcapi.getVenueStats.mockResolvedValue({
      activeBookingsQuantity: 4,
      activeOffersCount: 2,
      soldOutOffersCount: 3,
      validatedBookingsQuantity: 3,
    })
  })

  describe("when offerer doesn't have neither physical venue nor virtual offers", () => {
    it('should display add information link', async () => {
      // Given
      baseOfferers = [
        {
          ...baseOfferers[0],
          managedVenues: [
            {
              ...virtualVenue,
              nOffers: 0,
            },
          ],
        },
      ]
      pcapi.getOfferer.mockResolvedValue(baseOfferers[0])
      await renderHomePage()

      // Then
      expect(
        screen.getByText('Avant de créer votre première offre physique vous devez avoir un lieu')
      ).toBeInTheDocument()

      expect(
        screen.getByRole('link', {
          name: 'Créer un lieu',
        })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('link', {
          name: 'Créer une offre numérique',
        })
      ).toBeInTheDocument()
    })
  })

  describe('when offerer have physical venue but no virtual offers', () => {
    it('sould display both creation links without card container', async () => {
      // Given
      baseOfferers = [
        {
          ...baseOfferers[0],
          managedVenues: [
            physicalVenue,
            {
              ...virtualVenue,
              nOffers: 0,
            },
          ],
        },
      ]
      pcapi.getOfferer.mockResolvedValue(baseOfferers[0])
      await renderHomePage()

      // Then
      expect(
        screen.queryByText('Avant de créer votre première offre physique vous devez avoir un lieu')
      ).not.toBeInTheDocument()

      expect(
        screen.getByRole('link', {
          name: 'Créer une offre numérique',
        })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('link', {
          name: 'Ajouter un lieu',
        })
      ).toBeInTheDocument()
    })
  })

  describe("when offerer doesn't have physical venue but have virtual offers", () => {
    it('should only display "create venue" link without card container', async () => {
      // Given
      baseOfferers = [
        {
          ...baseOfferers[0],
          managedVenues: [virtualVenue],
        },
      ]
      pcapi.getOfferer.mockResolvedValue(baseOfferers[0])
      await renderHomePage()

      // Then
      expect(
        screen.queryByText('Avant de créer votre première offre physique vous devez avoir un lieu')
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('link', {
          name: 'Créer une offre numérique',
        })
      ).not.toBeInTheDocument()

      expect(
        screen.getByRole('link', {
          name: 'Créer un lieu',
        })
      ).toBeInTheDocument()
    })
  })

  describe('when offerer have physical venue and virtual offers', () => {
    it('should only display "create venue" link without card container', async () => {
      // Given
      baseOfferers = [
        {
          ...baseOfferers[0],
          managedVenues: [physicalVenue, virtualVenue],
        },
      ]
      pcapi.getOfferer.mockResolvedValue(baseOfferers[0])
      await renderHomePage()

      // Then
      expect(
        screen.queryByText('Avant de créer votre première offre physique vous devez avoir un lieu')
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('link', {
          name: 'Créer une offre numérique',
        })
      ).not.toBeInTheDocument()

      expect(
        screen.getByRole('link', {
          name: 'Ajouter un lieu',
        })
      ).toBeInTheDocument()
    })
  })

  describe('when user has no offerer', () => {
    beforeEach(async () => {
      pcapi.getAllOfferersNames.mockResolvedValue([])

      await renderHomePage()
    })

    it('should display offerer creation links', () => {
      expect(
        screen.getByText(
          'Votre précédente structure a été supprimée. Pour plus d’informations sur la suppression et vos données, veuillez contacter notre support.'
        )
      ).toBeInTheDocument()
      expect(
        screen.getByRole('link', { name: 'Ajouter une nouvelle structure' })
      ).toBeInTheDocument()

      const offererBanner = screen.getByTestId('offerers-creation-links-card')
      expect(
        within(offererBanner).getByRole('link', { name: 'Contacter le support' })
      ).toBeInTheDocument()
    })

    it('should not display venue creation links', () => {
      expect(
        screen.queryByText('Avant de créer votre première offre physique vous devez avoir un lieu')
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('link', {
          name: 'Créer une offre numérique',
        })
      ).not.toBeInTheDocument()

      expect(
        screen.queryByRole('link', {
          name: 'Ajouter un lieu',
        })
      ).not.toBeInTheDocument()
    })
  })
})
