import { initialState } from '../../../store/users/reducer'
import { mapStateToProps } from '../MatomoContainer'

describe('src | components | matomo | MatomoContainer', () => {
  describe('mapStateToProps', () => {
    it('should return an object of props when user is logged in', () => {
      // given
      const state = {
        users: {
          currentUser: {
            id: 'TY7',
            isAdmin: true,
          },
        },
      }

      // when
      const props = mapStateToProps(state)

      // then
      expect(props).toStrictEqual({ userId: 'TY7' })
    })

    it('should return an object of props when user is logged out', () => {
      // given
      const state = {
        users: initialState,
      }

      // when
      const props = mapStateToProps(state)

      // then
      expect(props).toStrictEqual({ userId: 'ANONYMOUS' })
    })
  })
})
