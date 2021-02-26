import { configureTestStore } from 'store/testUtils'

import { mapStateToProps } from '../AppContainer'

describe('src | AppContainer', () => {
  it('should map maintenance status to App', () => {
    // Given
    const state = configureTestStore({
      maintenance: { isActivated: true },
    }).getState()

    // When
    const result = mapStateToProps(state)

    // Then
    expect(result).toHaveProperty('isMaintenanceActivated', true)
  })
})
