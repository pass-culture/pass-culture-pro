import '@testing-library/jest-dom'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route } from 'react-router'

import NotificationV2Container from 'components/layout/NotificationV2/NotificationV2Container'
import { getProviderInfo } from 'components/pages/Offer/LocalProviderInformation/getProviderInfo'
import * as pcapi from 'repository/pcapi/pcapi'
import { configureTestStore } from 'store/testUtils'

import * as computeUrl from '../../../utils/computeOffersUrl'
import OfferLayoutContainer from '../../OfferLayoutContainer'
import { DEFAULT_FORM_VALUES } from '../OfferForm/_constants'

import { fieldLabels, findInputErrorForField, setOfferValues } from './helpers'

jest.mock('repository/pcapi/pcapi', () => ({
  updateOffer: jest.fn(),
  getValidatedOfferers: jest.fn(),
  getVenuesForOfferer: jest.fn(),
  getVenue: jest.fn(),
  loadOffer: jest.fn(),
  loadTypes: jest.fn(),
}))

jest.mock('../../../utils/computeOffersUrl', () => ({
  computeOffersUrl: jest.fn().mockReturnValue('/offres'),
}))

const renderOffers = async (props, store, queryParams = '') => {
  await act(async () => {
    await render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: '/offres/v2/ABC12/edition', search: queryParams }]}
        >
          <Route path="/offres/v2/:offerId([A-Z0-9]+)/">
            <>
              <OfferLayoutContainer {...props} />
              <NotificationV2Container />
            </>
          </Route>
        </MemoryRouter>
      </Provider>
    )
  })
}

describe('offerDetails - Edition', () => {
  let editedOffer
  let venueManagingOfferer
  let props
  let store
  let types
  let editedOfferVenue

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
    venueManagingOfferer = {
      id: 'BA',
      name: 'La structure',
    }

    editedOfferVenue = {
      id: 'AB',
      isVirtual: false,
      managingOfferer: venueManagingOfferer,
      managingOffererId: venueManagingOfferer.id,
      name: 'Le lieu',
      offererName: 'La structure',
    }

    editedOffer = {
      id: 'ABC12',
      name: 'My edited offer',
      type: 'ThingType.LIVRE_EDITION',
      venue: editedOfferVenue,
      thumbUrl: null,
      description: 'My edited description',
      withdrawalDetails: 'My edited withdrawal details',
    }
    props = {
      setShowThumbnailForm: jest.fn(),
    }
    pcapi.loadOffer.mockResolvedValue(editedOffer)
    pcapi.loadTypes.mockResolvedValue(types)
    pcapi.getVenue.mockReturnValue(Promise.resolve())
  })

  describe('render when editing an existing offer', () => {
    describe('when interacting with disability fields', () => {
      let audioDisabilityCompliantCheckbox
      let mentalDisabilityCompliantCheckbox
      let motorDisabilityCompliantCheckbox
      let visualDisabilityCompliantCheckbox
      let noDisabilityCompliantCheckbox

      describe('for offers without any disability compliance information', () => {
        beforeEach(async () => {
          const editedOffer = {
            id: 'ABC12',
            name: 'My edited offer',
            type: 'ThingType.LIVRE_EDITION',
            venue: editedOfferVenue,
            thumbUrl: null,
            audioDisabilityCompliant: null,
            mentalDisabilityCompliant: null,
            motorDisabilityCompliant: null,
            visualDisabilityCompliant: null,
          }
          pcapi.loadOffer.mockResolvedValue(editedOffer)

          // When
          await renderOffers(props, store)

          audioDisabilityCompliantCheckbox = screen.getByLabelText(
            fieldLabels.audioDisabilityCompliant.label,
            {
              exact: fieldLabels.audioDisabilityCompliant.exact,
            }
          )
          mentalDisabilityCompliantCheckbox = screen.getByLabelText(
            fieldLabels.mentalDisabilityCompliant.label,
            {
              exact: fieldLabels.mentalDisabilityCompliant.exact,
            }
          )
          motorDisabilityCompliantCheckbox = screen.getByLabelText(
            fieldLabels.motorDisabilityCompliant.label,
            {
              exact: fieldLabels.motorDisabilityCompliant.exact,
            }
          )
          visualDisabilityCompliantCheckbox = screen.getByLabelText(
            fieldLabels.visualDisabilityCompliant.label,
            {
              exact: fieldLabels.visualDisabilityCompliant.exact,
            }
          )
          noDisabilityCompliantCheckbox = screen.getByLabelText(
            fieldLabels.noDisabilityCompliant.label,
            {
              exact: fieldLabels.noDisabilityCompliant.exact,
            }
          )
        })

        it('should not have checked values', async () => {
          expect(audioDisabilityCompliantCheckbox).not.toBeChecked()
          expect(mentalDisabilityCompliantCheckbox).not.toBeChecked()
          expect(motorDisabilityCompliantCheckbox).not.toBeChecked()
          expect(visualDisabilityCompliantCheckbox).not.toBeChecked()
          expect(noDisabilityCompliantCheckbox).not.toBeChecked()
        })

        it('should display error when submitting empty values', async () => {
          // When
          userEvent.click(screen.getByText('Enregistrer'))

          // Then
          const errorNotification = await screen.findByText(
            'Une ou plusieurs erreurs sont présentes dans le formulaire'
          )
          expect(errorNotification).toBeInTheDocument()
          let accessibilityErrorNotification = await screen.findByText(
            "Vous devez cocher l'une des options ci-dessus"
          )
          expect(accessibilityErrorNotification).toBeInTheDocument()
          expect(pcapi.updateOffer).not.toHaveBeenCalled()

          // When
          const mentalDisabilityCompliantCheckbox = screen.getByLabelText(
            fieldLabels.mentalDisabilityCompliant.label,
            {
              exact: fieldLabels.mentalDisabilityCompliant.exact,
            }
          )
          userEvent.click(mentalDisabilityCompliantCheckbox)

          // Then
          accessibilityErrorNotification = await screen.queryByText(
            "Vous devez cocher l'une des options ci-dessus"
          )
          expect(accessibilityErrorNotification).toBeNull()
        })
      })

      describe('for offers with disability compliance information', () => {
        beforeEach(async () => {
          const editedOffer = {
            id: 'ABC12',
            name: 'My edited offer',
            type: 'ThingType.LIVRE_EDITION',
            venue: editedOfferVenue,
            thumbUrl: null,
            audioDisabilityCompliant: true,
            mentalDisabilityCompliant: true,
            motorDisabilityCompliant: true,
            visualDisabilityCompliant: true,
          }
          pcapi.loadOffer.mockResolvedValue(editedOffer)

          // When
          await renderOffers(props, store)

          audioDisabilityCompliantCheckbox = screen.getByLabelText(
            fieldLabels.audioDisabilityCompliant.label,
            {
              exact: fieldLabels.audioDisabilityCompliant.exact,
            }
          )
          mentalDisabilityCompliantCheckbox = screen.getByLabelText(
            fieldLabels.mentalDisabilityCompliant.label,
            {
              exact: fieldLabels.mentalDisabilityCompliant.exact,
            }
          )
          motorDisabilityCompliantCheckbox = screen.getByLabelText(
            fieldLabels.motorDisabilityCompliant.label,
            {
              exact: fieldLabels.motorDisabilityCompliant.exact,
            }
          )
          visualDisabilityCompliantCheckbox = screen.getByLabelText(
            fieldLabels.visualDisabilityCompliant.label,
            {
              exact: fieldLabels.visualDisabilityCompliant.exact,
            }
          )
          noDisabilityCompliantCheckbox = screen.getByLabelText(
            fieldLabels.noDisabilityCompliant.label,
            {
              exact: fieldLabels.noDisabilityCompliant.exact,
            }
          )
        })

        it('should initialize noDisabilityCompliant unchecked and others checked', async () => {
          expect(noDisabilityCompliantCheckbox).not.toBeChecked()
          expect(audioDisabilityCompliantCheckbox).toBeChecked()
          expect(mentalDisabilityCompliantCheckbox).toBeChecked()
          expect(motorDisabilityCompliantCheckbox).toBeChecked()
          expect(visualDisabilityCompliantCheckbox).toBeChecked()
        })

        it('should uncheck all when noDisabilityCompliant is checked', async () => {
          // When
          userEvent.click(noDisabilityCompliantCheckbox)

          // Then
          expect(noDisabilityCompliantCheckbox).toBeChecked()
          expect(audioDisabilityCompliantCheckbox).not.toBeChecked()
          expect(mentalDisabilityCompliantCheckbox).not.toBeChecked()
          expect(motorDisabilityCompliantCheckbox).not.toBeChecked()
          expect(visualDisabilityCompliantCheckbox).not.toBeChecked()
        })
      })

      describe('for offers with disability compliance information set to false', () => {
        beforeEach(async () => {
          const editedOffer = {
            id: 'ABC12',
            name: 'My edited offer',
            type: 'ThingType.LIVRE_EDITION',
            venue: editedOfferVenue,
            thumbUrl: null,
            audioDisabilityCompliant: false,
            mentalDisabilityCompliant: false,
            motorDisabilityCompliant: false,
            visualDisabilityCompliant: false,
          }
          pcapi.loadOffer.mockResolvedValue(editedOffer)

          await renderOffers(props, store)
          audioDisabilityCompliantCheckbox = screen.getByLabelText(
            fieldLabels.audioDisabilityCompliant.label,
            {
              exact: fieldLabels.audioDisabilityCompliant.exact,
            }
          )
          mentalDisabilityCompliantCheckbox = screen.getByLabelText(
            fieldLabels.mentalDisabilityCompliant.label,
            {
              exact: fieldLabels.mentalDisabilityCompliant.exact,
            }
          )
          motorDisabilityCompliantCheckbox = screen.getByLabelText(
            fieldLabels.motorDisabilityCompliant.label,
            {
              exact: fieldLabels.motorDisabilityCompliant.exact,
            }
          )
          visualDisabilityCompliantCheckbox = screen.getByLabelText(
            fieldLabels.visualDisabilityCompliant.label,
            {
              exact: fieldLabels.visualDisabilityCompliant.exact,
            }
          )
          noDisabilityCompliantCheckbox = screen.getByLabelText(
            fieldLabels.noDisabilityCompliant.label,
            {
              exact: fieldLabels.noDisabilityCompliant.exact,
            }
          )
        })

        it('should initialize noDisabilityCompliant checked and uncheck others', async () => {
          expect(noDisabilityCompliantCheckbox).toBeChecked()
          expect(audioDisabilityCompliantCheckbox).not.toBeChecked()
          expect(mentalDisabilityCompliantCheckbox).not.toBeChecked()
          expect(motorDisabilityCompliantCheckbox).not.toBeChecked()
          expect(visualDisabilityCompliantCheckbox).not.toBeChecked()
        })

        it('should uncheck noDisabilityCompliant when a disabilityCompliant is checked', async () => {
          // When
          userEvent.click(mentalDisabilityCompliantCheckbox)

          // Then
          expect(noDisabilityCompliantCheckbox).not.toBeChecked()
          expect(audioDisabilityCompliantCheckbox).not.toBeChecked()
          expect(mentalDisabilityCompliantCheckbox).toBeChecked()
          expect(motorDisabilityCompliantCheckbox).not.toBeChecked()
          expect(visualDisabilityCompliantCheckbox).not.toBeChecked()
        })

        it("shouldn't allow noDisabilityCompliant to be unchecked when it's the only one checked", async () => {
          // When
          userEvent.click(noDisabilityCompliantCheckbox)

          // Then
          expect(noDisabilityCompliantCheckbox).toBeChecked()
          expect(audioDisabilityCompliantCheckbox).not.toBeChecked()
          expect(mentalDisabilityCompliantCheckbox).not.toBeChecked()
          expect(motorDisabilityCompliantCheckbox).not.toBeChecked()
          expect(visualDisabilityCompliantCheckbox).not.toBeChecked()
        })
      })
    })

    describe('when thumbnail exists', () => {
      it('should display the actived image', async () => {
        // Given
        editedOffer.thumbUrl = 'http://example.net/active-image.png'

        // When
        await renderOffers({}, store)

        // Then
        const button = await screen.findByTitle('Modifier l’image', { selector: 'button' })
        const image = await screen.findByAltText('Image de l’offre')
        expect(button).toBeInTheDocument()
        expect(image).toHaveAttribute('src', 'http://example.net/active-image.png')
      })

      it('should close the modal when user is clicking on close button', async () => {
        // Given
        editedOffer.thumbUrl = 'http://example.net/active-image.png'
        await renderOffers({}, store)
        userEvent.click(await screen.findByTitle('Modifier l’image', { selector: 'button' }))

        // When
        userEvent.click(await screen.findByTitle('Fermer la modale', { selector: 'button' }))

        // Then
        expect(
          await screen.findByTitle('Modifier l’image', { selector: 'button' })
        ).toBeInTheDocument()
        expect(
          screen.queryByTitle('Fermer la modale', { selector: 'button' })
        ).not.toBeInTheDocument()
      })

      it("should have a preview link redirecting to the webapp's offer page", async () => {
        // When
        editedOffer.thumbUrl = 'http://example.net/active-image.png'
        await renderOffers({}, store)

        // Then
        const previewLink = await screen.findByText('Prévisualiser dans l’app', { selector: 'a' })
        expect(previewLink).toBeInTheDocument()
        const expectedWebappUri = `offre/details/${editedOffer.id}`
        expect(previewLink).toHaveAttribute('href', expect.stringContaining(expectedWebappUri))
      })

      it("should have a preview link redirecting to the webapp's offer page with mediationId as parameter when an active mediation exists", async () => {
        // Given
        editedOffer.thumbUrl = 'http://example.net/active-image.png'
        editedOffer.activeMediation = { id: 'CBA' }

        // When
        await renderOffers({}, store)

        // Then
        const previewLink = await screen.findByText('Prévisualiser dans l’app', { selector: 'a' })
        expect(previewLink).toBeInTheDocument()
        const expectedWebappUri = `offre/details/${editedOffer.id}/${editedOffer.activeMediation.id}`
        expect(previewLink).toHaveAttribute('href', expect.stringContaining(expectedWebappUri))
      })
    })

    describe('when thumbnail does not exist', () => {
      it('should display the placeholder', async () => {
        // When
        await renderOffers({}, store)

        // Then
        expect(screen.getByText('Ajouter une image', { selector: 'button' })).toBeInTheDocument()
        expect(
          screen.queryByText('Prévisualiser dans l’app', { selector: 'a' })
        ).not.toBeInTheDocument()
      })

      it('should open the modal when user clicks on the placeholder', async () => {
        // Given
        await renderOffers({}, store)

        // When
        userEvent.click(await screen.findByTitle('Ajouter une image', { selector: 'button' }))

        // Then
        expect(await screen.findByLabelText('Ajouter une image')).toBeInTheDocument()
      })
    })

    describe('offer preview', () => {
      it('should display title', async () => {
        // when
        await renderOffers({}, store)

        // then
        expect(await screen.getAllByText('My edited offer')).toHaveLength(2)
      })

      it('should display description', async () => {
        // when
        await renderOffers({}, store)

        // then
        expect(await screen.getAllByText('My edited description')).toHaveLength(2)
      })

      it('should display terms of withdrawal', async () => {
        // when
        await renderOffers({}, store)

        // then
        expect(await screen.getAllByText('My edited withdrawal details')).toHaveLength(2)
      })
    })

    it('should change title with typed value', async () => {
      // Given
      await renderOffers(props, store)
      const titleInput = await screen.findByLabelText("Titre de l'offre", { exact: false })
      userEvent.clear(titleInput)

      // When
      userEvent.type(titleInput, 'Mon nouveau titre')

      // Then
      const newTitleValue = await screen.findByDisplayValue('Mon nouveau titre')
      expect(newTitleValue).toBeInTheDocument()
    })

    // TODO (rlecellier): to fix, do not resolve
    it('should show existing offer details', async () => {
      // Given
      editedOfferVenue.isVirtual = true
      const editedOffer = {
        id: 'ABC12',
        bookingEmail: 'booking@example.net',
        description: 'Offer description',
        durationMinutes: 90,
        externalTicketOfficeUrl: 'http://example.fr',
        isDuo: true,
        audioDisabilityCompliant: true,
        mentalDisabilityCompliant: true,
        motorDisabilityCompliant: true,
        visualDisabilityCompliant: true,
        name: 'My edited offer',
        type: 'EventType.FULL_CONDITIONAL_FIELDS',
        url: 'http://example.net',
        venue: editedOfferVenue,
        venueId: editedOfferVenue.id,
        withdrawalDetails: 'Offer withdrawal details',
        extraData: {
          author: 'Mr Offer Author',
          isbn: '123456789123',
          musicType: '501',
          musicSubType: '502',
          performer: 'Mr Offer Performer',
          speaker: 'Mr Offer Speaker',
          stageDirector: 'Mr Offer Stage Director',
          visa: 'Courtesy of visa',
        },
      }
      pcapi.loadOffer.mockResolvedValue(editedOffer)
      const fullConditionalFieldsType = {
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
      }
      pcapi.loadTypes.mockResolvedValue([fullConditionalFieldsType])

      // When
      await renderOffers(props, store)

      // Then
      const typeInput = screen.getByLabelText(fieldLabels.type.label, {
        exact: fieldLabels.type.exact,
      })
      expect(typeInput).toHaveValue(fullConditionalFieldsType.value)
      // const musicSubTypeInput = screen.getByLabelText(fieldLabels.musicSubType.label, {
      //   exact: fieldLabels.musicSubType.exact,
      // })
      // expect(musicSubTypeInput).toHaveValue(editedOffer.musicSubType)
      // const musicTypeInput = screen.getByLabelText(fieldLabels.musicType.label, {
      //   exact: fieldLabels.musicType.exact,
      // })
      // expect(musicTypeInput).toHaveValue(editedOffer.musicType)
      // const offererIdInput = screen.getByLabelText(fieldLabels.offererId.label, {
      //   exact: fieldLabels.offererId.exact,
      // })
      // expect(offererIdInput).toHaveValue(editedOfferVenue.managingOffererId)
      // const venueIdInput = screen.getByLabelText(fieldLabels.venueId.label, {
      //   exact: fieldLabels.venueId.exact,
      // })
      // expect(venueIdInput).toHaveValue(editedOffer.venueId)

      // const authorInput = screen.getByLabelText(fieldLabels.author.label, {
      //   exact: fieldLabels.author.exact,
      // })
      // expect(authorInput).toHaveValue(editedOffer.author)
      // const bookingEmailInput = screen.getByLabelText(fieldLabels.bookingEmail.label, {
      //   exact: fieldLabels.bookingEmail.exact,
      // })
      // expect(bookingEmailInput).toHaveValue(editedOffer.bookingEmail)
      // const descriptionInput = screen.getByLabelText(fieldLabels.description.label, {
      //   exact: fieldLabels.description.exact,
      // })
      // expect(descriptionInput).toHaveValue(editedOffer.description)
      // const durationMinutesInput = screen.getByLabelText(fieldLabels.durationMinutes.label, {
      //   exact: fieldLabels.durationMinutes.exact,
      // })
      // expect(durationMinutesInput).toHaveValue('1:30')
      // const isbnInput = screen.getByLabelText(fieldLabels.isbn.label, {
      //   exact: fieldLabels.isbn.exact,
      // })
      // expect(isbnInput).toHaveValue(editedOffer.isbn)
      // const isDuoInput = screen.getByLabelText(fieldLabels.isDuo.label, {
      //   exact: fieldLabels.isDuo.exact,
      // })
      // expect(isDuoInput).toBeChecked()
      // const audioDisabilityCompliantInput = screen.getByLabelText(
      //   fieldLabels.audioDisabilityCompliant.label,
      //   {
      //     exact: fieldLabels.audioDisabilityCompliant.exact,
      //   }
      // )
      // expect(audioDisabilityCompliantInput).toBeChecked()
      // const mentalDisabilityCompliantInput = screen.getByLabelText(
      //   fieldLabels.mentalDisabilityCompliant.label,
      //   {
      //     exact: fieldLabels.mentalDisabilityCompliant.exact,
      //   }
      // )
      // expect(mentalDisabilityCompliantInput).toBeChecked()
      // const motorDisabilityCompliantInput = screen.getByLabelText(
      //   fieldLabels.motorDisabilityCompliant.label,
      //   {
      //     exact: fieldLabels.motorDisabilityCompliant.exact,
      //   }
      // )
      // expect(motorDisabilityCompliantInput).toBeChecked()
      // const visualDisabilityCompliantInput = screen.getByLabelText(
      //   fieldLabels.visualDisabilityCompliant.label,
      //   {
      //     exact: fieldLabels.visualDisabilityCompliant.exact,
      //   }
      // )
      // expect(visualDisabilityCompliantInput).toBeChecked()
      // const nameInput = screen.getByLabelText(fieldLabels.name.label, {
      //   exact: fieldLabels.name.exact,
      // })
      // expect(nameInput).toHaveValue(editedOffer.name)
      // const performerInput = screen.getByLabelText(fieldLabels.performer.label, {
      //   exact: fieldLabels.performer.exact,
      // })
      // expect(performerInput).toHaveValue(editedOffer.extraData.performer)
      // const stageDirectorInput = screen.getByLabelText(fieldLabels.stageDirector.label, {
      //   exact: fieldLabels.stageDirector.exact,
      // })
      // expect(stageDirectorInput).toHaveValue(editedOffer.extraData.stageDirector)
      // const speakerInput = screen.getByLabelText(fieldLabels.speaker.label, {
      //   exact: fieldLabels.speaker.exact,
      // })
      // expect(speakerInput).toHaveValue(editedOffer.extraData.speaker)
      // const externalTicketOfficeUrlInput = screen.getByLabelText(
      //   fieldLabels.externalTicketOfficeUrl.label,
      //   {
      //     exact: fieldLabels.externalTicketOfficeUrl.exact,
      //   }
      // )
      // expect(externalTicketOfficeUrlInput).toHaveValue(editedOffer.externalTicketOfficeUrl)
      // const urlInput = screen.getByLabelText(fieldLabels.url.label, {
      //   exact: fieldLabels.url.exact,
      // })
      // expect(urlInput).toHaveValue(editedOffer.url)
      // const visaInput = screen.getByLabelText(fieldLabels.visa.label, {
      //   exact: fieldLabels.visa.exact,
      // })
      // expect(visaInput).toHaveValue(editedOffer.extraData.visa)
      // const withdrawalDetailsInput = screen.getByLabelText(fieldLabels.withdrawalDetails.label, {
      //   exact: fieldLabels.withdrawalDetails.exact,
      // })
      // expect(withdrawalDetailsInput).toHaveValue(editedOffer.withdrawalDetails)
    })

    // TODO (rlecellier): to fix, do not resolve
    it('should allow edition of editable fields only', async () => {
      // Given
      editedOfferVenue.isVirtual = true
      const editedOffer = {
        id: 'ABC12',
        name: 'My edited offer',
        type: 'EventType.FULL_CONDITIONAL_FIELDS',
        description: 'Offer description',
        venue: editedOfferVenue,
        venueId: editedOfferVenue.id,
        withdrawalDetails: 'Offer withdrawal details',
        extraData: {
          author: 'Mr Offer Author',
          performer: 'Mr Offer Performer',
          musicType: '501',
          musicSubType: '502',
        },
        bookingEmail: 'booking@example.net',
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

      // When
      await renderOffers(props, store)

      // Then
      // Edition read only fields
      const typeInput = screen.getByLabelText(fieldLabels.type.label, {
        exact: fieldLabels.type.exact,
      })
      expect(typeInput).toBeDisabled()
      const musicSubTypeInput = screen.getByLabelText(fieldLabels.musicSubType.label, {
        exact: fieldLabels.musicSubType.exact,
      })
      expect(musicSubTypeInput).toBeDisabled()
      const musicTypeInput = screen.getByLabelText(fieldLabels.musicType.label, {
        exact: fieldLabels.musicType.exact,
      })
      expect(musicTypeInput).toBeDisabled()
      const offererIdInput = screen.getByLabelText(fieldLabels.offererId.label, {
        exact: fieldLabels.offererId.exact,
      })
      expect(offererIdInput).toBeDisabled()
      const venueIdInput = screen.getByLabelText(fieldLabels.venueId.label, {
        exact: fieldLabels.venueId.exact,
      })
      expect(venueIdInput).toBeDisabled()

      // Editable fields
      const authorInput = screen.getByLabelText(fieldLabels.author.label, {
        exact: fieldLabels.author.exact,
      })
      expect(authorInput).toBeEnabled()
      const bookingEmailInput = screen.getByLabelText(fieldLabels.bookingEmail.label, {
        exact: fieldLabels.bookingEmail.exact,
      })
      expect(bookingEmailInput).toBeEnabled()
      const descriptionInput = screen.getByLabelText(fieldLabels.description.label, {
        exact: fieldLabels.description.exact,
      })
      expect(descriptionInput).toBeEnabled()
      const durationMinutesInput = screen.getByLabelText(fieldLabels.durationMinutes.label, {
        exact: fieldLabels.durationMinutes.exact,
      })
      expect(durationMinutesInput).toBeEnabled()
      const isbnInput = screen.getByLabelText(fieldLabels.isbn.label, {
        exact: fieldLabels.isbn.exact,
      })
      expect(isbnInput).toBeEnabled()
      const isDuoInput = screen.getByLabelText(fieldLabels.isDuo.label, {
        exact: fieldLabels.isDuo.exact,
      })
      expect(isDuoInput).toBeEnabled()
      const nameInput = screen.getByLabelText(fieldLabels.name.label, {
        exact: fieldLabels.name.exact,
      })
      expect(nameInput).toBeEnabled()
      const performerInput = screen.getByLabelText(fieldLabels.performer.label, {
        exact: fieldLabels.performer.exact,
      })
      expect(performerInput).toBeEnabled()
      const stageDirectorInput = screen.getByLabelText(fieldLabels.stageDirector.label, {
        exact: fieldLabels.stageDirector.exact,
      })
      expect(stageDirectorInput).toBeEnabled()
      const speakerInput = screen.getByLabelText(fieldLabels.speaker.label, {
        exact: fieldLabels.speaker.exact,
      })
      expect(speakerInput).toBeEnabled()
      const externalTicketOfficeUrlInput = screen.getByLabelText(
        fieldLabels.externalTicketOfficeUrl.label,
        {
          exact: fieldLabels.externalTicketOfficeUrl.exact,
        }
      )
      expect(externalTicketOfficeUrlInput).toBeEnabled()
      const urlInput = screen.getByLabelText(fieldLabels.url.label, {
        exact: fieldLabels.url.exact,
      })
      expect(urlInput).toBeEnabled()
      const visaInput = screen.getByLabelText(fieldLabels.visa.label, {
        exact: fieldLabels.visa.exact,
      })
      expect(visaInput).toBeEnabled()
      const withdrawalDetailsInput = screen.getByLabelText(fieldLabels.withdrawalDetails.label, {
        exact: fieldLabels.withdrawalDetails.exact,
      })
      expect(withdrawalDetailsInput).toBeEnabled()
      const audioDisabilityCompliant = screen.getByLabelText(
        fieldLabels.audioDisabilityCompliant.label,
        {
          exact: fieldLabels.audioDisabilityCompliant.exact,
        }
      )
      expect(audioDisabilityCompliant).toBeEnabled()
      const mentalDisabilityCompliant = screen.getByLabelText(
        fieldLabels.mentalDisabilityCompliant.label,
        {
          exact: fieldLabels.mentalDisabilityCompliant.exact,
        }
      )
      expect(mentalDisabilityCompliant).toBeEnabled()
      const motorDisabilityCompliant = screen.getByLabelText(
        fieldLabels.motorDisabilityCompliant.label,
        {
          exact: fieldLabels.motorDisabilityCompliant.exact,
        }
      )
      expect(motorDisabilityCompliant).toBeEnabled()
      const visualDisabilityCompliant = screen.getByLabelText(
        fieldLabels.visualDisabilityCompliant.label,
        {
          exact: fieldLabels.visualDisabilityCompliant.exact,
        }
      )
      expect(visualDisabilityCompliant).toBeEnabled()
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
          venue: editedOfferVenue,
          venueId: editedOfferVenue.id,
          withdrawalDetails: 'Offer withdrawal details',
          author: 'Mr Offer Author',
          performer: 'Mr Offer Performer',
          bookingEmail: 'booking@example.net',
          lastProvider: {
            name: 'leslibraires.fr',
          },
        }
        pcapi.loadOffer.mockResolvedValue(editedOffer)
        const providerInformation = getProviderInfo(editedOffer.lastProvider.name)

        // When
        await renderOffers(props, store)

        // Then
        const providerBanner = await screen.findByText(
          `Offre synchronisée avec ${providerInformation.name}`
        )
        expect(providerBanner).toBeInTheDocument()
        expect(
          screen.getByRole('img', { name: `Icône de ${providerInformation.name}` })
        ).toHaveAttribute('src', expect.stringContaining(providerInformation.icon))
      })

      // TODO (rlecellier): to fix, do not resolve
      it('should allow edition of accessibility fields and external ticket office url', async () => {
        // Given
        editedOfferVenue.isVirtual = true
        const editedOffer = {
          id: 'ABC12',
          name: 'My edited offer',
          type: 'EventType.FULL_CONDITIONAL_FIELDS',
          showType: 400,
          showSubType: 401,
          description: 'Offer description',
          venue: editedOfferVenue,
          venueId: editedOfferVenue.id,
          withdrawalDetails: 'Offer withdrawal details',
          author: 'Mr Offer Author',
          performer: 'Mr Offer Performer',
          bookingEmail: 'booking@example.net',
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

        // When
        await renderOffers(props, store)

        // Then
        const audioDisabilityCompliant = screen.getByLabelText(
          fieldLabels.audioDisabilityCompliant.label,
          {
            exact: fieldLabels.audioDisabilityCompliant.exact,
          }
        )
        expect(audioDisabilityCompliant).toBeEnabled()
        const mentalDisabilityCompliant = screen.getByLabelText(
          fieldLabels.mentalDisabilityCompliant.label,
          {
            exact: fieldLabels.mentalDisabilityCompliant.exact,
          }
        )
        expect(mentalDisabilityCompliant).toBeEnabled()
        const motorDisabilityCompliant = screen.getByLabelText(
          fieldLabels.motorDisabilityCompliant.label,
          {
            exact: fieldLabels.motorDisabilityCompliant.exact,
          }
        )
        expect(motorDisabilityCompliant).toBeEnabled()
        const visualDisabilityCompliant = screen.getByLabelText(
          fieldLabels.visualDisabilityCompliant.label,
          {
            exact: fieldLabels.visualDisabilityCompliant.exact,
          }
        )
        expect(visualDisabilityCompliant).toBeEnabled()
        const externalTicketOfficeUrlInput = screen.getByLabelText(
          fieldLabels.externalTicketOfficeUrl.label,
          {
            exact: fieldLabels.externalTicketOfficeUrl.exact,
          }
        )
        expect(externalTicketOfficeUrlInput).toBeEnabled()
      })

      // TODO (rlecellier): to fix, do not resolve
      it('should not allow any other edition', async () => {
        // Given
        editedOfferVenue.isVirtual = true
        const editedOffer = {
          id: 'ABC12',
          name: 'My edited offer',
          type: 'EventType.FULL_CONDITIONAL_FIELDS',
          showType: 400,
          showSubType: 401,
          description: 'Offer description',
          venue: editedOfferVenue,
          venueId: editedOfferVenue.id,
          withdrawalDetails: 'Offer withdrawal details',
          author: 'Mr Offer Author',
          performer: 'Mr Offer Performer',
          bookingEmail: 'booking@example.net',
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

        // When
        await renderOffers(props, store)

        // Then
        const typeInput = screen.getByLabelText(fieldLabels.type.label, {
          exact: fieldLabels.type.exact,
        })
        expect(typeInput).toBeDisabled()
        const showSubTypeInput = screen.getByLabelText(fieldLabels.showSubType.label, {
          exact: fieldLabels.showSubType.exact,
        })
        expect(showSubTypeInput).toBeDisabled()
        const showTypeInput = screen.getByLabelText(fieldLabels.showType.label, {
          exact: fieldLabels.showType.exact,
        })
        expect(showTypeInput).toBeDisabled()
        const offererIdInput = screen.getByLabelText(fieldLabels.offererId.label, {
          exact: fieldLabels.offererId.exact,
        })
        expect(offererIdInput).toBeDisabled()
        const authorInput = screen.getByLabelText(fieldLabels.author.label, {
          exact: fieldLabels.author.exact,
        })
        expect(authorInput).toBeDisabled()
        const bookingEmailInput = screen.getByLabelText(fieldLabels.bookingEmail.label, {
          exact: fieldLabels.bookingEmail.exact,
        })
        expect(bookingEmailInput).toBeDisabled()
        const receiveNotificationEmailsCheckbox = screen.getByLabelText(
          fieldLabels.receiveNotificationEmails.label,
          {
            exact: fieldLabels.bookingEmail.exact,
          }
        )
        expect(receiveNotificationEmailsCheckbox).toBeDisabled()
        const descriptionInput = screen.getByLabelText(fieldLabels.description.label, {
          exact: fieldLabels.description.exact,
        })
        expect(descriptionInput).toBeDisabled()
        const durationMinutesInput = screen.getByLabelText(fieldLabels.durationMinutes.label, {
          exact: fieldLabels.durationMinutes.exact,
        })
        expect(durationMinutesInput).toBeDisabled()
        const isbnInput = screen.getByLabelText(fieldLabels.isbn.label, {
          exact: fieldLabels.isbn.exact,
        })
        expect(isbnInput).toBeDisabled()
        const isDuoInput = screen.getByLabelText(fieldLabels.isDuo.label, {
          exact: fieldLabels.isDuo.exact,
        })
        expect(isDuoInput).toBeDisabled()
        const nameInput = screen.getByLabelText(fieldLabels.name.label, {
          exact: fieldLabels.name.exact,
        })
        expect(nameInput).toBeDisabled()
        const performerInput = screen.getByLabelText(fieldLabels.performer.label, {
          exact: fieldLabels.performer.exact,
        })
        expect(performerInput).toBeDisabled()
        const stageDirectorInput = screen.getByLabelText(fieldLabels.stageDirector.label, {
          exact: fieldLabels.stageDirector.exact,
        })
        expect(stageDirectorInput).toBeDisabled()
        const speakerInput = screen.getByLabelText(fieldLabels.speaker.label, {
          exact: fieldLabels.speaker.exact,
        })
        expect(speakerInput).toBeDisabled()
        const urlInput = screen.getByLabelText(fieldLabels.url.label, {
          exact: fieldLabels.url.exact,
        })
        expect(urlInput).toBeDisabled()
        const venueIdInput = screen.getByLabelText(fieldLabels.venueId.label, {
          exact: fieldLabels.venueId.exact,
        })
        expect(venueIdInput).toBeDisabled()
        const visaInput = screen.getByLabelText(fieldLabels.visa.label, {
          exact: fieldLabels.visa.exact,
        })
        expect(visaInput).toBeDisabled()
        const withdrawalDetailsInput = screen.getByLabelText(fieldLabels.withdrawalDetails.label, {
          exact: fieldLabels.withdrawalDetails.exact,
        })
        expect(withdrawalDetailsInput).toBeDisabled()
      })

      it('should allow edition of "isDuo" for "Allociné" offers', async () => {
        // Given
        const editedOffer = {
          id: 'ABC12',
          name: 'My edited offer',
          type: 'EventType.CINEMA',
          showType: 400,
          showSubType: 401,
          description: 'Offer description',
          venue: editedOfferVenue,
          venueId: editedOfferVenue.id,
          withdrawalDetails: 'Offer withdrawal details',
          author: 'Mr Offer Author',
          performer: 'Mr Offer Performer',
          bookingEmail: 'booking@example.net',
          lastProvider: {
            name: 'Allociné',
          },
        }
        pcapi.loadOffer.mockResolvedValue(editedOffer)
        const cinemaType = {
          conditionalFields: ['author', 'visa', 'stageDirector'],
          offlineOnly: true,
          onlineOnly: false,
          proLabel: 'Cinéma - projections et autres évènements',
          type: 'Event',
          value: 'EventType.CINEMA',
        }
        pcapi.loadTypes.mockResolvedValue([cinemaType])

        // When
        await renderOffers(props, store)

        // Then
        const isDuoInput = screen.getByLabelText(fieldLabels.isDuo.label, {
          exact: fieldLabels.isDuo.exact,
        })
        expect(isDuoInput).toBeEnabled()
      })
    })
  })

  describe('when submitting form', () => {
    it('should not send not editable fields for non-synchronised offers', async () => {
      // Given
      const editedOffer = {
        id: 'ABC12',
        name: 'My edited offer',
        type: 'ThingType.LIVRE_EDITION',
        description: 'Offer description',
        venueId: editedOfferVenue.id,
        venue: editedOfferVenue,
        withdrawalDetails: 'Offer withdrawal details',
        bookingEmail: 'booking@example.net',
        extraData: null,
        audioDisabilityCompliant: false,
        visualDisabilityCompliant: true,
        motorDisabilityCompliant: false,
        mentalDisabilityCompliant: false,
      }
      pcapi.loadOffer.mockResolvedValue(editedOffer)
      await renderOffers(props, store)

      // When
      userEvent.click(screen.getByText('Enregistrer'))

      // Then
      expect(pcapi.updateOffer).toHaveBeenCalledWith(
        editedOffer.id,
        expect.not.objectContaining({
          venueId: expect.anything(),
          type: expect.anything(),
        })
      )
    })

    it('should show a success notification when form was correctly submitted', async () => {
      // Given
      const editedOffer = {
        id: 'ABC12',
        name: 'My edited offer',
        type: 'ThingType.LIVRE_EDITION',
        description: 'Offer description',
        venueId: editedOfferVenue.id,
        venue: editedOfferVenue,
        withdrawalDetails: 'Offer withdrawal details',
        bookingEmail: 'booking@example.net',
        extraData: null,
        audioDisabilityCompliant: false,
        visualDisabilityCompliant: true,
        motorDisabilityCompliant: false,
        mentalDisabilityCompliant: false,
      }
      pcapi.loadOffer.mockResolvedValue(editedOffer)
      await renderOffers(props, store)

      // When
      userEvent.click(screen.getByText('Enregistrer'))

      // Then
      const successNotification = await screen.findByText('Votre offre a bien été modifiée')
      expect(successNotification).toBeInTheDocument()
    })

    it('should send accessibility fields for synchronized offers', async () => {
      // Given
      const editedOffer = {
        id: 'ABC12',
        name: 'My edited offer',
        type: 'EventType.CINEMA',
        description: 'Offer description',
        venueId: editedOfferVenue.id,
        venue: editedOfferVenue,
        withdrawalDetails: 'Offer withdrawal details',
        bookingEmail: 'booking@example.net',
        extraData: {
          stageDirector: 'Mr Stage Director',
        },
        audioDisabilityCompliant: false,
        visualDisabilityCompliant: true,
        motorDisabilityCompliant: false,
        mentalDisabilityCompliant: false,
        lastProvider: {
          name: 'Allociné',
        },
      }
      pcapi.loadOffer.mockResolvedValue(editedOffer)
      const cinemaType = {
        conditionalFields: ['author', 'visa', 'stageDirector'],
        offlineOnly: true,
        onlineOnly: false,
        proLabel: 'Cinéma - projections et autres évènements',
        type: 'Event',
        value: 'EventType.CINEMA',
      }
      pcapi.loadTypes.mockResolvedValue([cinemaType])

      await renderOffers(props, store)

      // When
      userEvent.click(screen.getByText('Enregistrer'))

      // Then
      expect(pcapi.updateOffer).toHaveBeenCalledWith(
        editedOffer.id,
        expect.objectContaining({
          audioDisabilityCompliant: false,
          visualDisabilityCompliant: true,
          motorDisabilityCompliant: false,
          mentalDisabilityCompliant: false,
        })
      )
    })

    it('should not send extraData for synchronized offers', async () => {
      // Given
      const editedOffer = {
        id: 'ABC12',
        name: 'My edited offer',
        type: 'EventType.CINEMA',
        description: 'Offer description',
        venueId: editedOfferVenue.id,
        venue: editedOfferVenue,
        withdrawalDetails: 'Offer withdrawal details',
        bookingEmail: 'booking@example.net',
        extraData: {
          stageDirector: 'Mr Stage Director',
        },
        lastProvider: {
          name: 'Allociné',
        },
      }
      pcapi.loadOffer.mockResolvedValue(editedOffer)
      const cinemaType = {
        conditionalFields: ['author', 'visa', 'stageDirector'],
        offlineOnly: true,
        onlineOnly: false,
        proLabel: 'Cinéma - projections et autres évènements',
        type: 'Event',
        value: 'EventType.CINEMA',
      }
      pcapi.loadTypes.mockResolvedValue([cinemaType])

      await renderOffers(props, store)

      // When
      userEvent.click(screen.getByText('Enregistrer'))

      // Then
      expect(pcapi.updateOffer).toHaveBeenCalledWith(
        editedOffer.id,
        expect.not.objectContaining({
          extraData: null,
        })
      )
    })

    it('should send null extraData when removing them', async () => {
      // Given
      const editedOffer = {
        id: 'ABC12',
        name: 'My edited offer',
        type: 'ThingType.LIVRE_EDITION',
        description: 'Offer description',
        venueId: editedOfferVenue.id,
        venue: editedOfferVenue,
        withdrawalDetails: 'Offer withdrawal details',
        bookingEmail: 'booking@example.net',
        extraData: {
          author: 'Mon auteur',
          isbn: '123456789',
        },
        audioDisabilityCompliant: false,
        visualDisabilityCompliant: true,
        motorDisabilityCompliant: false,
        mentalDisabilityCompliant: false,
      }
      pcapi.loadOffer.mockResolvedValue(editedOffer)
      await renderOffers(props, store)

      // When
      await setOfferValues({ author: DEFAULT_FORM_VALUES.author, isbn: DEFAULT_FORM_VALUES.isbn })

      // Then
      userEvent.click(screen.getByText('Enregistrer'))
      expect(pcapi.updateOffer).toHaveBeenCalledWith(
        editedOffer.id,
        expect.objectContaining({
          extraData: null,
        })
      )
    })

    it('should remove attribute from extraData when no value is provided', async () => {
      // Given
      const editedOffer = {
        id: 'ABC12',
        name: 'My edited offer',
        type: 'ThingType.LIVRE_EDITION',
        description: 'Offer description',
        venueId: editedOfferVenue.id,
        venue: editedOfferVenue,
        withdrawalDetails: 'Offer withdrawal details',
        bookingEmail: 'booking@example.net',
        extraData: {
          author: 'Mon auteur',
          isbn: '123456789',
        },
        audioDisabilityCompliant: false,
        visualDisabilityCompliant: true,
        motorDisabilityCompliant: false,
        mentalDisabilityCompliant: false,
      }
      pcapi.loadOffer.mockResolvedValue(editedOffer)
      await renderOffers(props, store)

      // When
      await setOfferValues({ author: DEFAULT_FORM_VALUES.author })

      // Then
      userEvent.click(screen.getByText('Enregistrer'))
      expect(pcapi.updateOffer).toHaveBeenCalledWith(
        editedOffer.id,
        expect.objectContaining({
          extraData: { isbn: editedOffer.extraData.isbn },
        })
      )
    })

    it('should remove notification email when remove the will to receive notifications', async () => {
      // Given
      const editedOffer = {
        id: 'ABC12',
        name: 'My edited offer',
        type: 'ThingType.LIVRE_EDITION',
        description: 'Offer description',
        venueId: editedOfferVenue.id,
        venue: editedOfferVenue,
        withdrawalDetails: 'Offer withdrawal details',
        bookingEmail: 'booking@example.net',
        extraData: null,
        audioDisabilityCompliant: false,
        mentalDisabilityCompliant: false,
        motorDisabilityCompliant: false,
        visualDisabilityCompliant: false,
      }
      pcapi.loadOffer.mockResolvedValue(editedOffer)
      await renderOffers(props, store)
      await setOfferValues({ receiveNotificationEmails: false })

      // When
      userEvent.click(screen.getByText('Enregistrer'))

      // Then
      expect(pcapi.updateOffer).toHaveBeenCalledWith(
        editedOffer.id,
        expect.objectContaining({
          bookingEmail: null,
        })
      )
    })

    it('should show error for email notification input when asking to receive booking emails and no email was provided', async () => {
      // Given
      const editedOffer = {
        id: 'ABC12',
        name: 'My edited offer',
        type: 'ThingType.PRESSE_ABO',
        description: 'Offer description',
        venueId: editedOfferVenue.id,
        venue: editedOfferVenue,
        withdrawalDetails: 'Offer withdrawal details',
        bookingEmail: null,
      }
      pcapi.loadOffer.mockResolvedValue(editedOffer)
      await renderOffers(props, store)
      await setOfferValues({ receiveNotificationEmails: true })

      // When
      userEvent.click(screen.getByText('Enregistrer'))

      // Then
      const bookingEmailInput = await findInputErrorForField('bookingEmail')
      expect(bookingEmailInput).toHaveTextContent('Ce champ est obligatoire')
      expect(
        screen.getByText('Une ou plusieurs erreurs sont présentes dans le formulaire')
      ).toBeInTheDocument()
    })

    it('should show error sent by API and show an error notification', async () => {
      // Given
      const editedOffer = {
        id: 'ABC12',
        name: 'My edited offer',
        type: 'ThingType.LIVRE_EDITION',
        description: 'Offer description',
        venueId: editedOfferVenue.id,
        venue: editedOfferVenue,
        withdrawalDetails: 'Offer withdrawal details',
        bookingEmail: 'booking@example.net',
        extraData: null,
      }
      pcapi.loadOffer.mockResolvedValue(editedOffer)
      pcapi.updateOffer.mockRejectedValue({ errors: { name: "Ce nom n'est pas valide" } })
      await renderOffers(props, store)
      await setOfferValues({ name: 'Ce nom serait-il invalide ?' })

      // When
      userEvent.click(screen.getByText('Enregistrer'))

      // Then
      const nameError = await screen.findByText("Ce nom n'est pas valide")
      expect(nameError).toBeInTheDocument()
      const errorNotification = await screen.findByText(
        'Une ou plusieurs erreurs sont présentes dans le formulaire'
      )
      expect(errorNotification).toBeInTheDocument()
    })
  })

  describe('when clicking on cancel link', () => {
    it('should call computeOffersUrl with proper params', async () => {
      // Given
      const testStore = {
        data: { users: [{ publicName: 'François', isAdmin: false }] },
        offers: {
          searchFilters: {
            name: 'test',
            offererId: 'AY',
            venueId: 'EQ',
            typeId: 'EventType.CINEMA',
            status: 'all',
            creationMode: 'manual',
            periodBeginningDate: '2020-11-30T00:00:00+01:00',
            periodEndingDate: '2021-01-07T23:59:59+01:00',
            page: 1,
          },
        },
      }
      store = configureTestStore(testStore)

      const editedOffer = {
        id: 'ABC12',
        name: 'My edited offer',
        type: 'ThingType.LIVRE_EDITION',
        description: 'Offer description',
        venueId: editedOfferVenue.id,
        venue: editedOfferVenue,
        withdrawalDetails: 'Offer withdrawal details',
        bookingEmail: 'booking@example.net',
        extraData: null,
      }
      pcapi.loadOffer.mockResolvedValue(editedOffer)
      await renderOffers(props, store)

      // When
      userEvent.click(screen.getByRole('link', { name: 'Annuler et quitter' }))

      // Then
      expect(computeUrl.computeOffersUrl).toHaveBeenLastCalledWith(testStore.offers.searchFilters)
    })

    it('should redirect to offers page', async () => {
      // Given
      store = configureTestStore({
        data: { users: [{ publicName: 'François', isAdmin: false }] },
        offers: {
          searchFilters: {},
        },
      })
      const editedOffer = {
        id: 'ABC12',
        name: 'My edited offer',
        type: 'ThingType.PRESSE_ABO',
        description: 'Offer description',
        venueId: editedOfferVenue.id,
        venue: editedOfferVenue,
        withdrawalDetails: 'Offer withdrawal details',
        bookingEmail: null,
      }
      pcapi.loadOffer.mockResolvedValue(editedOffer)

      // When
      await renderOffers(props, store)

      // Then
      const cancelLink = screen.getByRole('link', { name: 'Annuler et quitter' })
      expect(cancelLink).toBeInTheDocument()
      expect(cancelLink).toHaveAttribute('href', '/offres')
    })
  })
})
