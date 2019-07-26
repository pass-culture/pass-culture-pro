import React from 'react'
import { shallow } from 'enzyme'
import { NavLink } from 'react-router-dom'

import Offers from '../Offers'
import OfferItem from '../OfferItem/OfferItemContainer'
import mockedOffers from './offersMock'

const dispatchMock = jest.fn()
const queryChangeMock = jest.fn()
const initialProps = {
  currentUser: {},
  dispatch: dispatchMock,
  offers: [],
  location: {
    pathname: '/offres',
  },
  pagination: {
    apiQuery: {
      keywords: null,
      offererId: null,
      orderBy: 'offer.id+desc',
      venueId: null,
    },
  },
  query: {
    change: queryChangeMock,
    parse: () => ({ orderBy: 'offer.id desc' }),
  },
  search: '',
  types: [],
}

describe('src | components | pages | Offers | Offers', () => {
  describe('snapshot', () => {
    it('should match snapshot', () => {
      // when
      const wrapper = shallow(<Offers {...initialProps} />)

      // then
      expect(wrapper).toBeDefined()
      expect(wrapper).toMatchSnapshot()
      dispatchMock.mockClear()
      queryChangeMock.mockClear()
    })
  })

  describe('render', () => {
    describe('when arriving on index page', () => {
      it('should list all offers', () => {
        // given
        const expected = {
          hasMore: false,
          isLoading: true,
        }

        // when
        const wrapper = shallow(<Offers {...initialProps} />)

        // then
        expect(wrapper.state()).toStrictEqual(expected)
        dispatchMock.mockClear()
        queryChangeMock.mockClear()
      })
    })
    describe('offerItem', () => {
      it('should render items corresponding to offers', () => {
        // given
        initialProps.offers = mockedOffers

        // when
        const wrapper = shallow(<Offers {...initialProps} />)
        const offerItem = wrapper.find(OfferItem)

        // then
        expect(offerItem).toHaveLength(mockedOffers.length)
      })
    })
    describe('when offers shown for an offerer or a venue', () => {
      describe('navLink to create offer', () => {
        describe('when user isAdmin', () => {
          it('should display NavLink', () => {
            // given
            initialProps.currentUser = {
              isAdmin: true,
            }

            // when
            const wrapper = shallow(<Offers {...initialProps} />)
            const navLink = wrapper.find(NavLink)

            // then
            expect(navLink).toHaveLength(0)
          })
        })
        describe('when structure (or offererId)', () => {
          it('should render link properly', () => {
            // given
            initialProps.currentUser = {
              isAdmin: false,
            }
            const parseMock = () => ({ structure: 'TEST' })
            initialProps.query.parse = parseMock

            // when
            const wrapper = shallow(<Offers {...initialProps} />)

            const navLink = wrapper.find(NavLink)

            // then
            expect(navLink).toHaveLength(1)
            expect(navLink.props().to).toStrictEqual('/offres/creation?structure=TEST')
          })
        })
        describe('when lieu or (VenueId)', () => {
          it('should render link properly', () => {
            // given
            initialProps.currentUser = {
              isAdmin: false,
            }
            const parseMock = () => ({ lieu: 'LIEU' })
            initialProps.query.parse = parseMock

            // when
            const wrapper = shallow(<Offers {...initialProps} />)

            const navLink = wrapper.find(NavLink)

            // then
            expect(navLink).toHaveLength(1)
            expect(navLink.props().to).toStrictEqual('/offres/creation?lieu=LIEU')
          })
        })
      })
    })
  })

  describe('functions', () => {
    describe('constructor', () => {
      it('should dispatch assignData when component is constructed', () => {
        // when
        shallow(<Offers {...initialProps} />)
        const expectedAssignData = {
          patch: {
            offers: [],
          },
          type: 'ASSIGN_DATA',
        }

        // then
        expect(dispatchMock.mock.calls[0][0]).toStrictEqual(expectedAssignData)
        dispatchMock.mockClear()
        queryChangeMock.mockClear()
      })
    })

    describe('componentDidMount', () => {
      describe('when there is no pagination', () => {
        it('should dispatch handle RequestData', () => {
          // given
          const parseMock = () => ({
            keywords: 'océan',
            orderBy: 'offer.id desc',
          })
          initialProps.query.parse = parseMock

          // when
          const wrapper = shallow(<Offers {...initialProps} />)
          wrapper.instance().componentDidMount()
          const expected = {
            config: {
              apiPath: '/types',
              method: 'GET',
            },
            type: 'REQUEST_DATA_GET_/TYPES',
          }

          // then
          expect(dispatchMock.mock.calls[1][0]).toStrictEqual(expected)
          dispatchMock.mockClear()
        })
      })
    })

    describe('componentDidUpdate', () => {
      describe('when location has change', () => {
        it('should dispatch assignData when component is rendered', () => {
          // given
          const prevProps = initialProps

          initialProps.location = {
            pathname: '/offres',
            search: '?orderBy=offer.id+desc',
          }

          // when
          const wrapper = shallow(<Offers {...initialProps} />)
          wrapper.instance().componentDidUpdate(prevProps)

          const expectedAssignData = {
            config: {
              apiPath: '/types',
              method: 'GET',
            },
            type: 'REQUEST_DATA_GET_/TYPES',
          }

          // the
          expect(dispatchMock.mock.calls[1][0]).toStrictEqual(expectedAssignData)

          dispatchMock.mockClear()
        })
      })
    })

    describe('handleOnSubmit', () => {
      // when
      const wrapper = shallow(<Offers {...initialProps} />)
      const event = Object.assign(jest.fn(), {
        preventDefault: () => {},
        target: {
          elements: {
            search: {
              value: 'AnyWord',
            },
          },
        },
      })

      describe('when keywords is not an empty string', () => {
        it('should update state with isLoading to true', () => {
          // when
          wrapper.instance().handleOnSubmit(event)
          const expected = {
            hasMore: false,
            isLoading: true,
          }

          // then
          expect(wrapper.state()).toStrictEqual(expected)
        })

        it('should dispatch assignData with good params', () => {
          // when
          wrapper.instance().handleOnSubmit(event)

          const expected = {
            patch: {
              offers: [],
            },
            type: 'ASSIGN_DATA',
          }

          // then
          expect(dispatchMock.mock.calls[0][0]).toStrictEqual(expected)
          dispatchMock.mockClear()
        })

        it('should change query', () => {
          // when
          wrapper.instance().handleOnSubmit(event)
          const expected = {
            'mots-cles': 'AnyWord',
            page: null,
          }

          // then
          expect(queryChangeMock.mock.calls[0][0]).toStrictEqual(expected)
          queryChangeMock.mockClear()
        })
      })

      describe('when keywords is an empty string', () => {
        it('should change query with mots-clés setted to null', () => {
          // given
          const eventEmptyWord = Object.assign(jest.fn(), {
            preventDefault: () => {},
            target: {
              elements: {
                search: {
                  value: '',
                },
              },
            },
          })

          // when
          wrapper.instance().handleOnSubmit(eventEmptyWord)
          const expected = {
            'mots-cles': null,
            page: null,
          }

          // then
          expect(queryChangeMock.mock.calls[0][0]).toStrictEqual(expected)
          queryChangeMock.mockClear()
        })
      })
    })
  })
})
