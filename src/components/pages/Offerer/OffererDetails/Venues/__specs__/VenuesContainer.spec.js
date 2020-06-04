import { mapStateToProps } from '../VenuesContainer'

describe('pages | Offerers | VenuesContainer', () => {
  describe('mapStateToProps', () => {
    describe('isVenueCreationAvailable is based on feature flipping', () => {
      it('should mark offerer creation possible when API sirene is available', () => {
        // given
        const props = {}
        const state = {
          data: {
            features: [
              {
                isActive: true,
                nameKey: 'API_SIRENE_AVAILABLE',
              },
            ],
          },
        }

        // when
        const result = mapStateToProps(state, props)

        // then
        expect(result).toHaveProperty('isVenueCreationAvailable', true)
      })

      it('should prevent offerer creation when feature API sirene is not available', () => {
        // given
        const props = {
          offerer: {
            id: 'BA',
          },
        }
        const state = {
          data: {
            features: [
              {
                isActive: false,
                nameKey: 'API_SIRENE_AVAILABLE',
              },
            ],
          },
        }

        // when
        const result = mapStateToProps(state, props)

        // then
        expect(result).toHaveProperty('isVenueCreationAvailable', false)
      })
    })
  })
})
