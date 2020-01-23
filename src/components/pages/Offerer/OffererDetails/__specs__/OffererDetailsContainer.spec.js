import { mapStateToProps } from '../../OffererDetails/OffererDetailsContainer'

jest.mock('redux-thunk-data', () => {
  const { requestData } = jest.requireActual('fetch-normalize-data')
  return {
    requestData,
  }
})

describe('src | components | pages | Offerer | OffererDetails | OffererDetailsContainer', () => {
  describe('mapStateToProps', () => {
    it('should return an object of props', () => {
      // given
      const state = {
        data: {
          userOfferers: [
            {
              id: 'AEKQ',
              modelName: 'UserOfferer',
              offererId: 'AGH',
              rights: 'admin',
              userId: 'TY56er',
            },
          ],
          offerers: [
            {
              id: 'AGH',
              name: 'Gaumont cinéma',
              bic: 'bic',
              iban: 'iban',
              siren: '256712456',
              address: '256, rue des mimosas'
            },
          ],
          venues: [],
        },
      }
      const ownProps = {
        currentUser: {
          id: 'TY56er',
        },
        match: {
          params: {
            offererId: 'AGH',
          },
        },
      }
      // when
      const result = mapStateToProps(state, ownProps)

      // then
      expect(result).toStrictEqual({
        offerer: expect.objectContaining({
          id: 'AGH',
          name: 'Gaumont cinéma',
          bic: 'bic',
          iban: 'iban',
          address: '256, rue des mimosas',
          adminUserOfferer: {
            id: 'AEKQ',
            modelName: 'UserOfferer',
            offererId: 'AGH',
            rights: 'admin',
            userId: 'TY56er',
          },
          siren: '256712456',
        }),
        venues: [],
      })
    })
  })
})
