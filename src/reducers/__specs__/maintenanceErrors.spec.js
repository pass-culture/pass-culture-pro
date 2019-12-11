import maintenanceReducer from '../maintenanceReducer'

describe('src | Reducers | Maintenance errors', () => {
  it('should have an initial state', () => {
    // When
    const newState = maintenanceReducer()

    // Then
    expect(newState).toStrictEqual({
      isActivated: false,
    })
  })

  describe('when receiving a FAIL_DATA_ event', () => {
    it('should mark maintenance as activated when receiving a 503 status code', () => {
      // Given
      const action = {
        config: {
          method: 'GET',
          rootUrl: 'http://localhost',
          timeout: 50000,
          apiPath: '/offerers/DY',
          normalizer: {
            managedVenues: {
              normalizer: {
                offers: 'offers',
              },
              stateKey: 'venues',
            },
          },
        },
        payload: {
          headers: {
            'content-type': 'application/json',
          },
          ok: false,
          status: 503,
          errors: {},
        },
        type: 'FAIL_DATA_GET_/OFFERERS/DY',
      }

      // When
      const newState = maintenanceReducer({ isActivated: false }, action)

      // Then
      expect(newState).toStrictEqual({
        isActivated: true,
      })
    })

    it('should leave isActivated as false when receiving any status code different than 503', () => {
      // Given
      const action = {
        config: {
          method: 'GET',
          rootUrl: 'http://localhost',
          timeout: 50000,
          apiPath: '/offerers/DY',
          normalizer: {
            managedVenues: {
              normalizer: {
                offers: 'offers',
              },
              stateKey: 'venues',
            },
          },
        },
        payload: {
          headers: {
            'content-type': 'application/json',
          },
          ok: false,
          status: 500,
          errors: {},
        },
        type: 'FAIL_DATA_GET_/OFFERERS/DY',
      }

      // When
      const newState = maintenanceReducer({ isActivated: false }, action)

      // Then
      expect(newState).toStrictEqual({
        isActivated: false,
      })
    })
  })

  describe('when receiving a SUCCESS_DATA_ event', () => {
    it('should mark maintenance as deactivated when receiving a success', () => {
      // Given
      const action = {
        config: {
          method: 'GET',
          rootUrl: 'http://localhost',
          timeout: 50000,
          apiPath: '/features',
        },
        payload: {
          headers: {
            'content-type': 'application/json',
          },
          ok: true,
          status: 200,
          data: [],
        },
        type: 'SUCCESS_DATA_GET_/FEATURES',
      }

      // When
      const newState = maintenanceReducer({ isActivated: true }, action)

      // Then
      expect(newState).toStrictEqual({
        isActivated: false,
      })
    })
  })
})
