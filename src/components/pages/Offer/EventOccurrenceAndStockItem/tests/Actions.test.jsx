import React from 'react'
import { shallow } from 'enzyme'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'

import Actions from '../Actions'

const middlewares = []
const mockStore = configureStore(middlewares)

describe('src | components | pages | Offer | EventOccurrenceAndStockItem | Actions', () => {
  describe('snapshot', () => {
    it('should match snapshot', () => {
      // given
      const initialState = {}
      const store = mockStore(initialState)
      const initialProps = {}

      // when
      const wrapper = shallow(
        <Provider store={store}>
          <Actions {...initialProps} />
        </Provider>
      )

      // then
      expect(wrapper).toBeDefined()
      expect(wrapper).toMatchSnapshot()
    })
  })
})
