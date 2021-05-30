import { setUser } from '@sentry/browser'
import { mount, shallow } from 'enzyme/build'
import React from 'react'

import { App } from '../App'
import RedirectToMaintenance from '../RedirectToMaintenance'

const getCurrentUser = ({ handleSuccess }) => {
  handleSuccess()
}

const loadFeatures = jest.fn()

jest.mock('@sentry/browser', () => ({
  setUser: jest.fn(),
}))

describe('src | App', () => {
  it('should render App and children components when isMaintenanceActivated is false', () => {
    // Given
    const props = { isMaintenanceActivated: false, getCurrentUser, loadFeatures }

    // When
    const wrapper = mount(
      <App {...props}>
        <p>
          {'Sub component'}
        </p>
      </App>
    )

    // Then
    const appNode = wrapper.find(App)
    expect(appNode).toHaveLength(1)
    expect(appNode.text()).toBe('Sub component')
  })

  it('should render a Redirect component when isMaintenanceActivated is true', () => {
    // Given
    const props = { isMaintenanceActivated: true, getCurrentUser, loadFeatures }

    // When
    const wrapper = shallow(
      <App {...props}>
        <p>
          {'Sub component'}
        </p>
      </App>
    )

    // Then
    const redirectToMaintenanceElement = wrapper.find(RedirectToMaintenance)
    expect(redirectToMaintenanceElement).toHaveLength(1)
  })

  it('should call Sentry setUser if current user is given', () => {
    // Given
    const props = {
      isMaintenanceActivated: true,
      getCurrentUser,
      currentUser: { pk: 'pk_key' },
      loadFeatures,
    }

    // When
    mount(
      <App {...props}>
        <p>
          {'Sub component'}
        </p>
      </App>
    )

    // Then
    expect(setUser).toHaveBeenCalledWith({ id: 'pk_key' })
  })
})
