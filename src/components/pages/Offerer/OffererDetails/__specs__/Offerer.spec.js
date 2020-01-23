import { Offerer } from '../Offerer'

describe('src | components | pages | OffererCreation | Offerer', () => {

  describe('constructor', () => {
    it('should instantiate Offerer object with default values', () => {
      // When
      const result = new Offerer()

      // Then
      expect(result).toMatchObject({
        id: undefined,
        siren: '',
        name: '',
        address: '',
        bic: '',
        iban: '',
        adminUserOfferer: undefined,
      })
    })
  })

  describe('areBankInformationProvided', () => {
    describe('when offerer bic and iban exists', () => {
      it('should return true', () => {
        // given
        const offerer = {
          name: 'name',
          bic: 'bic',
          iban: 'iban',
        }
        const offererInstance = new Offerer(offerer, {})

        // then
        expect(offererInstance.areBankInformationProvided).toBe(true)
      })
    })

    describe('when offerer bic doesnt exist', () => {
      it('should return false', () => {
        // given
        const offerer = {
          name: 'name',
          iban: 'iban',
        }
        const offererInstance = new Offerer(offerer, {})
        // when then
        expect(offererInstance.areBankInformationProvided).toBe(false)
      })
    })

    describe('when offerer iban doesnt exist', () => {
      it('should return false', () => {
        // given
        const offerer = {
          name: 'name',
          bic: 'bic',
        }
        const offererInstance = new Offerer(offerer, {})
        // when then
        expect(offererInstance.areBankInformationProvided).toBe(false)
      })
    })

    describe('when neither offerer iban or bic exist', () => {
      it('should return false', () => {
        // given
        const offerer = {
          name: 'name',
        }
        const offererInstance = new Offerer(offerer, {})
        // when then
        expect(offererInstance.areBankInformationProvided).toBe(false)
      })
    })
  })
})
