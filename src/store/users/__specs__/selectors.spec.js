import { initialState } from 'store/users/reducer'
import { selectCurrentUser, selectIsUserAdmin } from 'store/users/selectors'

describe('users selectors', () => {
  describe('select if user is admin', () => {
    it('should return false when state contains no users', () => {
      // given
      const state = {
        users: initialState,
      }

      // when
      const result = selectIsUserAdmin(state)

      // then
      expect(result).toStrictEqual(false)
    })

    it('should return true when state contain an admin user', () => {
      // given
      const state = {
        users: {
          currentUser: {
            id: 'FA',
            isAdmin: true,
          },
        },
      }

      // when
      const result = selectIsUserAdmin(state)

      // then
      expect(result).toStrictEqual(true)
    })

    it('should return false when state contain no admin user', () => {
      // given
      const state = {
        users: {
          currentUser: {
            id: 'EF',
            isAdmin: false,
          },
        },
      }

      // when
      const result = selectIsUserAdmin(state)

      // then
      expect(result).toStrictEqual(false)
    })
  })

  describe('select current user infos', () => {
    describe('when nothing in the store', () => {
      it('should return nothing', () => {
        // given
        const state = {
          users: initialState,
        }

        // when
        const user = selectCurrentUser(state)

        // then
        expect(user).toBeNull()
      })
    })

    describe('when users in the store', () => {
      it('should return the first user', () => {
        // given
        const state = {
          users: {
            currentUser: {
              id: 'EF',
            },
          },
        }

        // when
        const user = selectCurrentUser(state)

        // then
        expect(user).toStrictEqual({ id: 'EF' })
      })
    })
  })
})
