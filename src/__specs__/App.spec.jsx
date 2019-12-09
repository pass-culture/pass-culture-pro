import React from 'react'
import { mount } from 'enzyme/build'
import { App } from '../App'
import { Redirect } from "react-router"
import { Router } from "react-router-dom"
import { Provider } from "react-redux"
import { createBrowserHistory } from "history"
import { configureTestStore } from "../components/hocs/with-login/__specs__/configure"
import { URL_FOR_MAINTENANCE } from "../utils/config"

describe('src | App', () => {
  it('should render children components', () => {
    // Given
    const props = { modalOpen: false }

    // When
    const wrapper = mount(
      <App {...props}>
        <p>
          {'Sub component'}
        </p>
      </App>
    )

    // Then
    expect(wrapper.text()).toBe('Sub component')
  })

  it('should render a Redirect component when isMaintenanceActivated is true', () => {
    // Given
    const history = createBrowserHistory()
    const store = configureTestStore()
    const props = { modalOpen: false, isMaintenanceActivated: true }

    // When
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <App {...props}>
            <p>
              {'Sub component'}
            </p>
          </App>
        </Router>
      </Provider>
    )

    // Then
    const redirectNode = wrapper.find(Redirect)
    expect(redirectNode).toHaveLength(1)
    expect(redirectNode.prop('to')).toStrictEqual('https://test-page-for-maintenance.net')
  })
})
