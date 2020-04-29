import { mapDispatchToProps } from '../BookingsContainer'

describe('src | components | pages | Bookings-v2 | BookingsContainer', function() {
  describe('mapDispatchToProps', function() {
    let dispatch

    beforeEach(() => {
      dispatch = jest.fn()
    })

    it('should call api to load all bookings recap', function() {
      // Given
      const functions = mapDispatchToProps(dispatch)
      const handleSuccess = jest.fn()

      // When
      functions.requestGetAllBookingsRecap(handleSuccess)

      // Then
      expect(dispatch.mock.calls[0][0]).toStrictEqual({
        config: {
          apiPath: '/bookings/pro',
          method: 'GET',
          handleSuccess: handleSuccess,
        },
        type: 'REQUEST_DATA_GET_/BOOKINGS/PRO',
      })
    })
  })
})
