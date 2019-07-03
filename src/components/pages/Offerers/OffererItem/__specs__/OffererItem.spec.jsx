import React from 'react'
import { shallow } from 'enzyme'

import OffererItem from '../OffererItem'


describe('src | components | pages | Offerers | OffererItem', () => {
  let props
  let dispatch
  let query
  let parse


  const dispatchMock = jest.fn()
  const parseMock = () => ({ 'mots-cles': null })
  const queryChangeMock = jest.fn()

  beforeEach(() => {
      props = {
        currentUser: {},
        dispatch: dispatchMock,
        offerers: [{
          id: 'AE',
          name: 'Fake Name',
          nOffers: 56,
          isValidated: true
        }],
        pagination: {
          apiQuery: {
            keywords: null,
          },
        },
        query: {
          change: queryChangeMock,
          parse: parseMock,
        },
        location: {
          search: '',
        },
        venues: [
          {}
        ],
        physicalVenues: [{}]
      }
    })

  describe('snapshot', () => {
    it('should match snapshot', () => {  
      // when
      const wrapper = shallow(<OffererItem {...props} />)

      // then
      expect(wrapper).toBeDefined()
      expect(wrapper).toMatchSnapshot()
    })
  })
})
