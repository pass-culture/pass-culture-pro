import React from 'react'
import { shallow } from 'enzyme'

import Offerers from '../Offerers'
import OffererItemContainer from '../OffererItem/OffererItemContainer'
import PendingOffererItem from '../OffererItem/PendingOffererItem'

describe('src | components | pages | Offerers | Offerers', () => {
  let props

  beforeEach(() => {
    props = {
      assignData: jest.fn(),
      closeNotification: jest.fn(),
      currentUser: {},
      loadOfferers: jest.fn(),
      resetLoadedOfferers: jest.fn(),
      offerers: [{ id: 'AE', siren: '1234567' }],
      pagination: {
        apiQuery: {
          keywords: null,
        },
      },
      query: {
        change: jest.fn(),
        parse: () => ({ 'mots-cles': null }),
      },
      showNotification: jest.fn(),
      location: {
        search: '',
      },
    }
  })

  it('should match the snapshot', () => {
    // when
    const wrapper = shallow(<Offerers {...props} />)

    // then
    expect(wrapper).toMatchSnapshot()
  })

  describe('render', () => {
    describe('when loading the offerer list', () => {
      it('should transmit keywords', () => {
        // given
        jest.spyOn(props.query, 'parse').mockReturnValue({
          de: 'Balzac',
          lieu: 'B3',
          'mots-cles': ['Honoré', 'Justice'],
        })

        // when
        shallow(<Offerers {...props} />)

        // then
        expect(props.loadOfferers).toHaveBeenCalledWith(expect.anything(), expect.anything(), {
          keywords: 'from=Balzac&keywords=Honor%C3%A9&keywords=Justice&venueId=B3',
        })
      })

      describe('when the current user is an admin', () => {
        it('should load all the offerers', () => {
          // given
          props.currentUser = { isAdmin: true }

          // when
          shallow(<Offerers {...props} />)

          // then
          expect(props.loadOfferers).toHaveBeenCalledWith(expect.anything(), expect.anything(), {
            isValidated: true,
            keywords: 'keywords',
          })
        })
      })

      describe('when the current user is pro user but not admin', () => {
        it('should load all the offerers without validated filter', () => {
          // given
          props.currentUser = { isAdmin: false }

          // when
          shallow(<Offerers {...props} />)

          // then
          expect(props.loadOfferers).toHaveBeenCalledWith(expect.anything(), expect.anything(), {
            keywords: 'keywords',
          })
        })
      })
    })

    describe('should pluralize offerers menu link', () => {
      it('should display Votre structure when one offerer', () => {
        // given
        props.currentUser = {}
        props.offerers = [{ id: 'AE' }]

        // when
        const wrapper = shallow(<Offerers {...props} />)
        const heroSection = wrapper.find('HeroSection').props()

        // then
        expect(heroSection.title).toStrictEqual('Votre structure juridique')
      })

      it('should display Vos structures when many offerers', () => {
        // given
        props.currentUser = {}
        props.offerers = [{ id: 'AE' }, { id: 'AF' }]

        // when
        const wrapper = shallow(<Offerers {...props} />)
        const heroSection = wrapper.find('HeroSection').props()

        // then
        expect(heroSection.title).toStrictEqual('Vos structures juridiques')
      })
    })

    describe('when leaving page', () => {
      it('should not close notifcation', () => {
        // given
        props = { ...props, closeNotification: jest.fn() }
        const wrapper = shallow(<Offerers {...props} />)

        // when
        wrapper.unmount()

        // then
        expect(props.closeNotification).not.toHaveBeenCalled()
      })

      it('should close offerer notifcation', () => {
        // given
        props = {
          ...props,
          closeNotification: jest.fn(),
          notification: {
            tag: 'offerers',
          },
        }
        const wrapper = shallow(<Offerers {...props} />)

        // when
        wrapper.unmount()

        // then
        expect(props.closeNotification).toHaveBeenCalledWith()
      })

      it('should not fail on null notifcation', () => {
        // given
        props = {
          ...props,
          closeNotification: jest.fn(),
          notification: null,
        }
        const wrapper = shallow(<Offerers {...props} />)

        // when
        wrapper.unmount()

        // then
        expect(props.closeNotification).not.toHaveBeenCalledWith()
      })
    })

    describe('when displaying the list of offerers', () => {
      describe('when the offerer is active and the user has access to it', () => {
        it('should render an active offerer item in the list for each activated offerer', () => {
          // given
          const offerer = { id: 'B2', isValidated: true, userHasAccess: true }
          props.offerers = [offerer]

          // when
          const wrapper = shallow(<Offerers {...props} />)

          // then
          const offererItem = wrapper.find(OffererItemContainer)
          expect(offererItem).toHaveLength(1)
          expect(offererItem.at(0).prop('offerer')).toStrictEqual(offerer)
        })
      })

      describe('when offerer is not active for the user', () => {
        describe('when the offerer is not active', () => {
          it('should render a pending offerer item', () => {
            // given
            const offerer = { id: 'B2', siren: '1431', isValidated: false, userHasAccess: true }
            props.offerers = [offerer]

            // when
            const wrapper = shallow(<Offerers {...props} />)

            // then
            const offererItem = wrapper.find(PendingOffererItem)
            expect(offererItem).toHaveLength(1)
            expect(offererItem.at(0).prop('offerer')).toStrictEqual(offerer)
          })
        })

        describe('when the user does not have access', () => {
          it('should render a pending offerer item', () => {
            // given
            const offerer = { id: 'B2', siren: '1431', isValidated: true, userHasAccess: false }
            props.offerers = [offerer]

            // when
            const wrapper = shallow(<Offerers {...props} />)

            // then
            const offererItem = wrapper.find(PendingOffererItem)
            expect(offererItem).toHaveLength(1)
            expect(offererItem.at(0).prop('offerer')).toStrictEqual(offerer)
          })
        })
      })
    })
  })
})
