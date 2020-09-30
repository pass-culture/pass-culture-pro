import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter, Router } from 'react-router'

import * as usersSelectors from '../../../../selectors/data/usersSelectors'
import { getStubStore } from '../../../../utils/stubStore'
import Offers, { createLinkToOfferCreation } from '../Offers'

describe('src | components | pages | Offers | Offers', () => {
  let change
  let parse
  let props
  let currentUser
  let store
  let history

  beforeEach(() => {
    jest.spyOn(window, 'scrollTo').mockImplementation(() => {})
    change = jest.fn()
    parse = jest.fn().mockReturnValue({})
    currentUser = { isAdmin: false, name: 'Current User', publicName: 'USER' }
    store = getStubStore({
      data: (
        state = {
          offerers: [],
          users: [{ publicName: 'User', id: 'EY', name: 'User' }],
          venues: [{ id: 'JI', name: 'Venue' }],
        },
      ) => state,
      modal: (
        state = {
          config: {},
        },
      ) => state,
    })
    history = createMemoryHistory()

    props = {
      closeNotification: jest.fn(),
      currentUser,
      handleOnActivateAllVenueOffersClick: jest.fn(),
      handleOnDeactivateAllVenueOffersClick: jest.fn(),
      loadOffers: jest.fn(),
      loadTypes: jest.fn(),
      location: {
        search: 'offres?lieu=AQ&structure=A4',
      },
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
      resetLoadedOffers: jest.fn(),
      types: [],
      venue: { name: 'Ma Venue', id: 'JI' },
    }
  })

  describe('render', () => {
    describe('when arriving on index page', () => {
      it('should list all offers', () => {
        // when
        mount(
          <Provider store={store}>
            <MemoryRouter>
              <Offers {...props} />
            </MemoryRouter>
          </Provider>,
        )

        // then
        expect(props.loadOffers).toHaveBeenCalledWith(
          {
            nameSearchValue: '',
            page: 1,
            venueId: undefined,
          },
          expect.any(Function),
          expect.any(Function),
        )
      })

      it('should display column titles when offers are returned', () => {
        // Given
        props.offers = [{ id: 'KE', availabilityMessage: 'Pas de stock', venueId: 'JI' }]

        // When
        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter>
              <Offers {...props} />
            </MemoryRouter>
          </Provider>,
        )

        // Then
        const venueColumn = wrapper.find({ children: 'Lieu' })
        const stockColumn = wrapper.find({ children: 'Stock' })
        expect(venueColumn).toHaveLength(1)
        expect(stockColumn).toHaveLength(1)
      })

      it('should not display column titles when no offers are returned', () => {
        // Given
        props.offers = []

        // When
        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter>
              <Offers {...props} />
            </MemoryRouter>
          </Provider>,
        )

        // Then
        const venueColumn = wrapper.find({ children: 'Lieu' })
        const stockColumn = wrapper.find({ children: 'Stock' })
        expect(venueColumn).toHaveLength(0)
        expect(stockColumn).toHaveLength(0)
      })
    })

    describe('venue filter', () => {
      it('should be displayed when venue is given', () => {
        // given
        props.venue = {
          name: 'La verbeuse',
        }

        // when
        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter>
              <Offers {...props} />
            </MemoryRouter>
          </Provider>,
        )

        const venueFilter = wrapper.findWhere(node => node.text() === 'Lieu : La verbeuse').first()

        // then
        expect(venueFilter).toHaveLength(1)
      })

      it('should not be displayed when venue is not given', () => {
        // given
        props.venue = null

        // when
        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter>
              <Offers {...props} />
            </MemoryRouter>
          </Provider>,
        )

        const venueFilter = wrapper.findWhere(node => node.text() === 'Lieu :').first()

        // then
        expect(venueFilter).toHaveLength(0)
      })

      it('should remove venue filter when clicking on it', () => {
        // given
        props.venue = {
          name: 'La verbeuse',
        }

        // when
        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter>
              <Offers {...props} />
            </MemoryRouter>
          </Provider>,
        )

        const venueFilter = wrapper
          .findWhere(node => node.text() === 'Lieu : La verbeuse')
          .first()
          .find('button')

        venueFilter.invoke('onClick')()

        // then
        expect(props.loadOffers).toHaveBeenCalledWith({
          "nameSearchValue": "",
          "page": 1,
          "venueId": undefined,
        }, expect.any(Function), expect.any(Function))
      })
    })

    describe('offerItem', () => {
      it('should render as much offer items as given in props', () => {
        // given
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

        // when
        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter>
              <Offers {...props} />
            </MemoryRouter>
          </Provider>,
        )

        const firstOfferItem = wrapper.find({ children: 'My little offer' }).first()
        const secondOfferItem = wrapper.find({ children: 'My other offer' }).first()

        // then
        expect(firstOfferItem).toHaveLength(1)
        expect(secondOfferItem).toHaveLength(1)
      })
    })

    describe('navLink to create offer', () => {
      describe('when user isAdmin', () => {
        it('should not display the link', () => {
          // given
          props.currentUser = {
            isAdmin: true,
          }

          // when
          const wrapper = mount(
            <Provider store={store}>
              <MemoryRouter>
                <Offers {...props} />
              </MemoryRouter>
            </Provider>,
          )
          const navLink = wrapper.find({ children: 'Créer une offre' })

          // then
          expect(navLink).toHaveLength(0)
        })
      })

      describe('when user is not admin', () => {
        it('should display a link to create an offer', () => {
          // given
          props.currentUser.isAdmin = false
          jest
            .spyOn(usersSelectors, 'selectCurrentUser')
            .mockReturnValue({ currentUser: props.currentUser })

          // when
          const wrapper = mount(
            <Provider store={store}>
              <MemoryRouter>
                <Offers {...props} />
              </MemoryRouter>
            </Provider>,
          )
          const offerCreationLink = wrapper.find({ children: 'Créer une offre' }).parent()

          // then
          expect(offerCreationLink).toHaveLength(1)
          expect(offerCreationLink.prop('href')).toBe('/offres/creation')
        })
      })

      describe('when structure (or offererId)', () => {
        it('should render link properly', () => {
          // given
          jest
            .spyOn(usersSelectors, 'selectCurrentUser')
            .mockReturnValue({ currentUser: props.currentUser })
          jest.spyOn(props.query, 'parse').mockReturnValue({ structure: 'XY' })
          const wrapper = mount(
            <Provider store={store}>
              <Router history={history}>
                <Offers {...props} />
              </Router>
            </Provider>,
          )
          const offerCreationLink = wrapper.find({ children: 'Créer une offre' })

          // when
          offerCreationLink.simulate('click', { button: 0 })

          // then
          expect(history.location.pathname + history.location.search).toStrictEqual(
            '/offres/creation?structure=XY',
          )
        })
      })

      describe('when lieu or (VenueId)', () => {
        it('should render link properly', () => {
          // given
          jest
            .spyOn(usersSelectors, 'selectCurrentUser')
            .mockReturnValue({ currentUser: props.currentUser })
          jest.spyOn(props.query, 'parse').mockReturnValue({ lieu: 'G6' })

          const wrapper = mount(
            <Provider store={store}>
              <Router history={history}>
                <Offers {...props} />
              </Router>
            </Provider>,
          )
          const offerCreationLink = wrapper.find({ children: 'Créer une offre' })

          // when
          offerCreationLink.simulate('click', { button: 0 })

          // then
          expect(history.location.pathname + history.location.search).toStrictEqual(
            '/offres/creation?lieu=G6',
          )
        })
      })
    })

    describe('deactivate all offers from a venue', () => {
      it('should be displayed when offers and venue are given', () => {
        // when
        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter>
              <Offers {...props} />
            </MemoryRouter>
          </Provider>,
        )
        const deactivateButton = wrapper.find({ children: 'Désactiver toutes les offres' })

        // then
        expect(deactivateButton).toHaveLength(1)
      })

      it('should not be displayed when offers or venue is missing', () => {
        // given
        props.venue = null

        // when
        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter>
              <Offers {...props} />
            </MemoryRouter>
          </Provider>,
        )
        const deactivateButton = wrapper.find({ children: 'Désactiver toutes les offres' })

        // then
        expect(deactivateButton).toHaveLength(0)
      })

      it('should send a request to api when clicked', () => {
        // given
        props.venue = {
          id: 'GY',
          name: 'Le biennommé',
        }

        // given
        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter>
              <Offers {...props} />
            </MemoryRouter>
          </Provider>,
        )
        // when
        const deactivateButton = wrapper.find({ children: 'Désactiver toutes les offres' })
        deactivateButton.simulate('click')

        // then
        expect(props.handleOnDeactivateAllVenueOffersClick).toHaveBeenCalledWith({
          id: 'GY',
          name: 'Le biennommé',
        })
      })
    })

    describe('activate all offers from a venue', () => {
      it('should be displayed when offers and venue are given', () => {
        // given
        props.venue = {
          name: 'Le biennommé',
        }

        // when
        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter>
              <Offers {...props} />
            </MemoryRouter>
          </Provider>,
        )
        const activateButton = wrapper.find({ children: 'Activer toutes les offres' })

        // then
        expect(activateButton).toHaveLength(1)
      })

      it('should not be displayed when offers or venue is missing', () => {
        // given
        props.venue = null

        // when
        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter>
              <Offers {...props} />
            </MemoryRouter>
          </Provider>,
        )
        const activateButton = wrapper.find({ children: 'Activer toutes les offres' })

        // then
        expect(activateButton).toHaveLength(0)
      })

      it('should send a request to api when clicked', () => {
        // given
        props.venue = {
          id: 'GY',
          name: 'Le biennommé',
        }

        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter>
              <Offers {...props} />
            </MemoryRouter>
          </Provider>,
        )

        // when
        const activateButton = wrapper.find({ children: 'Activer toutes les offres' })
        activateButton.simulate('click')

        // then
        expect(props.handleOnActivateAllVenueOffersClick).toHaveBeenCalledWith({
          id: 'GY',
          name: 'Le biennommé',
        })
      })
    })

    describe('should render search offers form', () => {
      describe('when name search value is not an empty string', () => {
        it('should change query', () => {
          // given
          props.loadOffers.mockImplementation((_, handleSuccess) => handleSuccess())
          const wrapper = mount(
            <Provider store={store}>
              <MemoryRouter>
                <Offers {...props} />
              </MemoryRouter>
            </Provider>,
          )


          // when
          const searchInput = wrapper.find('input[placeholder="Rechercher par nom d’offre"]')
          const launchSearchButton = wrapper.find('form')
          searchInput.invoke('onChange')({ target: { value: 'AnyWord' } })
          launchSearchButton.invoke('onSubmit')({ preventDefault: jest.fn() })

          // then
          expect(props.query.change).toHaveBeenCalledWith({
            lieu: null,
            nom: 'AnyWord',
            page: undefined,
          })
        })
      })

      describe('when name search value is an empty string', () => {
        it('should change query with mots-clés set to null on form submit', () => {
          // given
          props.loadOffers.mockImplementation((_, handleSuccess) => handleSuccess())
          const wrapper = mount(
            <Provider store={store}>
              <MemoryRouter>
                <Offers {...props} />
              </MemoryRouter>
            </Provider>,
          )

          // when
          const searchInput = wrapper.find('input[placeholder="Rechercher par nom d’offre"]')
          const launchSearchButton = wrapper.find('form')
          searchInput.invoke('onChange')({ target: { value: '' } })
          launchSearchButton.invoke('onSubmit')({ preventDefault: jest.fn() })

          // then
          expect(props.query.change).toHaveBeenCalledWith({
            lieu: null,
            nom: null,
            page: undefined,
          })
        })
      })
    })

    describe('when leaving page', () => {
      it('should close offers activation / deactivation notification', () => {
        // given
        props = {
          ...props,
          closeNotification: jest.fn(),
          notification: {
            tag: 'offers-activation',
          },
        }
        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter>
              <Offers {...props} />
            </MemoryRouter>
          </Provider>,
        )

        // when
        wrapper.unmount()

        // then
        expect(props.closeNotification).toHaveBeenCalledWith()
      })

      it('should not fail on null notification', () => {
        // given
        props = {
          ...props,
          closeNotification: jest.fn(),
          notification: null,
        }
        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter>
              <Offers {...props} />
            </MemoryRouter>
          </Provider>,
        )
        // when
        wrapper.unmount()

        // then
        expect(props.closeNotification).not.toHaveBeenCalledWith()
      })
    })
  })

  describe('page navigation', () => {
    it('should display next page when clicking on right arrow', () => {
      // Given
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <Offers {...props} />
          </MemoryRouter>
        </Provider>,
      )
      const rightArrow = wrapper.find('img[alt="Aller à la page suivante"]').closest('button')

      // When
      rightArrow.invoke('onClick')()

      // Then
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
      expect(props.loadOffers).toHaveBeenLastCalledWith(
        {
          nameSearchValue: '',
          page: 2,
          venueId: undefined,
        },
        expect.any(Function),
        expect.any(Function),
      )
    })

    it('should display previous page when clicking on left arrow', () => {
      // Given
      props.query.parse.mockReturnValue({ page: 2 })
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <Offers {...props} />
          </MemoryRouter>
        </Provider>,
      )
      const rightArrow = wrapper.find('img[alt="Aller à la page précédente"]').closest('button')

      // When
      rightArrow.invoke('onClick')()

      // Then
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
      expect(props.loadOffers).toHaveBeenLastCalledWith(
        {
          nameSearchValue: '',
          page: 1,
          venueId: undefined,
        },
        expect.any(Function),
        expect.any(Function),
      )
    })

    it('should not be able to click on previous arrow when being on the first page', () => {
      // Given
      props.query.parse.mockReturnValue({ page: 1 })

      // When
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <Offers {...props} />
          </MemoryRouter>
        </Provider>,
      )

      // Then
      const rightArrow = wrapper.find('img[alt="Aller à la page précédente"]').closest('button')
      expect(rightArrow.prop('disabled')).toBe(true)
    })

    it('should not be able to click on next arrow when being on the last page', () => {
      // Given
      props.loadOffers.mockImplementation((_, handleSuccess) => handleSuccess(2, 2))

      // When
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <Offers {...props} />
          </MemoryRouter>
        </Provider>,
      )

      // Then
      const rightArrow = wrapper.find('img[alt="Aller à la page suivante"]').closest('button')
      expect(rightArrow.prop('disabled')).toBe(true)
    })
  })

  describe('createLinkToOfferCreation', () => {
    it('should create link when venue only is in path', () => {
      // given
      const venueId = 'TF'
      const offererId = undefined

      // when
      const result = createLinkToOfferCreation(venueId, offererId)

      // then
      expect(result).toStrictEqual('/offres/creation?lieu=TF')
    })

    it('should create link when offerer only is in path', () => {
      // given
      const venueId = undefined
      const offererId = 'TF'

      // when
      const result = createLinkToOfferCreation(venueId, offererId)

      // then
      expect(result).toStrictEqual('/offres/creation?structure=TF')
    })

    it('should create link when offerer and venue are in path', () => {
      // given
      const venueId = '7X'
      const offererId = 'TF'

      // when
      const result = createLinkToOfferCreation(venueId, offererId)

      // then
      expect(result).toStrictEqual('/offres/creation?structure=TF&lieu=7X')
    })
  })
})
