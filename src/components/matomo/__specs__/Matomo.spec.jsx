import configureMockStore from 'redux-mock-store'
import { createBrowserHistory } from 'history'
import { mount } from 'enzyme'
import { Provider } from 'react-redux'
import React from 'react'
import { Router } from 'react-router'

import MatomoContainer from '../MatomoContainer'

describe('src | components | matomo | Matomo', () => {
  let fakeMatomo
  let history
  let initialState
  let store

  const mockStore = configureMockStore()

  beforeEach(() => {
    history = createBrowserHistory()
    history.push('/router/path')

    fakeMatomo = {
      push: jest.fn(),
    }
    window._paq = fakeMatomo
    initialState = { user: null }
    store = mockStore(initialState)
  })

  it('should push a new page displayed event', () => {
    // when
    mount(
      <Router history={history}>
        <Provider store={store}>
          <MatomoContainer />
        </Provider>
      </Router>
    )

    // then
    expect(fakeMatomo.push).toHaveBeenNthCalledWith(1, ['setCustomUrl', '/router/path'])
  })

  it('should push the page title', () => {
    // given
    document.title = 'pass Culture page title'

    // when
    mount(
      <Router history={history}>
        <Provider store={store}>
          <MatomoContainer />
        </Provider>
      </Router>
    )

    // then
    expect(fakeMatomo.push).toHaveBeenNthCalledWith(2, [
      'setDocumentTitle',
      'pass Culture page title',
    ])
  })

  describe('when user is not logged', () => {
    it('should push Anonymous as userId', () => {
      // when
      mount(
        <Router history={history}>
          <Provider store={store}>
            <MatomoContainer />
          </Provider>
        </Router>
      )

      // then
      expect(fakeMatomo.push).toHaveBeenNthCalledWith(3, ['setUserId', 'ANONYMOUS on PRO'])
    })
  })

  describe('when user is logged', () => {
    it('should dispatch setUserId with current user id', () => {
      // given
      store = mockStore({ user: { id: 'TY' } })

      // when
      mount(
        <Router history={history}>
          <Provider store={store}>
            <MatomoContainer />
          </Provider>
        </Router>
      )

      // then
      expect(fakeMatomo.push).toHaveBeenNthCalledWith(3, ['setUserId', 'TY on PRO'])
    })
  })
})
