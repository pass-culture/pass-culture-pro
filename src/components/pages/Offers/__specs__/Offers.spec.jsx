import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { mount } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'

import configureStore from 'store'
import { initialState as actionsBarInitialState } from 'store/reducers/actionsBar'
import { initialState as dataInitialState } from 'store/reducers/data'
import { initialState as modalInitialState } from 'store/reducers/modal'
import { initialState as offersInitialState } from 'store/reducers/offers'
import { fetchAllVenuesByProUser } from 'services/venuesService'
import { queryByTextTrimHtml } from 'utils/testHelpers'

import { ALL_OFFERS, ALL_VENUES, ALL_VENUES_OPTION, DEFAULT_PAGE } from '../_constants'
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

jest.mock('services/venuesService', () => ({
  ...jest.requireActual('services/venuesService'),
  fetchAllVenuesByProUser: jest.fn(),
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
    change = jest.fn()
    parse = jest.fn().mockReturnValue({})
    currentUser = { id: 'EY', isAdmin: false, name: 'Current User', publicName: 'USER' }
    store = configureStore({
      actionsBar: actionsBarInitialState,
      data: {
        ...dataInitialState,
        users: [currentUser],
        venues: [{ id: 'JI', name: 'Venue' }],
      },
      modal: modalInitialState,
      offers: offersInitialState,
    }).store

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
      setSelectedOfferIds: jest.fn(),
      setActionsVisibility: jest.fn(),
      venue: { name: 'Ma Venue', id: 'JI' },
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
        nameSearchValue: ALL_OFFERS,
        page: DEFAULT_PAGE,
        selectedVenueId: ALL_VENUES,
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
          { id: [ALL_VENUES_OPTION.displayName.id], value: ALL_VENUES_OPTION.displayName },
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
    })
  })

  describe('on click on search button', () => {
    it('should load offers with default filters when no changes where made', async () => {
      // Given
      renderOffers(props, store)

      // When
      fireEvent.click(screen.getByText('Lancer la recherche'))

      // Then
      await waitFor(() => {
        expect(props.loadOffers).toHaveBeenCalledWith({
          nameSearchValue: ALL_OFFERS,
          page: DEFAULT_PAGE,
          selectedVenueId: ALL_VENUES,
        })
      })
    })

    it('should load offers with written offer name filter', async () => {
      // Given
      renderOffers(props, store)

      // When
      fireEvent.change(screen.getByPlaceholderText('Rechercher par nom d’offre'), {
        target: { value: 'Any word' },
      })
      fireEvent.click(screen.getByText('Lancer la recherche'))

      // Then
      await waitFor(() => {
        expect(props.loadOffers).toHaveBeenCalledWith({
          nameSearchValue: 'Any word',
          page: DEFAULT_PAGE,
          selectedVenueId: ALL_VENUES,
        })
      })
    })

    it('should load offers with selected venue filter', async () => {
      // Given
      renderOffers(props, store)
      const venueSelect = screen.getByDisplayValue(ALL_VENUES_OPTION.displayName, {
        selector: 'select[name="lieu"]',
      })

      // When
      await waitFor(() => fireEvent.change(venueSelect, { target: { value: proVenues[0].id } }))
      fireEvent.click(screen.getByText('Lancer la recherche'))

      // Then
      await waitFor(() => {
        expect(props.loadOffers).toHaveBeenCalledWith({
          nameSearchValue: ALL_OFFERS,
          page: DEFAULT_PAGE,
          selectedVenueId: proVenues[0].id,
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

  describe('deactivate all offers from a venue', () => {
    it('should be displayed when offers and venue are given', () => {
      // Given
      jest.spyOn(props.query, 'parse').mockReturnValue({ lieu: 'GY' })

      // When
      renderOffers(props, store)

      // Then
      expect(screen.queryByText('Désactiver toutes les offres')).not.toBeNull()
    })

    it('should not be displayed when venue is missing', () => {
      // Given
      jest.spyOn(props.query, 'parse').mockReturnValue({ lieu: undefined })

      // When
      renderOffers(props, store)

      // Then
      expect(screen.queryByText('Désactiver toutes les offres')).toBeNull()
    })

    it('should not be displayed when offers are missing', () => {
      // Given
      jest.spyOn(props.query, 'parse').mockReturnValue({ lieu: 'GY' })
      props.offers = []

      // When
      renderOffers(props, store)

      // Then
      expect(screen.queryByText('Désactiver toutes les offres')).toBeNull()
    })

    it('should send a request to api when clicked', async () => {
      // Given
      jest.spyOn(props.query, 'parse').mockReturnValue({ lieu: 'GY' })

      // Given
      renderOffers(props, store)

      // When
      fireEvent.click(screen.queryByText('Désactiver toutes les offres'))

      // Then
      await waitFor(() =>
        expect(props.handleOnDeactivateAllVenueOffersClick).toHaveBeenCalledWith('GY')
      )
    })
  })

  describe('activate all offers from a venue', () => {
    it('should be displayed when offers and venue are given', () => {
      // Given
      jest.spyOn(props.query, 'parse').mockReturnValue({ lieu: 'GY' })

      // When
      renderOffers(props, store)

      // Then
      expect(screen.queryByText('Activer toutes les offres')).not.toBeNull()
    })

    it('should not be displayed when venue is missing', () => {
      // Given
      jest.spyOn(props.query, 'parse').mockReturnValue({ lieu: undefined })

      // When
      renderOffers(props, store)

      // Then
      expect(screen.queryByText('Activer toutes les offres')).toBeNull()
    })

    it('should not be displayed when offers are missing', () => {
      // Given
      jest.spyOn(props.query, 'parse').mockReturnValue({ lieu: 'GY' })
      props.offers = []

      // When
      renderOffers(props, store)

      // Then
      expect(screen.queryByText('Activer toutes les offres')).toBeNull()
    })

    it('should send a request to api when clicked', async () => {
      // Given
      jest.spyOn(props.query, 'parse').mockReturnValue({ lieu: 'GY' })

      renderOffers(props, store)

      // When
      fireEvent.click(screen.queryByText('Activer toutes les offres'))

      // Then
      await waitFor(() =>
        expect(props.handleOnDeactivateAllVenueOffersClick).toHaveBeenCalledWith('GY')
      )
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
          lieu: null,
          nom: null,
          page: 2,
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
          lieu: null,
          nom: null,
          page: null,
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
          lieu: null,
          nom: 'AnyWord',
          page: null,
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
          name: 'search string',
          page: DEFAULT_PAGE,
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
          lieu: null,
          nom: null,
          page: null,
        })
      })
    })

    it('should have venue value when user filter by venue', async () => {
      // Given
      renderOffers(props, store)
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
          nom: null,
          page: null,
        })
      })
    })

    it('should have venue value be removed when user ask for all venues', async () => {
      // Given
      renderOffers(props, store)
      const venueSelect = screen.getByDisplayValue(ALL_VENUES_OPTION.displayName, {
        selector: 'select[name="lieu"]',
      })

      // When
      await waitFor(() => fireEvent.change(venueSelect, { target: { value: ALL_VENUES } }))
      fireEvent.click(screen.getByText('Lancer la recherche'))

      // Then
      await waitFor(() => {
        expect(props.query.change).toHaveBeenCalledWith({
          lieu: null,
          nom: null,
          page: null,
        })
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
        nameSearchValue: ALL_OFFERS,
        page: 2,
        selectedVenueId: ALL_VENUES,
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
        nameSearchValue: ALL_OFFERS,
        page: DEFAULT_PAGE,
        selectedVenueId: ALL_VENUES,
      })
    })

    it('should not be able to click on previous arrow when being on the first page', async () => {
      // Given
      props.query.parse.mockReturnValue({ page: DEFAULT_PAGE })

      // When
      const wrapper = await mountOffers(props, store)

      // Then
      // FIXME (rlecellier) : We should test that "props.loadOffers" isn't call on next button click.
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
      // FIXME (rlecellier) : We should test that "props.loadOffers" isn't call on next button click.
      // jsdom, used by RTL, always trigger the event for disabled button.
      // to be migrate to RTL on a future release
      wrapper.update()
      const rightArrow = wrapper.find('img[alt="Aller à la page suivante"]').closest('button')
      expect(rightArrow.prop('disabled')).toBe(true)
    })
  })

  describe('offers selection interaction with action bar', () => {
    it('should display/hide actionBar when offers selection change', async () => {
      // Given
      renderOffers(props, store)
      let checkbox
      await waitFor(() => (checkbox = screen.getByTestId('select-offer-N9')))

      // When
      fireEvent.click(checkbox)

      // Then
      await waitFor(() => expect(props.setActionsVisibility).toHaveBeenLastCalledWith(true))
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
      await waitFor(() => expect(props.setActionsVisibility).toHaveBeenLastCalledWith(false))
    })
  })
})
