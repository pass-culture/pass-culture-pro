import checkIfProviderShouldBeDisabled from '../checkIfProviderShouldBeDisabled'

describe('src | components | pages | Venue | VenueProvidersManager | utils', () => {
  it('should return false when provider is not found in given venue providers', () => {
    // given
    const provider = { id: 'C' }
    const venueProviders = [{ id: 'A', providerId: 'AA' }, { id: 'B', providerId: 'BB' }]

    // when
    const result = checkIfProviderShouldBeDisabled(venueProviders, provider)

    // then
    expect(result).toBe(false)
  })

  it('should return true when provider is found in given venue providers', () => {
    // given
    const provider = { id: 'AA' }
    const venueProviders = [{ id: 'A', providerId: 'AA' }, { id: 'B', providerId: 'BB' }]

    // when
    const result = checkIfProviderShouldBeDisabled(venueProviders, provider)

    // then
    expect(result).toBe(true)
  })
})
