import {
  selectVenues,
  selectVenuesByOffererIdAndOfferType,
  selectPhysicalVenuesByOffererId,
  selectVenueById,
} from '../venuesSelectors'

describe('src | selectors | data | venuesSelectors', () => {
  describe('selectVenues', () => {
    describe('when venues attribute exists', () => {
      it('should return it', () => {
        const store = {
          data: {
            venues: [{ id: 1 }, { id: 2 }],
          },
        }
        expect(selectVenues(store)).toStrictEqual([{ id: 1 }, { id: 2 }])
      })
    })
  })

  describe('selectVenuesByOfferIdAndOfferType', () => {
    describe('with no filters', () => {
      it('should return all venues', () => {
        const store = {
          data: {
            venues: [
              { id: 'AE', managingOffererId: 'ZZ', isVirtual: true },
              { id: 'B4', managingOffererId: 'AA', isVirtual: true },
              { id: 'AF', managingOffererId: 'ZZ', isVirtual: false },
              { id: 'ER', managingOffererId: 'AA', isVirtual: false },
            ],
          },
        }
        expect(selectVenuesByOffererIdAndOfferType(store)).toStrictEqual([
          { id: 'AE', managingOffererId: 'ZZ', isVirtual: true },
          { id: 'B4', managingOffererId: 'AA', isVirtual: true },
          { id: 'AF', managingOffererId: 'ZZ', isVirtual: false },
          { id: 'ER', managingOffererId: 'AA', isVirtual: false },
        ])
      })
    })

    describe('with optionalOffererId filter', () => {
      it('should filter venues accordingly', () => {
        const store = {
          data: {
            venues: [
              { id: 'AE', managingOffererId: 'ZZ', isVirtual: true },
              { id: 'B4', managingOffererId: 'AA', isVirtual: true },
              { id: 'AF', managingOffererId: 'ZZ', isVirtual: false },
              { id: 'ER', managingOffererId: 'AA', isVirtual: false },
            ],
          },
        }
        const optionalOffererId = 'ZZ'

        expect(selectVenuesByOffererIdAndOfferType(store, optionalOffererId)).toStrictEqual([
          { id: 'AE', managingOffererId: 'ZZ', isVirtual: true },
          { id: 'AF', managingOffererId: 'ZZ', isVirtual: false },
        ])
      })
    })

    describe('with optionalOfferType offlineOnly filter', () => {
      it('should filter venues accordingly', () => {
        const store = {
          data: {
            venues: [
              { id: 'AE', managingOffererId: 'ZZ', isVirtual: true },
              { id: 'B4', managingOffererId: 'AA', isVirtual: true },
              { id: 'AF', managingOffererId: 'ZZ', isVirtual: false },
              { id: 'ER', managingOffererId: 'AA', isVirtual: false },
            ],
          },
        }
        const optionalOffererId = 'ZZ'
        const optionalOfferType = { offlineOnly: true }

        expect(
          selectVenuesByOffererIdAndOfferType(store, optionalOffererId, optionalOfferType)
        ).toStrictEqual([{ id: 'AF', managingOffererId: 'ZZ', isVirtual: false }])
      })
    })

    describe('with optionalOfferType onlineOnly filter', () => {
      it('should filter venues accordingly', () => {
        const store = {
          data: {
            venues: [
              { id: 'AE', managingOffererId: 'ZZ', isVirtual: true },
              { id: 'B4', managingOffererId: 'AA', isVirtual: true },
              { id: 'AF', managingOffererId: 'ZZ', isVirtual: false },
              { id: 'ER', managingOffererId: 'AA', isVirtual: false },
            ],
          },
        }
        const optionalOffererId = 'ZZ'
        const optionalOfferType = { onlineOnly: true }

        expect(
          selectVenuesByOffererIdAndOfferType(store, optionalOffererId, optionalOfferType)
        ).toStrictEqual([{ id: 'AE', managingOffererId: 'ZZ', isVirtual: true }])
      })
    })
  })

  describe('selectPhysicalVenuesByOffererId', () => {
    describe('when offerer Id is given', () => {
      it('should return non virtual venues with that offerer id', () => {
        const store = {
          data: {
            venues: [
              { id: 'AE', managingOffererId: 'ZZ', isVirtual: true },
              { id: 'AE', managingOffererId: 'ZZ', isVirtual: false },
              { id: 'AF', managingOffererId: 'AA', isVirtual: true },
              { id: 'AX', managingOffererId: 'AA', isVirtual: false },
            ],
          },
        }
        const offererId = 'ZZ'

        expect(selectPhysicalVenuesByOffererId(store, offererId)).toStrictEqual([
          { id: 'AE', managingOffererId: 'ZZ', isVirtual: false },
        ])
      })
    })

    describe('when offerer Id is not given', () => {
      it('should return non virtual venues without filtering by offerer Id', () => {
        const store = {
          data: {
            venues: [
              { id: 'AE', managingOffererId: 'ZZ', isVirtual: true },
              { id: 'AE', managingOffererId: 'ZZ', isVirtual: false },
              { id: 'AF', managingOffererId: 'AA', isVirtual: true },
              { id: 'AX', managingOffererId: 'ZZ', isVirtual: false },
            ],
          },
        }

        expect(selectPhysicalVenuesByOffererId(store)).toStrictEqual([
          { id: 'AE', managingOffererId: 'ZZ', isVirtual: false },
          { id: 'AX', managingOffererId: 'ZZ', isVirtual: false },
        ])
      })
    })
  })

  describe('selectVenueById', () => {
    describe('when venues is empty', () => {
      it('should return undefined', () => {
        const store = {
          data: {
            venues: [],
          },
        }
        expect(selectVenueById(store)).toBeUndefined()
      })
    })

    describe('when venue id is not given', () => {
      it('should return undefined', () => {
        const store = {
          data: {
            venues: [{ id: 'AE' }],
          },
        }
        expect(selectVenueById(store)).toBeUndefined()
      })
    })

    describe('when venue id doesnt exist in venues', () => {
      it('should return undefined', () => {
        const store = {
          data: {
            venues: [{ id: 'AE' }],
          },
        }
        expect(selectVenueById(store, 'B4')).toBeUndefined()
      })
    })

    describe('when venue id matches a venue', () => {
      it('should return it', () => {
        const store = {
          data: {
            venues: [{ id: 'AE' }],
          },
        }
        expect(selectVenueById(store, 'AE')).toStrictEqual({ id: 'AE' })
      })
    })
  })
})
