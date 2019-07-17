import { currentUserUUID } from 'with-react-redux-login'

import { mapStateToProps } from '../ProfilContainer'

describe('src | components | pages | Profil | ProfilContainer', () => {
  describe('mapStateToProps', () => {
    it('should return an object of props', () => {
      // given
      const id = '1'
      const state = {
        data: { users: [{ currentUserUUID, id }] },
      }

      // when
      const result = mapStateToProps(state)

      // then
      expect(result).toStrictEqual({
        currentUser: {
          currentUserUUID,
          id: '1',
        },
      })
    })
  })
})
