import { mapStateToProps } from '../LostPasswordContainer'

describe('src | components | pages | LostPasswordContainer', () => {
  let props
  let state

  beforeEach(() => {
    props = {
      location: {
        search: '?change=1&token=ABC',
      },
    }
    state = {
      data: {},
      users: {
        currentUser: null,
      },
      errors: {
        user: null,
      },
    }
  })

  describe('mapStateToProps', () => {
    it('should return an object of props', () => {
      // when
      const result = mapStateToProps(state, props)

      // then
      expect(result).toStrictEqual({
        currentUser: null,
        change: '1',
        envoye: undefined,
        errors: [],
        isNewHomepageActive: false,
        token: 'ABC',
      })
    })
  })
})
