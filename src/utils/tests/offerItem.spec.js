import { getOfferTypeLabel, getRemainingStock } from '../offerItem'

describe('getOfferTypeLabel', () => {
  describe('when event exists', () => {
    it('should return event offer type label', () => {
      // given
      const event = { offerType: { label: 'Conférence — Débat — Dédicace' } }
      const thing = undefined

      // when
      const offerTypeLabel = getOfferTypeLabel(event, thing)

      // then
      expect(offerTypeLabel).toEqual('Conférence — Débat — Dédicace')
    })
  })

  describe('when thing exists', () => {
    it('should return thing offer type label', () => {
      // given
      const thing = { offerType: { label: 'Jeux (Biens physiques)' } }
      const event = undefined

      // when
      const offerTypeLabel = getOfferTypeLabel(event, thing)

      // then
      expect(offerTypeLabel).toEqual('Jeux (Biens physiques)')
    })
  })
})

describe('getRemainingStock', () => {
  const bookings = [
    {
      amount: 45.0,
      dateCreated: '2019-02-12T09:18:36.077688Z',
      id: 'GGXQ',
      isCancelled: false,
      isUsed: false,
      modelName: 'Booking',
      quantity: 1,
      recommendationId: 'AYYC8',
      stockId: 'D28A',
      token: '8UNYCQ',
      userId: 'C9SQ',
    },
    {
      amount: 45.0,
      dateCreated: '2019-02-12T08:57:05.704555Z',
      id: 'GGLA',
      isCancelled: true,
      isUsed: false,
      modelName: 'Booking',
      quantity: 1,
      recommendationId: 'AXJRA',
      stockId: 'D28A',
      token: '9A2Q5A',
      userId: 'CMSA',
    },
    {
      amount: 45.0,
      dateCreated: '2019-02-12T10:04:46.588684Z',
      id: 'GHYQ',
      isCancelled: true,
      isUsed: false,
      modelName: 'Booking',
      quantity: 1,
      recommendationId: 'A5WVU',
      stockId: 'D28A',
      token: 'LUG9HU',
      userId: 'FNAQ',
    },
    {
      amount: 45.0,
      dateCreated: '2019-02-12T10:05:50.273241Z',
      id: 'GH3A',
      isCancelled: true,
      isUsed: false,
      modelName: 'Booking',
      quantity: 1,
      recommendationId: 'A6FY4',
      stockId: 'D28A',
      token: 'NMSQUA',
      userId: 'D9EQ',
    },
    {
      amount: 45.0,
      dateCreated: '2019-02-12T09:54:39.619611Z',
      id: 'GH8Q',
      isCancelled: true,
      isUsed: false,
      modelName: 'Booking',
      quantity: 1,
      recommendationId: 'A5KQA',
      stockId: 'D28A',
      token: 'SE6QTE',
      userId: 'DLSQ',
    },
    {
      amount: 45.0,
      dateCreated: '2019-02-12T10:36:04.299338Z',
      id: 'G97A',
      isCancelled: true,
      isUsed: false,
      modelName: 'Booking',
      quantity: 1,
      recommendationId: 'A7EQ4',
      stockId: 'D28A',
      token: 'X43QAY',
      userId: 'FZAA',
    },
    {
      amount: 45.0,
      dateCreated: '2019-03-13T17:20:31.263977Z',
      id: 'J6XQ',
      isCancelled: true,
      isUsed: false,
      modelName: 'Booking',
      quantity: 1,
      recommendationId: 'L4988',
      stockId: 'D28A',
      token: 'YABY2Q',
      userId: 'ETDA',
    },
    {
      amount: 45.0,
      dateCreated: '2019-03-14T17:51:49.542994Z',
      id: 'KCZQ',
      isCancelled: false,
      isUsed: false,
      modelName: 'Booking',
      quantity: 1,
      recommendationId: 'M6WX2',
      stockId: 'D28A',
      token: '8EZEA9',
      userId: 'AHQA',
    },
    {
      amount: 45.0,
      dateCreated: '2019-03-16T11:41:13.733061Z',
      id: 'KHWA',
      isCancelled: true,
      isUsed: false,
      modelName: 'Booking',
      quantity: 1,
      recommendationId: 'M2959',
      stockId: 'D28A',
      token: '2UTYT4',
      userId: 'FSDA',
    },
  ]
  describe('When there is available stock', () => {
    it('should compute remaining stock', () => {
      // given
      const availableStock = 56

      // when
      const result = getRemainingStock(availableStock, bookings)

      // then
      expect(result).toEqual(54)
    })
  })
  describe('When stock is illimited', () => {
    it('should compute remaining illimited stock', () => {
      // given
      const availableStock = null
      const bookings = 12

      // when
      const result = getRemainingStock(availableStock, bookings)

      // then
      expect(result).toEqual('Illimité')
    })
  })
})
