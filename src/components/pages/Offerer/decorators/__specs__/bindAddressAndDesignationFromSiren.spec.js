import bindAddressAndDesignationFromSiren from '../bindSirenFieldToDesignation'
import getSirenInformation from '../getSirenInformation'

jest.mock('../getSirenInformation', () => {
  return jest.fn().mockImplementation(() => ({
      address: null,
      city: null,
      name: null,
      postalCode: null,
      siren: '841 166 09616',
    }
  ))
})


describe('bindAddressAndDesignationFromSiren', () => {
  beforeEach(() => {
    getSirenInformation.mockClear()
  })

  describe('when the SIREN is not complete', () => {
    it('should not load SIREN information', () => {
      // Given
      const siren = '418'

      // When
      bindAddressAndDesignationFromSiren(siren)

      // Then
      expect(getSirenInformation).not.toHaveBeenCalled()
    })

    it('should return empty information', async () => {
      // Given
      const siren = '418 71'

      // When
      const result = await bindAddressAndDesignationFromSiren(siren)

      // Then
      expect(result).toStrictEqual({
          address: '',
          city: '',
          name: '',
          postalCode: '',
          siren: '418 71',
        }
      )
    })
  })

  it('should load offerer details from API', () => {
    // Given
    const siren = '418166096'

    // When
    bindAddressAndDesignationFromSiren(siren)

    // Then
    expect(getSirenInformation).toHaveBeenCalledWith(siren)
  })

  it('should format the SIREN to the API standards', () => {
    // Given
    const siren = '418 166 096'

    // When
    bindAddressAndDesignationFromSiren(siren)

    // Then
    expect(getSirenInformation).toHaveBeenCalledWith('418166096')
  })


  it('should format the SIREN to exclude extra characters', () => {
    // Given
    const siren = '841 166 09616'

    // When
    bindAddressAndDesignationFromSiren(siren)

    // Then
    expect(getSirenInformation).toHaveBeenCalledWith('841166096')
  })

  it('should return the result', async () => {
    // Given
    const siren = '841 166 09616'

    // When
    const result = await bindAddressAndDesignationFromSiren(siren)

    // Then
    expect(result).toStrictEqual({
        address: null,
        name: null,
        siren: '841 166 09616',
        postalCode: null,
        city: null
      }
    )
  })
})
