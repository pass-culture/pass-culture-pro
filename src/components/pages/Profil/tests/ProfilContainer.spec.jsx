import React from 'react'
import { mapStateToProps } from '../ProfilContainer'
import { selectCurrentUser } from 'with-login'

describe('src | components | pages | Profil | ProfilContainer', () => {
  describe('mapStateToProps', () => {
    it('should return an object of props', () => {
      // given
      const id = '1'
      const currentUserUUID = 'ABC'
      const state = {
        data: { users: [{ currentUserUUID, id }] },
      }
      selectCurrentUser.currentUserUUID = currentUserUUID

      // when
      const result = mapStateToProps(state)

      // then
      expect(result).toEqual({
        currentUser: {
          currentUserUUID: 'ABC',
          id: '1',
        },
      })
    })
  })
})
