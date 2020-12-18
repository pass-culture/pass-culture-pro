import '@testing-library/jest-dom'
import { fireEvent } from '@testing-library/dom'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route } from 'react-router'

import { getProviderInfo } from 'components/pages/Offer/LocalProviderInformation/getProviderInfo'
import * as pcapi from 'repository/pcapi/pcapi'
import { configureTestStore } from 'store/testUtils'

import OfferDetailsContainer from '../OfferDetailsContainer'

import { fieldLabels, getInputErrorForField, setOfferValues } from './helpers'

jest.mock('repository/pcapi/pcapi', () => ({
  updateOffer: jest.fn(),
  getValidatedOfferers: jest.fn(),
  getVenuesForOfferer: jest.fn(),
  loadOffer: jest.fn(),
  loadTypes: jest.fn(),
}))

const renderOffers = (props, store, queryParams = '') => {
  return render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: '/offres/v2/ABC12/edition', search: queryParams }]}
      >
        <Route
          exact
          path="/offres/v2/:offerId/edition"
        >
          <OfferDetailsContainer {...props} />
        </Route>
      </MemoryRouter>
    </Provider>
  )
}

describe('offerDetails - Edition', () => {
  let editedOffer
  let offerers
  let store
  let types
  let venues

  beforeEach(() => {
    store = configureTestStore({ data: { users: [{ publicName: 'François', isAdmin: false }] } })

    types = [
      {
        conditionalFields: [],
        offlineOnly: false,
        onlineOnly: true,
        proLabel: 'Presse en ligne - abonnements',
        type: 'Thing',
        value: 'ThingType.PRESSE_ABO',
      },
      {
        conditionalFields: ['author', 'isbn'],
        offlineOnly: false,
        onlineOnly: false,
        proLabel: 'Livres papier ou numérique, abonnements lecture',
        type: 'Thing',
        value: 'ThingType.LIVRE_EDITION',
      },
    ]
    offerers = [
      {
        id: 'BA',
        name: 'La structure',
      },
    ]
    venues = [
      {
        id: 'AB',
        isVirtual: false,
        managingOffererId: offerers[0].id,
        name: 'Le lieu',
        offererName: 'La structure',
      },
    ]
    editedOffer = {
      id: 'ABC12',
      name: 'My edited offer',
    }
    pcapi.loadOffer.mockResolvedValue(editedOffer)
    pcapi.loadTypes.mockResolvedValue(types)
    pcapi.getValidatedOfferers.mockResolvedValue(offerers)
    pcapi.getVenuesForOfferer.mockResolvedValue(venues)
  })

  describe('render when editing an existing offer', () => {
    it('should have title "Éditer une offre"', async () => {
      // When
      renderOffers({}, store)

      // Then
      const title = await screen.findByText('Éditer une offre', { selector: 'h1' })
      expect(title).toBeInTheDocument()
    })

    it("should have a preview link redirecting to the webapp's offer page", async () => {
      // When
      renderOffers({}, store)

      // Then
      const previewLink = await screen.findByText('Prévisualiser', { selector: 'a' })
      expect(previewLink).toBeInTheDocument()
      const expectedWebappUri = `offre/details/${editedOffer.id}`
      expect(previewLink).toHaveAttribute('href', expect.stringContaining(expectedWebappUri))
    })

    it("should have a preview link redirecting to the webapp's offer page with mediationId as parameter when an active mediation exists", async () => {
      // Given
      editedOffer.activeMediation = { id: 'CBA' }

      // When
      renderOffers({}, store)

      // Then
      const previewLink = await screen.findByText('Prévisualiser', { selector: 'a' })
      expect(previewLink).toBeInTheDocument()
      const expectedWebappUri = `offre/details/${editedOffer.id}/${editedOffer.activeMediation.id}`
      expect(previewLink).toHaveAttribute('href', expect.stringContaining(expectedWebappUri))
    })

    it('should have offer title input', async () => {
      // When
      renderOffers({}, store)

      // Then
      const titleInput = await screen.findByLabelText("Titre de l'offre")
      expect(titleInput).toBeInTheDocument()
    })

    it('should change title with typed value', async () => {
      // Given
      renderOffers({}, store)
      const titleInput = await screen.findByLabelText("Titre de l'offre")

      // When
      fireEvent.change(titleInput, { target: { value: 'Mon nouveau titre' } })

      // Then
      const newTitleValue = await screen.findByDisplayValue('Mon nouveau titre')
      expect(newTitleValue).toBeInTheDocument()
    })

    it('should allow edition of editable fields only', async () => {
      // Given
      venues[0].isVirtual = true
      const editedOffer = {
        id: 'ABC12',
        name: 'My edited offer',
        type: 'EventType.FULL_CONDITIONAL_FIELDS',
        musicType: 501,
        musicSubType: 502,
        description: 'Offer description',
        venue: venues[0],
        venueId: venues[0].id,
        withdrawalDetails: 'Offer withdrawal details',
        author: 'Mr Offer Author',
        performer: 'Mr Offer Performer',
        bookingEmail: 'booking@email.net',
      }
      pcapi.loadOffer.mockResolvedValue(editedOffer)
      types.push({
        conditionalFields: [
          'author',
          'musicType',
          'performer',
          'isbn',
          'stageDirector',
          'speaker',
          'visa',
        ],
        offlineOnly: false,
        onlineOnly: false,
        proLabel: 'Musique - concerts, festivals',
        type: 'Event',
        value: 'EventType.FULL_CONDITIONAL_FIELDS',
      })
      pcapi.loadTypes.mockResolvedValue(types)

      renderOffers({}, store)

      // Edition read only fields
      const typeInput = await screen.findByLabelText(fieldLabels.type.label, {
        exact: fieldLabels.type.exact,
      })
      expect(typeInput).toHaveAttribute('disabled')
      const musicSubTypeInput = await screen.findByLabelText(fieldLabels.musicSubType.label, {
        exact: fieldLabels.musicSubType.exact,
      })
      expect(musicSubTypeInput).toHaveAttribute('disabled')
      const musicTypeInput = await screen.findByLabelText(fieldLabels.musicType.label, {
        exact: fieldLabels.musicType.exact,
      })
      expect(musicTypeInput).toHaveAttribute('disabled')
      const offererIdInput = await screen.findByLabelText(fieldLabels.offererId.label, {
        exact: fieldLabels.offererId.exact,
      })
      expect(offererIdInput).toHaveAttribute('disabled')

      // Editable fields
      const authorInput = await screen.findByLabelText(fieldLabels.author.label, {
        exact: fieldLabels.author.exact,
      })
      expect(authorInput).not.toHaveAttribute('disabled')
      const bookingEmailInput = await screen.findByLabelText(fieldLabels.bookingEmail.label, {
        exact: fieldLabels.bookingEmail.exact,
      })
      expect(bookingEmailInput).not.toHaveAttribute('disabled')
      const descriptionInput = await screen.findByLabelText(fieldLabels.description.label, {
        exact: fieldLabels.description.exact,
      })
      expect(descriptionInput).not.toHaveAttribute('disabled')
      const durationMinutesInput = await screen.findByLabelText(fieldLabels.durationMinutes.label, {
        exact: fieldLabels.durationMinutes.exact,
      })
      expect(durationMinutesInput).not.toHaveAttribute('disabled')
      const isbnInput = await screen.findByLabelText(fieldLabels.isbn.label, {
        exact: fieldLabels.isbn.exact,
      })
      expect(isbnInput).not.toHaveAttribute('disabled')
      const isDuoInput = await screen.findByLabelText(fieldLabels.isDuo.label, {
        exact: fieldLabels.isDuo.exact,
      })
      expect(isDuoInput).not.toHaveAttribute('disabled')
      const nameInput = await screen.findByLabelText(fieldLabels.name.label, {
        exact: fieldLabels.name.exact,
      })
      expect(nameInput).not.toHaveAttribute('disabled')
      const performerInput = await screen.findByLabelText(fieldLabels.performer.label, {
        exact: fieldLabels.performer.exact,
      })
      expect(performerInput).not.toHaveAttribute('disabled')
      const stageDirectorInput = await screen.findByLabelText(fieldLabels.stageDirector.label, {
        exact: fieldLabels.stageDirector.exact,
      })
      expect(stageDirectorInput).not.toHaveAttribute('disabled')
      const speakerInput = await screen.findByLabelText(fieldLabels.speaker.label, {
        exact: fieldLabels.speaker.exact,
      })
      expect(speakerInput).not.toHaveAttribute('disabled')
      const urlInput = await screen.findByLabelText(fieldLabels.url.label, {
        exact: fieldLabels.url.exact,
      })
      expect(urlInput).not.toHaveAttribute('disabled')
      const venueIdInput = await screen.findByLabelText(fieldLabels.venueId.label, {
        exact: fieldLabels.venueId.exact,
      })
      expect(venueIdInput).not.toHaveAttribute('disabled')
      const visaInput = await screen.findByLabelText(fieldLabels.visa.label, {
        exact: fieldLabels.visa.exact,
      })
      expect(visaInput).not.toHaveAttribute('disabled')
      const withdrawalDetailsInput = await screen.findByLabelText(
        fieldLabels.withdrawalDetails.label,
        { exact: fieldLabels.withdrawalDetails.exact }
      )
      expect(withdrawalDetailsInput).not.toHaveAttribute('disabled')
    })

    describe('for synchronized offers', () => {
      it('should show a banner stating the synchronization and the provider', async () => {
        // Given
        const editedOffer = {
          id: 'ABC12',
          name: 'My synchronized offer',
          type: 'ThingType.LIVRE_EDITION',
          showType: 400,
          showSubType: 401,
          description: 'Offer description',
          venue: venues[0],
          venueId: venues[0].id,
          withdrawalDetails: 'Offer withdrawal details',
          author: 'Mr Offer Author',
          performer: 'Mr Offer Performer',
          bookingEmail: 'booking@email.net',
          lastProvider: {
            name: 'leslibraires.fr',
          },
        }
        pcapi.loadOffer.mockResolvedValue(editedOffer)
        const providerInformation = getProviderInfo(editedOffer.lastProvider.name)

        // When
        renderOffers({}, store)

        // Then
        const providerBanner = await screen.findByText(
          `Offre synchronisée avec ${providerInformation.name}`
        )
        expect(providerBanner).toBeInTheDocument()
        expect(
          screen.getByRole('img', { name: `Icône de ${providerInformation.name}` })
        ).toHaveAttribute('src', expect.stringContaining(providerInformation.icon))
      })

      it('should not allow any edition', async () => {
        // Given
        venues[0].isVirtual = true
        const editedOffer = {
          id: 'ABC12',
          name: 'My edited offer',
          type: 'EventType.FULL_CONDITIONAL_FIELDS',
          showType: 400,
          showSubType: 401,
          description: 'Offer description',
          venue: venues[0],
          venueId: venues[0].id,
          withdrawalDetails: 'Offer withdrawal details',
          author: 'Mr Offer Author',
          performer: 'Mr Offer Performer',
          bookingEmail: 'booking@email.net',
          lastProvider: {
            name: 'Leslibraires.fr',
          },
        }
        pcapi.loadOffer.mockResolvedValue(editedOffer)
        types.push({
          conditionalFields: [
            'author',
            'showType',
            'performer',
            'isbn',
            'stageDirector',
            'speaker',
            'visa',
          ],
          offlineOnly: false,
          onlineOnly: false,
          proLabel: 'Musique - concerts, festivals',
          type: 'Event',
          value: 'EventType.FULL_CONDITIONAL_FIELDS',
        })
        pcapi.loadTypes.mockResolvedValue(types)

        renderOffers({}, store)

        // Edition read only fields
        const typeInput = await screen.findByLabelText(fieldLabels.type.label, {
          exact: fieldLabels.type.exact,
        })
        expect(typeInput).toHaveAttribute('disabled')
        const showSubTypeInput = await screen.findByLabelText(fieldLabels.showSubType.label, {
          exact: fieldLabels.showSubType.exact,
        })
        expect(showSubTypeInput).toHaveAttribute('disabled')
        const showTypeInput = await screen.findByLabelText(fieldLabels.showType.label, {
          exact: fieldLabels.showType.exact,
        })
        expect(showTypeInput).toHaveAttribute('disabled')
        const offererIdInput = await screen.findByLabelText(fieldLabels.offererId.label, {
          exact: fieldLabels.offererId.exact,
        })
        expect(offererIdInput).toHaveAttribute('disabled')
        const authorInput = await screen.findByLabelText(fieldLabels.author.label, {
          exact: fieldLabels.author.exact,
        })
        expect(authorInput).toHaveAttribute('disabled')
        const bookingEmailInput = await screen.findByLabelText(fieldLabels.bookingEmail.label, {
          exact: fieldLabels.bookingEmail.exact,
        })
        expect(bookingEmailInput).toHaveAttribute('disabled')
        const descriptionInput = await screen.findByLabelText(fieldLabels.description.label, {
          exact: fieldLabels.description.exact,
        })
        expect(descriptionInput).toHaveAttribute('disabled')
        const durationMinutesInput = await screen.findByLabelText(
          fieldLabels.durationMinutes.label,
          {
            exact: fieldLabels.durationMinutes.exact,
          }
        )
        expect(durationMinutesInput).toHaveAttribute('disabled')
        const isbnInput = await screen.findByLabelText(fieldLabels.isbn.label, {
          exact: fieldLabels.isbn.exact,
        })
        expect(isbnInput).toHaveAttribute('disabled')
        const isDuoInput = await screen.findByLabelText(fieldLabels.isDuo.label, {
          exact: fieldLabels.isDuo.exact,
        })
        expect(isDuoInput).toHaveAttribute('disabled')
        const nameInput = await screen.findByLabelText(fieldLabels.name.label, {
          exact: fieldLabels.name.exact,
        })
        expect(nameInput).toHaveAttribute('disabled')
        const performerInput = await screen.findByLabelText(fieldLabels.performer.label, {
          exact: fieldLabels.performer.exact,
        })
        expect(performerInput).toHaveAttribute('disabled')
        const stageDirectorInput = await screen.findByLabelText(fieldLabels.stageDirector.label, {
          exact: fieldLabels.stageDirector.exact,
        })
        expect(stageDirectorInput).toHaveAttribute('disabled')
        const speakerInput = await screen.findByLabelText(fieldLabels.speaker.label, {
          exact: fieldLabels.speaker.exact,
        })
        expect(speakerInput).toHaveAttribute('disabled')
        const urlInput = await screen.findByLabelText(fieldLabels.url.label, {
          exact: fieldLabels.url.exact,
        })
        expect(urlInput).toHaveAttribute('disabled')
        const venueIdInput = await screen.findByLabelText(fieldLabels.venueId.label, {
          exact: fieldLabels.venueId.exact,
        })
        expect(venueIdInput).toHaveAttribute('disabled')
        const visaInput = await screen.findByLabelText(fieldLabels.visa.label, {
          exact: fieldLabels.visa.exact,
        })
        expect(visaInput).toHaveAttribute('disabled')
        const withdrawalDetailsInput = await screen.findByLabelText(
          fieldLabels.withdrawalDetails.label,
          { exact: fieldLabels.withdrawalDetails.exact }
        )
        expect(withdrawalDetailsInput).toHaveAttribute('disabled')
      })

      it('should allow edition of "isDuo" for "Allociné" offers', async () => {
        const editedOffer = {
          id: 'ABC12',
          name: 'My edited offer',
          type: 'EventType.FULL_CONDITIONAL_FIELDS',
          showType: 400,
          showSubType: 401,
          description: 'Offer description',
          venue: venues[0],
          venueId: venues[0].id,
          withdrawalDetails: 'Offer withdrawal details',
          author: 'Mr Offer Author',
          performer: 'Mr Offer Performer',
          bookingEmail: 'booking@email.net',
          lastProvider: {
            name: 'Allociné',
          },
        }
        pcapi.loadOffer.mockResolvedValue(editedOffer)
        types.push({
          conditionalFields: [
            'author',
            'showType',
            'performer',
            'isbn',
            'stageDirector',
            'speaker',
            'visa',
          ],
          offlineOnly: false,
          onlineOnly: false,
          proLabel: 'Musique - concerts, festivals',
          type: 'Event',
          value: 'EventType.FULL_CONDITIONAL_FIELDS',
        })
        pcapi.loadTypes.mockResolvedValue(types)

        renderOffers({}, store)

        // Edition read only fields
        const isDuoInput = await screen.findByLabelText(fieldLabels.isDuo.label, {
          exact: fieldLabels.isDuo.exact,
        })
        expect(isDuoInput).not.toHaveAttribute('disabled')
      })
    })
  })

  describe('when submitting form', () => {
    it('should remove notification email when remove the will to receive notifications', async () => {
      // Given
      const editedOffer = {
        id: 'ABC12',
        name: 'My edited offer',
        type: 'ThingType.PRESSE_ABO',
        description: 'Offer description',
        venueId: venues[0].id,
        withdrawalDetails: 'Offer withdrawal details',
        bookingEmail: 'booking@email.net',
      }
      pcapi.loadOffer.mockResolvedValue(editedOffer)
      renderOffers({}, store)
      await setOfferValues({ receiveNotificationEmails: false })

      // When
      fireEvent.click(screen.getByText('Enregistrer'))

      // Then
      const { id: offerId, ...offerValues } = editedOffer
      expect(pcapi.updateOffer).toHaveBeenCalledWith(offerId, {
        ...offerValues,
        bookingEmail: null,
      })
    })

    it('should show error for email notification input when asking to receive booking emails and no email was provided', async () => {
      // Given
      const editedOffer = {
        id: 'ABC12',
        name: 'My edited offer',
        type: 'ThingType.PRESSE_ABO',
        description: 'Offer description',
        venueId: venues[0].id,
        withdrawalDetails: 'Offer withdrawal details',
        bookingEmail: null,
      }
      pcapi.loadOffer.mockResolvedValue(editedOffer)
      renderOffers({}, store)
      await setOfferValues({ receiveNotificationEmails: true })

      // When
      fireEvent.click(screen.getByText('Enregistrer'))

      // Then
      const bookingEmailInput = await getInputErrorForField('bookingEmail')
      expect(bookingEmailInput).toHaveTextContent('Ce champ est obligatoire')
    })
  })
})
