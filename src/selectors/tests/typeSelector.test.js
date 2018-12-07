import { typeSelector } from '../type'
import state from './mockState'

describe('typeSelector', () => {
  describe('when offer type is consistent with isVirtual', () => {
    it('returns an offer type given its value', () => {
      // given
      const isVirtual = false
      const offerTypeValue = 'ThingType.MUSIQUE'

      // when
      const result = typeSelector(state, isVirtual, offerTypeValue)

      // then
      expect(result).toEqual({
        id: 15,
        description:
          'Plutôt rock, rap ou classique ? Sur un smartphone avec des écouteurs ou entre amis au concert ?',
        label: 'Musique (sur supports physiques ou en ligne)',
        offlineOnly: false,
        onlineOnly: false,
        sublabel: 'Écouter',
        type: 'Thing',
        value: 'ThingType.MUSIQUE',
      })
    })
  })

  describe('when offer type is consistent with isVirtual', () => {
    it('returns undefined if value is unknown', () => {
      // given
      const isVirtual = false
      const offerTypeValue = 'ThingType.TRUC'

      // when
      const result = typeSelector(state, isVirtual, offerTypeValue)

      // then
      expect(result).not.toBeDefined()
    })
  })

  describe('when offer type is offline only and is virtual is true', () => {
    it('returns undefined', () => {
      // given
      const isVirtual = true
      const offerTypeValue = 'ThingType.PRATIQUE_ARTISTIQUE_ABO'

      // when
      const result = typeSelector(state, isVirtual, offerTypeValue)

      // then
      expect(result).not.toBeDefined()
    })
  })

  describe('when offer type is online only and is virtual is false', () => {
    it('returns undefined', () => {
      // given
      const isVirtual = false
      const offerTypeValue = 'ThingType.PRESSE_ABO'

      // when
      const result = typeSelector(state, isVirtual, offerTypeValue)

      // then
      expect(result).not.toBeDefined()
    })
  })
})
