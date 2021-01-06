/* eslint-disable jest/no-disabled-tests */
import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { mount } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'

import * as pcapi from 'repository/pcapi/pcapi'
import { fetchAllVenuesByProUser } from 'repository/venuesService'
import { configureTestStore } from 'store/testUtils'
import { queryByTextTrimHtml } from 'utils/testHelpers'

import {
  ALL_OFFERERS,
  ALL_OFFERS,
  ALL_STATUS,
  ALL_TYPES,
  ALL_TYPES_OPTION,
  ALL_VENUES,
  ALL_VENUES_OPTION,
  ALL_EVENT_PERIODS,
  CREATION_MODES_FILTERS,
  DEFAULT_CREATION_MODE,
  DEFAULT_PAGE,
  DEFAULT_SEARCH_FILTERS,
} from '../_constants'
import Offers from '../Offers'

const mountOffers = (props, store) => {
  return mount(
    <Provider store={store}>
      <MemoryRouter>
        <Offers {...props} />
      </MemoryRouter>
    </Provider>
  )
}

const renderOffers = (props, store) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Offers {...props} />
      </MemoryRouter>
    </Provider>
  )
}

const offerTypes = [
  {
    appLabel: 'Cinéma',
    conditionalFields: ['author', 'visa', 'stageDirector'],
    description:
      'Action, science-fiction, documentaire ou comédie sentimentale ? En salle, en plein air ou bien au chaud chez soi ? Et si c’était plutôt cette exposition qui allait faire son cinéma ?',
    isActive: true,
    offlineOnly: true,
    onlineOnly: false,
    proLabel: 'Cinéma - projections et autres évènements',
    sublabel: 'Regarder',
    type: 'Event',
    value: 'EventType.CINEMA',
  },
  {
    appLabel: 'Conférences, rencontres et découverte des métiers',
    conditionalFields: ['speaker'],
    description: 'Parfois une simple rencontre peut changer une vie...',
    isActive: true,
    offlineOnly: true,
    onlineOnly: false,
    proLabel: 'Conférences, rencontres et découverte des métiers',
    sublabel: 'Rencontrer',
    type: 'Event',
    value: 'EventType.CONFERENCE_DEBAT_DEDICACE',
  },
]

jest.mock('repository/venuesService', () => ({
  ...jest.requireActual('repository/venuesService'),
  fetchAllVenuesByProUser: jest.fn(),
}))

jest.mock('repository/pcapi/pcapi', () => ({
  ...jest.requireActual('repository/pcapi/pcapi'),
  loadTypes: jest.fn().mockResolvedValue(offerTypes),
}))

jest.mock('store/selectors/data/venuesSelectors', () => ({
  selectVenueById: jest.fn().mockReturnValue({
    isVirtual: true,
    offererName: 'Offerer name',
  }),
}))

describe('src | components | pages | Offers | Offers', () => {
  let change
  let parse
  let props
  let currentUser
  let store
  const proVenues = [
    {
      id: 'JI',
      name: 'Ma venue',
      offererName: 'Mon offerer',
      isVirtual: false,
    },
    {
      id: 'JQ',
      name: 'Ma venue virtuelle',
      offererName: 'Mon offerer',
      isVirtual: true,
    },
  ]

  beforeEach(() => {
    jest.spyOn(Date.prototype, 'toISOString').mockImplementation(() => '2020-12-15T12:00:00Z')
    change = jest.fn()
    parse = jest.fn().mockReturnValue({})
    currentUser = { id: 'EY', isAdmin: false, name: 'Current User', publicName: 'USER' }
    store = configureTestStore({
      data: {
        users: [currentUser],
        venues: [{ id: 'JI', name: 'Venue' }],
      },
    })

    props = {
      closeNotification: jest.fn(),
      currentUser,
      handleOnActivateAllVenueOffersClick: jest.fn(),
      handleOnDeactivateAllVenueOffersClick: jest.fn(),
      loadOffers: jest.fn().mockResolvedValue({ page: 1, pageCount: 2, offersCount: 5 }),
      saveSearchFilters: jest.fn(),
      offers: [
        {
          id: 'N9',
          venueId: 'JI',
        },
      ],
      query: {
        change,
        parse,
      },
      savedSearchFilters: {
        name: '',
        offererId: 'all',
        venueId: 'all',
        typeId: 'all',
        status: 'all',
        creationMode: 'all',
      },
      setSelectedOfferIds: jest.fn(),
      showActionsBar: jest.fn(),
      hideActionsBar: jest.fn(),
      venue: { name: 'Ma Venue', id: 'JI' },
      getOfferer: jest.fn().mockResolvedValue({}),
    }
    fetchAllVenuesByProUser.mockResolvedValue(proVenues)
  })

  afterEach(() => {
    fetchAllVenuesByProUser.mockReset()
  })

  describe('render', () => {
    it('should load offers from API with defaults props', () => {
      // When
      renderOffers(props, store)

      // Then
      expect(props.loadOffers).toHaveBeenCalledWith({
        name: ALL_OFFERS,
        page: DEFAULT_PAGE,
        venueId: ALL_VENUES,
        typeId: ALL_TYPES,
        offererId: ALL_OFFERERS,
        status: ALL_STATUS,
        creationMode: DEFAULT_CREATION_MODE.id,
        periodBeginningDate: ALL_EVENT_PERIODS,
        periodEndingDate: ALL_EVENT_PERIODS,
      })
    })

    it('should display column titles when offers are returned', async () => {
      // Given
      props.offers = [{ id: 'KE', availabilityMessage: 'Pas de stock', venueId: 'JI' }]

      // When
      await renderOffers(props, store)

      // Then
      expect(screen.getByText('Lieu', { selector: 'th' })).toBeInTheDocument()
      expect(screen.getByText('Stock', { selector: 'th' })).toBeInTheDocument()
    })

    it('should not display column titles when no offers are returned', async () => {
      // Given
      props.offers = []

      // When
      renderOffers(props, store)

      // Then
      expect(screen.queryByText('Lieu', { selector: 'th' })).toBeNull()
      expect(screen.queryByText('Stock', { selector: 'th' })).toBeNull()
    })

    it('should render as much offers as given in props', async () => {
      // Given
      props.offers = [
        {
          id: 'M4',
          isActive: true,
          isEditable: true,
          isFullyBooked: false,
          isEvent: true,
          isThing: false,
          hasBookingLimitDatetimesPassed: false,
          name: 'My little offer',
          thumbUrl: '/my-fake-thumb',
          venueId: 'JI',
        },
        {
          id: 'AE3',
          isActive: true,
          isEditable: true,
          isFullyBooked: true,
          isEvent: false,
          isThing: true,
          hasBookingLimitDatetimesPassed: false,
          name: 'My other offer',
          thumbUrl: '/my-other-fake-thumb',
          venueId: 'JI',
        },
      ]

      // When
      renderOffers(props, store)

      // Then
      await waitFor(() => expect(screen.queryByText('My little offer')).not.toBeNull())
      await waitFor(() => expect(screen.queryByText('My other offer')).not.toBeNull())
    })

    it('should display an unchecked by default checkbox to select all offers when user is not admin', async () => {
      // Given
      props.currentUser.isAdmin = false
      props.offers = [
        {
          id: 'M4',
          isActive: true,
          isEditable: true,
          isFullyBooked: false,
          isEvent: true,
          isThing: false,
          hasBookingLimitDatetimesPassed: false,
          name: 'My little offer',
          thumbUrl: '/my-fake-thumb',
          venueId: 'JI',
        },
        {
          id: 'AE3',
          isActive: true,
          isEditable: true,
          isFullyBooked: true,
          isEvent: false,
          isThing: true,
          hasBookingLimitDatetimesPassed: false,
          name: 'My other offer',
          thumbUrl: '/my-other-fake-thumb',
          venueId: 'JI',
        },
      ]

      // When
      await renderOffers(props, store)

      // Then
      const selectAllOffersCheckbox = screen.queryByLabelText('Tout sélectionner')
      expect(selectAllOffersCheckbox).toBeInTheDocument()
      expect(selectAllOffersCheckbox).not.toBeChecked()
      expect(selectAllOffersCheckbox).not.toBeDisabled()
    })

    describe('total number of offers', () => {
      it('should display total number of offers in plural if multiple offers', async () => {
        // Given
        const page = 1
        const pageCount = 2
        const offersCount = 17
        props.loadOffers.mockResolvedValueOnce({ page, pageCount, offersCount })

        // When
        renderOffers(props, store)

        // Then
        await waitFor(() => {
          expect(queryByTextTrimHtml(screen, '17 offres')).not.toBeNull()
        })
      })

      it('should display total number of offers in singular if one or no offer', async () => {
        // Given
        const page = 1
        const pageCount = 1
        const offersCount = 1
        props.loadOffers.mockResolvedValueOnce({ page, pageCount, offersCount })

        // When
        renderOffers(props, store)

        // Then
        await waitFor(() => {
          expect(queryByTextTrimHtml(screen, '1 offre')).not.toBeNull()
        })
      })
    })

    describe('filters', () => {
      it('should render venue filter with default option and given venues', async () => {
        // Given
        const expectedSelectOptions = [
          { id: [ALL_VENUES_OPTION.id], value: ALL_VENUES_OPTION.displayName },
          { id: [proVenues[0].id], value: proVenues[0].name },
          { id: [proVenues[1].id], value: `${proVenues[1].offererName} - Offre numérique` },
        ]
        const getByOptions = { selector: 'select[name="lieu"]' }

        // When
        renderOffers(props, store)

        // Then
        let venueSelect = screen.getByDisplayValue(expectedSelectOptions[0].value, getByOptions)
        expect(venueSelect).toBeInTheDocument()

        fireEvent.change(venueSelect, { target: { value: expectedSelectOptions[1].id } })
        await waitFor(() => {
          venueSelect = screen.getByDisplayValue(expectedSelectOptions[0].value, getByOptions)
          expect(venueSelect).toBeInTheDocument()
        })

        fireEvent.change(venueSelect, { target: { value: expectedSelectOptions[2].id } })
        await waitFor(() => {
          venueSelect = screen.getByDisplayValue(expectedSelectOptions[2].value, getByOptions)
          expect(venueSelect).toBeInTheDocument()
        })
      })

      it('should render venue filter with given venue selected', async () => {
        // Given
        const expectedSelectOptions = [{ id: [proVenues[0].id], value: proVenues[0].name }]
        jest.spyOn(props.query, 'parse').mockReturnValue({ lieu: proVenues[0].id })

        // When
        renderOffers(props, store)

        // Then
        await waitFor(() => {
          let venueSelect = screen.getByDisplayValue(expectedSelectOptions[0].value, {
            selector: 'select[name="lieu"]',
          })
          expect(venueSelect).toBeInTheDocument()
        })
      })

      it('should render creation mode filter with default option selected', async () => {
        // When
        renderOffers(props, store)

        // Then
        expect(screen.getByDisplayValue('Tous les modes')).toBeInTheDocument()
      })

      it('should render creation mode filter with given creation mode selected', async () => {
        // Given
        jest.spyOn(props.query, 'parse').mockReturnValue({ creation: 'importee' })

        // When
        renderOffers(props, store)

        // Then
        expect(screen.getByDisplayValue('Importée')).toBeInTheDocument()
      })

      it('should allow user to select manual creation mode filter', () => {
        // Given
        renderOffers(props, store)
        const creationModeSelect = screen.getByDisplayValue('Tous les modes')

        // When
        fireEvent.change(creationModeSelect, { target: { value: 'manual' } })

        // Then
        expect(screen.getByDisplayValue('Manuelle')).toBeInTheDocument()
      })

      it('should allow user to select imported creation mode filter', () => {
        // Given
        renderOffers(props, store)
        const creationModeSelect = screen.getByDisplayValue('Tous les modes')

        // When
        fireEvent.change(creationModeSelect, { target: { value: 'imported' } })

        // Then
        expect(screen.getByDisplayValue('Importée')).toBeInTheDocument()
      })

      it('should display event period filter with no default option', async () => {
        // When
        await renderOffers(props, store)

        // Then
        const eventPeriodSelect = screen.queryAllByPlaceholderText('JJ/MM/AAAA')
        expect(eventPeriodSelect).toHaveLength(2)
      })

      describe('status filters', () => {
        it('should not display status filters modal', async () => {
          // Given
          props.offers = [{ id: 'KE', availabilityMessage: 'Pas de stock', venueId: 'JI' }]

          // When
          await renderOffers(props, store)

          // Then
          expect(screen.queryByText('Statut')).toBeInTheDocument()
          expect(screen.queryByText('Afficher les statuts')).not.toBeInTheDocument()
          expect(screen.queryByLabelText('Tous')).not.toBeInTheDocument()
          expect(screen.queryByLabelText('Active')).not.toBeInTheDocument()
          expect(screen.queryByLabelText('Inactive')).not.toBeInTheDocument()
          expect(screen.queryByLabelText('Épuisée')).not.toBeInTheDocument()
          expect(screen.queryByLabelText('Expirée')).not.toBeInTheDocument()
          expect(screen.queryByLabelText('Appliquer')).not.toBeInTheDocument()
        })

        it('should display status filters with "Tous" as default value when clicking on "Statut" filter icon', async () => {
          // Given
          props.offers = [{ id: 'KE', availabilityMessage: 'Pas de stock', venueId: 'JI' }]
          await renderOffers(props, store)

          // When
          fireEvent.click(screen.getByAltText('Afficher ou masquer le filtre par statut'))

          // Then
          expect(screen.queryByText('Afficher les statuts')).toBeInTheDocument()
          expect(screen.getByLabelText('Tous')).toBeChecked()
          expect(screen.getByLabelText('Active')).not.toBeChecked()
          expect(screen.getByLabelText('Inactive')).not.toBeChecked()
          expect(screen.getByLabelText('Épuisée')).not.toBeChecked()
          expect(screen.getByLabelText('Expirée')).not.toBeChecked()
          expect(screen.queryByText('Appliquer', { selector: 'button' })).toBeInTheDocument()
        })

        it('should filter offers given status filter when clicking on "Appliquer"', async () => {
          // Given
          props.offers = [{ id: 'KE', availabilityMessage: 'Pas de stock', venueId: 'JI' }]
          await renderOffers(props, store)
          fireEvent.click(screen.getByAltText('Afficher ou masquer le filtre par statut'))
          fireEvent.click(screen.getByLabelText('Expirée'))

          // When
          fireEvent.click(screen.getByText('Appliquer'))

          // Then
          expect(props.loadOffers).toHaveBeenLastCalledWith({
            creationMode: DEFAULT_SEARCH_FILTERS.creationMode,
            name: '',
            offererId: DEFAULT_SEARCH_FILTERS.offererId,
            page: DEFAULT_PAGE,
            venueId: DEFAULT_SEARCH_FILTERS.venueId,
            typeId: DEFAULT_SEARCH_FILTERS.typeId,
            periodBeginningDate: DEFAULT_SEARCH_FILTERS.periodBeginningDate,
            periodEndingDate: DEFAULT_SEARCH_FILTERS.periodEndingDate,
            status: 'expired',
          })
        })

        it('should hide status filters when clicking outside the modal', async () => {
          // Given
          props.offers = [{ id: 'KE', availabilityMessage: 'Pas de stock', venueId: 'JI' }]
          await renderOffers(props, store)
          fireEvent.click(screen.getByAltText('Afficher ou masquer le filtre par statut'))

          // When
          fireEvent.click(screen.getByText('5 offres'))

          // Then
          expect(screen.queryByText('Afficher les statuts')).toBeNull()
        })

        it('should display no results for filters', async () => {
          // Given
          props.savedSearchFilters = {
            lieu: proVenues[0].id,
          }
          props.offers = []

          // When
          await renderOffers(props, store)

          // Then

          const noOffersForSearchFiltersText = await screen.findByText(
            'Aucune offre trouvée pour votre recherche'
          )
          expect(noOffersForSearchFiltersText).toBeInTheDocument()
        })

        it('should display no results for filter', async () => {
          // Given
          props.offers = []

          // When
          await renderOffers(props, store)

          // Then
          const noOffersText = await screen.findByText("Vous n'avez pas encore créé d'offre.")
          expect(noOffersText).toBeInTheDocument()
        })
      })

      describe('when user is admin', () => {
        beforeEach(() => {
          props.currentUser.isAdmin = true
        })

        describe('status filter', () => {
          it('should disable status filters when no venue nor offerer filter is selected', async () => {
            // When
            await renderOffers(props, store)

            // Then
            const statusFiltersIcon = screen.getByAltText(
              'Afficher ou masquer le filtre par statut'
            )
            expect(statusFiltersIcon.closest('button')).toBeDisabled()
          })

          it('should disable status filters when no venue filter is selected, even if one venue filter is currently applied', async () => {
            // Given
            props.query.parse.mockReturnValueOnce({ lieu: 'JI' })
            await renderOffers(props, store)

            // When
            fireEvent.change(screen.getByDisplayValue('Ma venue'), { target: { value: 'all' } })

            // Then
            const statusFiltersIcon = screen.getByAltText(
              'Afficher ou masquer le filtre par statut'
            )
            expect(statusFiltersIcon.closest('button')).toBeDisabled()
          })

          it('should reset and disable status filter when venue filter is deselected', async () => {
            // Given
            const { id: venueId, name: venueName } = proVenues[0]
            props.query.parse.mockReturnValueOnce({ lieu: venueId, statut: 'inactive' })
            await renderOffers(props, store)
            fireEvent.change(screen.getByDisplayValue(venueName), { target: { value: ALL_VENUES } })

            // When
            await fireEvent.click(screen.getByText('Lancer la recherche'))

            // Then
            const statusFiltersIcon = screen.getByAltText(
              'Afficher ou masquer le filtre par statut'
            )
            expect(statusFiltersIcon.closest('button')).toBeDisabled()
            expect(props.loadOffers).toHaveBeenLastCalledWith({
              name: DEFAULT_SEARCH_FILTERS.name,
              page: DEFAULT_PAGE,
              venueId: DEFAULT_SEARCH_FILTERS.venueId,
              typeId: DEFAULT_SEARCH_FILTERS.typeId,
              offererId: DEFAULT_SEARCH_FILTERS.offererId,
              status: DEFAULT_SEARCH_FILTERS.status,
              creationMode: DEFAULT_SEARCH_FILTERS.creationMode,
              periodBeginningDate: DEFAULT_SEARCH_FILTERS.periodBeginningDate,
              periodEndingDate: DEFAULT_SEARCH_FILTERS.periodEndingDate,
            })
          })

          it('should not reset or disable status filter when venue filter is deselected while offerer filter is applied', async () => {
            // Given
            const { id: venueId, name: venueName } = proVenues[0]
            props.query.parse.mockReturnValueOnce({
              lieu: venueId,
              statut: 'inactive',
              structure: 'EF',
            })
            await renderOffers(props, store)
            fireEvent.change(screen.getByDisplayValue(venueName), { target: { value: ALL_VENUES } })

            // When
            await fireEvent.click(screen.getByText('Lancer la recherche'))

            // Then
            const statusFiltersIcon = screen.getByAltText(
              'Afficher ou masquer le filtre par statut'
            )
            expect(statusFiltersIcon.closest('button')).not.toBeDisabled()
            expect(props.loadOffers).toHaveBeenLastCalledWith({
              name: DEFAULT_SEARCH_FILTERS.name,
              page: DEFAULT_PAGE,
              venueId: DEFAULT_SEARCH_FILTERS.venueId,
              typeId: DEFAULT_SEARCH_FILTERS.typeId,
              offererId: 'EF',
              status: 'inactive',
              creationMode: DEFAULT_SEARCH_FILTERS.creationMode,
              periodBeginningDate: DEFAULT_SEARCH_FILTERS.periodBeginningDate,
              periodEndingDate: DEFAULT_SEARCH_FILTERS.periodEndingDate,
            })
          })

          it('should reset and disable status filter when offerer filter is removed', async () => {
            // Given
            const offerer = { name: 'La structure', id: 'EF' }
            props.getOfferer.mockResolvedValueOnce(offerer)
            props.query.parse.mockReturnValueOnce({ structure: offerer.id, statut: 'inactive' })
            await renderOffers(props, store)

            // When
            await fireEvent.click(screen.getByAltText('Supprimer le filtre par structure'))

            // Then
            const statusFiltersIcon = screen.getByAltText(
              'Afficher ou masquer le filtre par statut'
            )
            expect(statusFiltersIcon.closest('button')).toBeDisabled()
            expect(props.loadOffers).toHaveBeenLastCalledWith({
              name: DEFAULT_SEARCH_FILTERS.name,
              page: DEFAULT_PAGE,
              venueId: DEFAULT_SEARCH_FILTERS.venueId,
              typeId: DEFAULT_SEARCH_FILTERS.typeId,
              offererId: DEFAULT_SEARCH_FILTERS.offererId,
              status: DEFAULT_SEARCH_FILTERS.status,
              creationMode: DEFAULT_SEARCH_FILTERS.creationMode,
              periodBeginningDate: DEFAULT_SEARCH_FILTERS.periodBeginningDate,
              periodEndingDate: DEFAULT_SEARCH_FILTERS.periodEndingDate,
            })
          })

          it('should not reset or disable status filter when offerer filter is removed while venue filter is applied', async () => {
            // Given
            const { id: venueId } = proVenues[0]
            const offerer = { name: 'La structure', id: 'EF' }
            props.getOfferer.mockResolvedValueOnce(offerer)
            props.query.parse.mockReturnValueOnce({
              lieu: venueId,
              statut: 'inactive',
              structure: offerer.id,
            })
            await renderOffers(props, store)

            // When
            await fireEvent.click(screen.getByAltText('Supprimer le filtre par structure'))

            // Then
            const statusFiltersIcon = screen.getByAltText(
              'Afficher ou masquer le filtre par statut'
            )
            expect(statusFiltersIcon.closest('button')).not.toBeDisabled()
            expect(props.loadOffers).toHaveBeenLastCalledWith({
              name: DEFAULT_SEARCH_FILTERS.name,
              page: DEFAULT_PAGE,
              venueId: venueId,
              typeId: DEFAULT_SEARCH_FILTERS.typeId,
              offererId: DEFAULT_SEARCH_FILTERS.offererId,
              status: 'inactive',
              creationMode: DEFAULT_SEARCH_FILTERS.creationMode,
              periodBeginningDate: DEFAULT_SEARCH_FILTERS.periodBeginningDate,
              periodEndingDate: DEFAULT_SEARCH_FILTERS.periodEndingDate,
            })
          })

          it('should enable status filters when venue is selected but filter is not applied', async () => {
            // Given
            await renderOffers(props, store)

            // When
            fireEvent.change(screen.getByDisplayValue('Tous les lieux'), {
              target: { value: 'JI' },
            })

            // Then
            const statusFiltersIcon = screen.getByAltText(
              'Afficher ou masquer le filtre par statut'
            )
            expect(statusFiltersIcon.closest('button')).not.toBeDisabled()
          })

          it('should enable status filters when venue filter is applied', async () => {
            // Given
            props.query.parse.mockReturnValueOnce({ lieu: 'IJ' })

            // When
            await renderOffers(props, store)

            // Then
            const statusFiltersIcon = screen.getByAltText(
              'Afficher ou masquer le filtre par statut'
            )
            expect(statusFiltersIcon.closest('button')).not.toBeDisabled()
          })

          it('should enable status filters when offerer filter is applied', async () => {
            // Given
            props.query.parse.mockReturnValueOnce({ structure: 'A4' })

            // When
            await renderOffers(props, store)

            // Then
            const statusFiltersIcon = screen.getByAltText(
              'Afficher ou masquer le filtre par statut'
            )
            expect(statusFiltersIcon.closest('button')).not.toBeDisabled()
          })
        })

        describe('select all offers checkbox', () => {
          it('should disable select all checkbox when no venue nor offerer filter is applied', async () => {
            // When
            await renderOffers(props, store)

            // Then
            const selectAllOffersCheckbox = screen.getByLabelText('Tout sélectionner')
            expect(selectAllOffersCheckbox).toBeDisabled()
          })

          it('should not disable select all checkbox when no venue filter is selected but one is currently applied', async () => {
            // Given
            props.query.parse.mockReturnValueOnce({ lieu: 'JI' })
            props.savedSearchFilters.venueId = 'JI'
            await renderOffers(props, store)

            // When
            fireEvent.change(screen.getByDisplayValue('Ma venue'), { target: { value: 'all' } })

            // Then
            const selectAllOffersCheckbox = screen.getByLabelText('Tout sélectionner')
            expect(selectAllOffersCheckbox).not.toBeDisabled()
          })

          it('should disable select all checkbox when venue filter is selected but not applied', async () => {
            // Given
            await renderOffers(props, store)

            // When
            fireEvent.change(screen.getByDisplayValue('Tous les lieux'), {
              target: { value: 'JI' },
            })

            // Then
            const selectAllOffersCheckbox = screen.getByLabelText('Tout sélectionner')
            expect(selectAllOffersCheckbox).toBeDisabled()
          })

          it('should enable select all checkbox when venue filter is applied', async () => {
            // Given
            props.query.parse.mockReturnValueOnce({ lieu: 'IJ' })
            props.savedSearchFilters.venueId = 'IJ'

            // When
            await renderOffers(props, store)

            // Then
            const selectAllOffersCheckbox = screen.getByLabelText('Tout sélectionner')
            expect(selectAllOffersCheckbox).not.toBeDisabled()
          })

          it('should enable select all checkbox when offerer filter is applied', async () => {
            // Given
            props.query.parse.mockReturnValueOnce({ structure: 'A4' })
            props.savedSearchFilters.offererId = 'A4'

            // When
            await renderOffers(props, store)

            // Then
            const selectAllOffersCheckbox = screen.getByLabelText('Tout sélectionner')
            expect(selectAllOffersCheckbox).not.toBeDisabled()
          })
        })
      })
    })
  })

  describe('on click on search button', () => {
    it('should load offers with default filters when no changes where made', async () => {
      // Given
      await renderOffers(props, store)

      // When
      await fireEvent.click(screen.getByText('Lancer la recherche'))

      // Then
      expect(props.loadOffers).toHaveBeenCalledWith({
        name: DEFAULT_SEARCH_FILTERS.name,
        page: DEFAULT_PAGE,
        venueId: DEFAULT_SEARCH_FILTERS.venueId,
        typeId: DEFAULT_SEARCH_FILTERS.typeId,
        offererId: DEFAULT_SEARCH_FILTERS.offererId,
        status: DEFAULT_SEARCH_FILTERS.status,
        creationMode: DEFAULT_SEARCH_FILTERS.creationMode,
        periodBeginningDate: DEFAULT_SEARCH_FILTERS.periodBeginningDate,
        periodEndingDate: DEFAULT_SEARCH_FILTERS.periodEndingDate,
      })
    })

    it('should load offers with written offer name filter', async () => {
      // Given
      renderOffers(props, store)
      fireEvent.change(screen.getByPlaceholderText('Rechercher par nom d’offre'), {
        target: { value: 'Any word' },
      })

      // When
      fireEvent.click(screen.getByText('Lancer la recherche'))

      // Then
      expect(props.loadOffers).toHaveBeenCalledWith({
        name: 'Any word',
        page: DEFAULT_PAGE,
        venueId: DEFAULT_SEARCH_FILTERS.venueId,
        typeId: DEFAULT_SEARCH_FILTERS.typeId,
        offererId: DEFAULT_SEARCH_FILTERS.offererId,
        status: DEFAULT_SEARCH_FILTERS.status,
        creationMode: DEFAULT_SEARCH_FILTERS.creationMode,
        periodBeginningDate: DEFAULT_SEARCH_FILTERS.periodBeginningDate,
        periodEndingDate: DEFAULT_SEARCH_FILTERS.periodEndingDate,
      })
    })

    it('should load offers with selected venue filter', async () => {
      // Given
      await renderOffers(props, store)
      const venueSelect = screen.getByDisplayValue(ALL_VENUES_OPTION.displayName, {
        selector: 'select[name="lieu"]',
      })
      fireEvent.change(venueSelect, { target: { value: proVenues[0].id } })

      // When
      fireEvent.click(screen.getByText('Lancer la recherche'))

      // Then
      expect(props.loadOffers).toHaveBeenCalledWith({
        page: DEFAULT_PAGE,
        venueId: proVenues[0].id,
        name: DEFAULT_SEARCH_FILTERS.name,
        typeId: DEFAULT_SEARCH_FILTERS.typeId,
        offererId: DEFAULT_SEARCH_FILTERS.offererId,
        status: DEFAULT_SEARCH_FILTERS.status,
        creationMode: DEFAULT_SEARCH_FILTERS.creationMode,
        periodBeginningDate: DEFAULT_SEARCH_FILTERS.periodBeginningDate,
        periodEndingDate: DEFAULT_SEARCH_FILTERS.periodEndingDate,
      })
    })

    it('should load offers with selected type filter', async () => {
      // Given
      await renderOffers(props, store)
      const venueSelect = screen.getByDisplayValue(ALL_TYPES_OPTION.displayName, {
        selector: 'select[name="type"]',
      })
      fireEvent.change(venueSelect, { target: { value: offerTypes[0].value } })

      // When
      fireEvent.click(screen.getByText('Lancer la recherche'))

      // Then
      expect(props.loadOffers).toHaveBeenLastCalledWith({
        venueId: DEFAULT_SEARCH_FILTERS.venueId,
        page: DEFAULT_PAGE,
        name: DEFAULT_SEARCH_FILTERS.name,
        typeId: 'EventType.CINEMA',
        offererId: DEFAULT_SEARCH_FILTERS.offererId,
        status: DEFAULT_SEARCH_FILTERS.status,
        creationMode: DEFAULT_SEARCH_FILTERS.creationMode,
        periodBeginningDate: DEFAULT_SEARCH_FILTERS.periodBeginningDate,
        periodEndingDate: DEFAULT_SEARCH_FILTERS.periodEndingDate,
      })
    })

    it('should load offers with selected creation mode filter', () => {
      // Given
      renderOffers(props, store)
      const creationModeSelect = screen.getByDisplayValue(DEFAULT_CREATION_MODE.displayName)
      const importedCreationMode = CREATION_MODES_FILTERS[1].id
      fireEvent.change(creationModeSelect, { target: { value: importedCreationMode } })

      // When
      fireEvent.click(screen.getByText('Lancer la recherche'))

      // Then
      expect(props.loadOffers).toHaveBeenLastCalledWith({
        page: DEFAULT_PAGE,
        creationMode: 'imported',
        name: DEFAULT_SEARCH_FILTERS.name,
        venueId: DEFAULT_SEARCH_FILTERS.venueId,
        typeId: DEFAULT_SEARCH_FILTERS.typeId,
        offererId: DEFAULT_SEARCH_FILTERS.offererId,
        status: DEFAULT_SEARCH_FILTERS.status,
        periodBeginningDate: DEFAULT_SEARCH_FILTERS.periodBeginningDate,
        periodEndingDate: DEFAULT_SEARCH_FILTERS.periodEndingDate,
      })
    })

    it('should load offers with selected period beginning date', async () => {
      // given
      await renderOffers(props, store)

      fireEvent.click(screen.getAllByPlaceholderText('JJ/MM/AAAA')[0])
      fireEvent.click(screen.getByLabelText('day-25'))

      // when
      fireEvent.click(screen.getByText('Lancer la recherche'))

      // then
      expect(props.loadOffers).toHaveBeenLastCalledWith({
        venueId: DEFAULT_SEARCH_FILTERS.venueId,
        page: DEFAULT_PAGE,
        name: DEFAULT_SEARCH_FILTERS.name,
        typeId: DEFAULT_SEARCH_FILTERS.typeId,
        offererId: DEFAULT_SEARCH_FILTERS.offererId,
        status: DEFAULT_SEARCH_FILTERS.status,
        creationMode: DEFAULT_SEARCH_FILTERS.creationMode,
        periodBeginningDate: '2020-12-25T00:00:00+00:00',
        periodEndingDate: DEFAULT_SEARCH_FILTERS.periodEndingDate,
      })
    })

    it('should load offers with selected period ending date', async () => {
      // given
      await renderOffers(props, store)

      fireEvent.click(screen.getAllByPlaceholderText('JJ/MM/AAAA')[1])
      fireEvent.click(screen.getByLabelText('day-27'))

      // when
      fireEvent.click(screen.getByText('Lancer la recherche'))

      // then
      expect(props.loadOffers).toHaveBeenLastCalledWith({
        venueId: DEFAULT_SEARCH_FILTERS.venueId,
        page: DEFAULT_PAGE,
        name: DEFAULT_SEARCH_FILTERS.name,
        typeId: DEFAULT_SEARCH_FILTERS.typeId,
        offererId: DEFAULT_SEARCH_FILTERS.offererId,
        status: DEFAULT_SEARCH_FILTERS.status,
        creationMode: DEFAULT_SEARCH_FILTERS.creationMode,
        periodBeginningDate: DEFAULT_SEARCH_FILTERS.periodBeginningDate,
        periodEndingDate: '2020-12-27T23:59:59+00:00',
      })
    })
  })

  describe('on click on event filter ending date', () => {
    it('should properly format received date', async () => {
      // Given
      renderOffers(props, store)
      fireEvent.change(screen.getByPlaceholderText('Rechercher par nom d’offre'), {
        target: { value: 'Any word' },
      })

      // When
      fireEvent.click(screen.getByText('Lancer la recherche'))

      // Then
      await waitFor(() => {
        expect(props.loadOffers).toHaveBeenCalledWith({
          name: 'Any word',
          page: DEFAULT_PAGE,
          venueId: DEFAULT_SEARCH_FILTERS.venueId,
          typeId: DEFAULT_SEARCH_FILTERS.typeId,
          offererId: DEFAULT_SEARCH_FILTERS.offererId,
          status: DEFAULT_SEARCH_FILTERS.status,
          creationMode: DEFAULT_SEARCH_FILTERS.creationMode,
          periodBeginningDate: DEFAULT_SEARCH_FILTERS.periodBeginningDate,
          periodEndingDate: DEFAULT_SEARCH_FILTERS.periodEndingDate,
        })
      })
    })

    it('should set new date value on filters', async () => {
      // Given
      renderOffers(props, store)
      fireEvent.change(screen.getByPlaceholderText('Rechercher par nom d’offre'), {
        target: { value: 'Any word' },
      })

      // When
      fireEvent.click(screen.getByText('Lancer la recherche'))

      // Then
      await waitFor(() => {
        expect(props.loadOffers).toHaveBeenCalledWith({
          name: 'Any word',
          page: DEFAULT_PAGE,
          venueId: DEFAULT_SEARCH_FILTERS.venueId,
          typeId: DEFAULT_SEARCH_FILTERS.typeId,
          offererId: DEFAULT_SEARCH_FILTERS.offererId,
          status: DEFAULT_SEARCH_FILTERS.status,
          creationMode: DEFAULT_SEARCH_FILTERS.creationMode,
          periodBeginningDate: DEFAULT_SEARCH_FILTERS.periodBeginningDate,
          periodEndingDate: DEFAULT_SEARCH_FILTERS.periodEndingDate,
        })
      })
    })
  })

  describe('button to create an offer', () => {
    it('should not be displayed when user is an admin', () => {
      // Given
      props.currentUser.isAdmin = true

      // When
      renderOffers(props, store)

      // Then
      expect(screen.queryByText('Créer une offre')).toBeNull()
    })

    it('should be displayed when user is not an admin', () => {
      // Given
      props.currentUser.isAdmin = false

      // When
      renderOffers(props, store)

      // Then
      const createLink = queryByTextTrimHtml(screen, 'Créer une offre', {
        selector: 'a',
        leafOnly: false,
      })

      expect(createLink).not.toBeNull()
    })
  })

  describe('url query params', () => {
    it('should have page value when page value is not first page', async () => {
      // Given
      props.loadOffers.mockResolvedValueOnce({ page: 2, pageCount: 2, offersCount: 5 })
      renderOffers(props, store)

      // When
      await waitFor(() => {
        fireEvent.click(screen.getByAltText('Aller à la page suivante'))
      })

      // Then
      await waitFor(() => {
        expect(props.query.change).toHaveBeenCalledWith({
          categorie: null,
          creation: null,
          lieu: null,
          nom: null,
          page: 2,
          'periode-evenement-debut': null,
          'periode-evenement-fin': null,
          statut: null,
          structure: null,
        })
      })
    })

    it('should have page value be removed when page value is first page', async () => {
      // Given
      renderOffers(props, store)

      // When
      let nextIcon
      await waitFor(() => (nextIcon = screen.getByAltText('Aller à la page suivante')))
      fireEvent.click(nextIcon)

      let prevIcon
      await waitFor(() => (prevIcon = screen.getByAltText('Aller à la page précédente')))
      fireEvent.click(prevIcon)

      // Then
      await waitFor(() => {
        expect(props.query.change).toHaveBeenCalledWith({
          categorie: null,
          creation: null,
          lieu: null,
          nom: null,
          'periode-evenement-debut': null,
          'periode-evenement-fin': null,
          statut: null,
          structure: null,
        })
      })
    })

    it('should have offer name value when name search value is not an empty string', async () => {
      // Given
      renderOffers(props, store)

      // When
      await waitFor(() =>
        fireEvent.change(screen.getByPlaceholderText('Rechercher par nom d’offre'), {
          target: { value: 'AnyWord' },
        })
      )
      fireEvent.click(screen.getByText('Lancer la recherche'))

      // Then
      await waitFor(() => {
        expect(props.query.change).toHaveBeenCalledWith({
          categorie: null,
          creation: null,
          lieu: null,
          nom: 'AnyWord',
          'periode-evenement-debut': null,
          'periode-evenement-fin': null,
          statut: null,
          structure: null,
        })
      })
    })

    it('should store search value', async () => {
      // Given
      renderOffers(props, store)
      const searchInput = screen.getByPlaceholderText('Rechercher par nom d’offre')

      // When
      await waitFor(() => fireEvent.change(searchInput, { target: { value: 'search string' } }))
      fireEvent.click(screen.getByText('Lancer la recherche'))

      // Then
      await waitFor(() => {
        expect(props.saveSearchFilters).toHaveBeenCalledWith({
          venueId: ALL_VENUES,
          typeId: ALL_TYPES,
          name: 'search string',
          offererId: ALL_OFFERERS,
          page: DEFAULT_PAGE,
          status: ALL_STATUS,
          creationMode: DEFAULT_CREATION_MODE.id,
          periodBeginningDate: ALL_EVENT_PERIODS,
          periodEndingDate: ALL_EVENT_PERIODS,
        })
      })
    })

    it('should have offer name value be removed when name search value is an empty string', async () => {
      // Given
      renderOffers(props, store)

      // When
      await waitFor(() =>
        fireEvent.change(screen.getByPlaceholderText('Rechercher par nom d’offre'), {
          target: { value: ALL_OFFERS },
        })
      )
      fireEvent.click(screen.getByText('Lancer la recherche'))

      // Then
      await waitFor(() => {
        expect(props.query.change).toHaveBeenCalledWith({
          categorie: null,
          creation: null,
          lieu: null,
          nom: null,
          'periode-evenement-debut': null,
          'periode-evenement-fin': null,
          statut: null,
          structure: null,
        })
      })
    })

    it('should have venue value when user filters by venue', async () => {
      // Given
      await renderOffers(props, store)
      const venueSelect = screen.getByDisplayValue(ALL_VENUES_OPTION.displayName, {
        selector: 'select[name="lieu"]',
      })

      // When
      await waitFor(() => fireEvent.change(venueSelect, { target: { value: proVenues[0].id } }))
      fireEvent.click(screen.getByText('Lancer la recherche'))

      // Then
      await waitFor(() => {
        expect(props.query.change).toHaveBeenCalledWith({
          lieu: proVenues[0].id,
          categorie: null,
          creation: null,
          nom: null,
          'periode-evenement-debut': null,
          'periode-evenement-fin': null,
          statut: null,
          structure: null,
        })
      })
    })

    it('should have venue value be removed when user asks for all venues', async () => {
      // Given
      pcapi.loadTypes.mockResolvedValue([
        { value: 'test_id_1', proLabel: 'My test value' },
        { value: 'test_id_2', proLabel: 'My second test value' },
      ])

      await renderOffers(props, store)
      const typeSelect = screen.getByDisplayValue(ALL_TYPES_OPTION.displayName, {
        selector: 'select[name="type"]',
      })

      // When
      fireEvent.change(typeSelect, { target: { value: 'test_id_1' } })
      fireEvent.click(screen.getByText('Lancer la recherche'))

      // Then
      await waitFor(() => {
        expect(props.query.change).toHaveBeenCalledWith({
          categorie: 'test_id_1',
          creation: null,
          lieu: null,
          nom: null,
          'periode-evenement-debut': null,
          'periode-evenement-fin': null,
          statut: null,
          structure: null,
        })
      })
    })

    it('should have status value when user filters by status', async () => {
      // Given
      props.offers = [{ id: 'KE', availabilityMessage: 'Pas de stock' }]
      await renderOffers(props, store)
      fireEvent.click(screen.getByAltText('Afficher ou masquer le filtre par statut'))
      fireEvent.click(screen.getByLabelText('Épuisée'))

      // When
      fireEvent.click(screen.getByText('Appliquer'))

      // Then
      await waitFor(() => {
        expect(props.query.change).toHaveBeenLastCalledWith({
          statut: 'epuisee',
          categorie: null,
          creation: null,
          lieu: null,
          nom: null,
          'periode-evenement-debut': null,
          'periode-evenement-fin': null,
          structure: null,
        })
      })
    })

    it('should have status value be removed when user ask for all status', async () => {
      // Given
      props.offers = [{ id: 'KE', availabilityMessage: 'Pas de stock' }]
      await renderOffers(props, store)
      fireEvent.click(screen.queryByAltText('Afficher ou masquer le filtre par statut'))
      fireEvent.click(screen.queryByLabelText('Tous'))

      // When
      fireEvent.click(screen.queryByText('Appliquer'))

      // Then
      expect(props.query.change).toHaveBeenLastCalledWith({
        categorie: null,
        creation: null,
        lieu: null,
        nom: null,
        'periode-evenement-debut': null,
        'periode-evenement-fin': null,
        statut: null,
        structure: null,
      })
    })

    it('should have offerer filter when user filters by offerer', async () => {
      // Given
      props.query.parse.mockReturnValueOnce({ structure: 'A4' })
      props.getOfferer.mockResolvedValueOnce({ name: 'La structure' })

      // When
      renderOffers(props, store)

      // Then
      await waitFor(() => expect(screen.queryByText('La structure')).not.toBeNull())
    })

    it('should have offerer value be removed when user removes offerer filter', async () => {
      // Given
      props.query.parse.mockReturnValueOnce({ structure: 'A4' })
      props.getOfferer.mockResolvedValueOnce({ name: 'La structure' })
      await renderOffers(props, store)

      // When
      await fireEvent.click(screen.getByAltText('Supprimer le filtre par structure'))

      // Then
      expect(screen.queryByText('La structure')).not.toBeInTheDocument()
    })

    it('should have creation mode value when user filters by creation mode', async () => {
      // Given
      renderOffers(props, store)

      // When
      fireEvent.change(screen.getByDisplayValue('Tous les modes'), { target: { value: 'manual' } })
      await fireEvent.click(screen.getByText('Lancer la recherche'))

      // Then
      expect(props.query.change).toHaveBeenLastCalledWith({
        creation: 'manuelle',
        categorie: null,
        lieu: null,
        nom: null,
        'periode-evenement-debut': null,
        'periode-evenement-fin': null,
        statut: null,
        structure: null,
      })
    })

    it('should have creation mode value be removed when user ask for all creation modes', async () => {
      // Given
      renderOffers(props, store)
      const searchButton = screen.getByText('Lancer la recherche')
      fireEvent.change(screen.getByDisplayValue('Tous les modes'), { target: { value: 'manual' } })
      fireEvent.click(searchButton)

      // When
      fireEvent.change(screen.getByDisplayValue('Manuelle'), {
        target: { value: DEFAULT_CREATION_MODE.id },
      })
      await fireEvent.click(searchButton)

      // Then
      expect(props.query.change).toHaveBeenLastCalledWith({
        categorie: null,
        creation: null,
        lieu: null,
        nom: null,
        'periode-evenement-debut': null,
        'periode-evenement-fin': null,
        statut: null,
        structure: null,
      })
    })
  })

  describe('when leaving page', () => {
    it('should close offers activation / deactivation notification', () => {
      // Given
      props = {
        ...props,
        closeNotification: jest.fn(),
        notification: {
          tag: 'offers-activation',
        },
      }
      const { unmount } = renderOffers(props, store)

      // When
      unmount()

      // Then
      expect(props.closeNotification).toHaveBeenCalledWith()
    })

    it('should not fail on null notification', () => {
      // Given
      props = {
        ...props,
        closeNotification: jest.fn(),
        notification: null,
      }
      const { unmount } = renderOffers(props, store)

      // When
      unmount()

      // Then
      expect(props.closeNotification).not.toHaveBeenCalledWith()
    })

    it('should deselect all offers', () => {
      // Given
      props = {
        ...props,
        closeNotification: jest.fn(),
        notification: {
          tag: 'offers-activation',
        },
      }
      const { unmount } = renderOffers(props, store)

      // When
      unmount()

      // Then
      expect(props.setSelectedOfferIds).toHaveBeenLastCalledWith([])
    })

    it('should hide action bar', () => {
      // Given
      props = {
        ...props,
        closeNotification: jest.fn(),
        notification: {
          tag: 'offers-activation',
        },
      }
      const { unmount } = renderOffers(props, store)

      // When
      unmount()

      // Then
      expect(props.hideActionsBar).toHaveBeenCalledWith()
    })
  })

  describe('page navigation', () => {
    it('should display next page when clicking on right arrow', async () => {
      // Given
      props.loadOffers.mockResolvedValueOnce({ page: 1, pageCount: 4, offersCount: 5 })
      renderOffers(props, store)
      let nextIcon
      await waitFor(() => (nextIcon = screen.getByAltText('Aller à la page suivante')))

      // When
      fireEvent.click(nextIcon)

      // Then
      expect(props.loadOffers).toHaveBeenLastCalledWith({
        page: 2,
        creationMode: DEFAULT_SEARCH_FILTERS.creationMode,
        name: DEFAULT_SEARCH_FILTERS.name,
        venueId: DEFAULT_SEARCH_FILTERS.venueId,
        typeId: DEFAULT_SEARCH_FILTERS.typeId,
        offererId: DEFAULT_SEARCH_FILTERS.offererId,
        status: DEFAULT_SEARCH_FILTERS.status,
        periodBeginningDate: DEFAULT_SEARCH_FILTERS.periodBeginningDate,
        periodEndingDate: DEFAULT_SEARCH_FILTERS.periodEndingDate,
      })
    })

    it('should display previous page when clicking on left arrow', async () => {
      // Given
      props.loadOffers.mockResolvedValueOnce({ page: 2, pageCount: 2, offersCount: 5 })

      renderOffers(props, store)
      let nextIcon
      await waitFor(() => (nextIcon = screen.getByAltText('Aller à la page suivante')))

      // When
      fireEvent.click(nextIcon)

      // Then
      expect(props.loadOffers).toHaveBeenLastCalledWith({
        page: DEFAULT_PAGE,
        creationMode: DEFAULT_SEARCH_FILTERS.creationMode,
        name: DEFAULT_SEARCH_FILTERS.name,
        venueId: DEFAULT_SEARCH_FILTERS.venueId,
        typeId: DEFAULT_SEARCH_FILTERS.typeId,
        offererId: DEFAULT_SEARCH_FILTERS.offererId,
        status: DEFAULT_SEARCH_FILTERS.status,
        periodBeginningDate: DEFAULT_SEARCH_FILTERS.periodBeginningDate,
        periodEndingDate: DEFAULT_SEARCH_FILTERS.periodEndingDate,
      })
    })

    it('should not be able to click on previous arrow when being on the first page', async () => {
      // Given
      props.query.parse.mockReturnValue({ page: DEFAULT_PAGE })

      // When
      const wrapper = await mountOffers(props, store)

      // Then
      // jsdom, used by RTL, always trigger the event for disabled button.
      // to be migrate to RTL on a future release
      wrapper.update()
      const rightArrow = wrapper.find('img[alt="Aller à la page précédente"]').closest('button')
      expect(rightArrow.prop('disabled')).toBe(true)
    })

    it('should not be able to click on next arrow when being on the last page', async () => {
      // Given
      props.loadOffers.mockResolvedValueOnce({ page: 2, pageCount: 2, offersCount: 5 })

      // When
      const wrapper = await mountOffers(props, store)

      // Then
      // jsdom, used by RTL, always trigger the event for disabled button.
      // to be migrate to RTL on a future release
      wrapper.update()
      const rightArrow = wrapper.find('img[alt="Aller à la page suivante"]').closest('button')
      expect(rightArrow.prop('disabled')).toBe(true)
    })
  })

  describe('offers selection', () => {
    it('should display actionBar when at least one offer is selected', async () => {
      // Given
      renderOffers(props, store)
      let checkbox
      await waitFor(() => (checkbox = screen.getByTestId('select-offer-N9')))

      // When
      fireEvent.click(checkbox)

      // Then
      expect(props.showActionsBar).toHaveBeenCalledWith()
    })

    it('should hide actionBar when all offers are unselected', async () => {
      // Given
      props.selectedOfferIds = ['N9']
      renderOffers(props, store)
      let checkbox
      await waitFor(() => (checkbox = screen.getByTestId('select-offer-N9', { checked: true })))

      // When
      fireEvent.click(checkbox)

      // Then
      expect(props.hideActionsBar).toHaveBeenCalledWith()
    })

    describe('on click on select all offers checkbox', () => {
      it('should display "Tout désélectionner" when initial label was "Tout sélectionner"', async () => {
        // Given
        await renderOffers(props, store)

        // When
        fireEvent.click(screen.getByLabelText('Tout sélectionner'))

        // Then
        expect(screen.queryByLabelText('Tout désélectionner')).toBeInTheDocument()
      })

      it('should check all offers checkboxes', async () => {
        // Given
        props.offers = [
          {
            id: 'M4',
            isActive: true,
            isEditable: true,
            isFullyBooked: false,
            isEvent: true,
            isThing: false,
            hasBookingLimitDatetimesPassed: false,
            name: 'My little offer',
            thumbUrl: '/my-fake-thumb',
            venueId: 'JI',
          },
          {
            id: 'AE3',
            isActive: true,
            isEditable: true,
            isFullyBooked: true,
            isEvent: false,
            isThing: true,
            hasBookingLimitDatetimesPassed: false,
            name: 'My other offer',
            thumbUrl: '/my-other-fake-thumb',
            venueId: 'JI',
          },
        ]
        await renderOffers(props, store)

        // When
        fireEvent.click(screen.getByLabelText('Tout sélectionner'))

        // Then
        expect(props.setSelectedOfferIds).toHaveBeenCalledWith(['M4', 'AE3'])
      })

      it('should uncheck all offers checkboxes when already checked', async () => {
        // Given
        props.offers = [
          {
            id: 'M4',
            isActive: true,
            isEditable: true,
            isFullyBooked: false,
            isEvent: true,
            isThing: false,
            hasBookingLimitDatetimesPassed: false,
            name: 'My little offer',
            thumbUrl: '/my-fake-thumb',
            venueId: 'JI',
          },
          {
            id: 'AE3',
            isActive: true,
            isEditable: true,
            isFullyBooked: true,
            isEvent: false,
            isThing: true,
            hasBookingLimitDatetimesPassed: false,
            name: 'My other offer',
            thumbUrl: '/my-other-fake-thumb',
            venueId: 'JI',
          },
        ]
        await renderOffers(props, store)
        fireEvent.click(screen.getByLabelText('Tout sélectionner'))

        // When
        fireEvent.click(screen.getByLabelText('Tout désélectionner'))

        // Then
        expect(props.setSelectedOfferIds).toHaveBeenCalledWith([])
      })
    })
  })
})
