import { mapStateToProps, mapDispatchToProps } from '../StockItemContainer'
import state from '../../../../../utils/mocks/state'
import Offer from '../../../ValueObjects/Offer'

jest.mock('redux-thunk-data', () => {
  const { requestData } = jest.requireActual('fetch-normalize-data')

  return {
    requestData,
  }
})

describe('components | OfferEdition | stockItemContainer', () => {
  describe('mapStateToProps', () => {
    describe('when adding stock to one offer', () => {
      it('should map correctly the state', () => {
        // given
        const ownProps = {
          location: {
            search: '?lieu=DA',
          },
          match: {
            params: { offerId: 'UU' },
          },
          query: {
            parse: () => ({}),
          },
        }

        // when
        const result = mapStateToProps(state, ownProps)
        const expectedOffer = new Offer({
          bookingEmail: 'booking.email@test.com',
          dateCreated: '2019-03-07T10:39:23.560392Z',
          dateModifiedAtLastProvider: '2019-03-07T10:40:05.443621Z',
          isEvent: false,
          isThing: true,
          id: 'UU',
          idAtProviders: null,
          isActive: true,
          lastProvider: null,
          lastProviderId: null,
          mediationsIds: ['H4'],
          modelName: 'Offer',
          productId: 'LY',
          stocksIds: ['MU'],
          venueId: 'DA',
        })
        const expected = {
          event: undefined,
          formBeginningDatetime: undefined,
          formBookingLimitDatetime: undefined,
          formEndDatetime: undefined,
          formPrice: undefined,
          hasIban: 'FR7630001007941234567890185',
          isStockReadOnly: true,
          offer: expectedOffer,
          stockFormKey: null,
          stockIdOrNew: undefined,
          formInitialValues: {
            available: 10,
            bookingLimitDatetime: null,
            bookingRecapSent: null,
            dateModified: '2019-03-07T10:40:07.318721Z',
            dateModifiedAtLastProvider: '2019-03-07T10:40:07.318695Z',
            groupSize: 1,
            id: 'MU',
            idAtProviders: null,
            isSoftDeleted: false,
            lastProviderId: null,
            modelName: 'Stock',
            offerId: 'UU',
            offererId: 'BA',
            price: 17,
          },
          tz: 'Europe/Paris',
          venue: {
            address: null,
            bookingEmail: 'john.doe@test.com',
            city: null,
            comment: null,
            dateModifiedAtLastProvider: '2019-03-07T10:40:03.234016Z',
            departementCode: null,
            id: 'DA',
            idAtProviders: null,
            isValidated: true,
            isVirtual: true,
            lastProviderId: null,
            latitude: 48.83638,
            longitude: 2.40027,
            managingOffererId: 'BA',
            modelName: 'Venue',
            name: 'Le Sous-sol (Offre numérique)',
            postalCode: null,
            siret: null,
            thumbCount: 0,
            validationToken: null,
          },
          venueId: 'DA',
        }

        // then
        expect(result.offer).toStrictEqual(expected.offer)
      })
    })
  })

  describe('mapDispatchToProps', () => {
    let dispatch

    beforeEach(() => {
      dispatch = jest.fn()
    })

    describe('updateStockInformations', () => {
      it('should submit stock item modification', () => {
        // given
        const handleSuccess = jest.fn()
        const handleFail = jest.fn()
        const ownProps = {
          query: {
            context: jest.fn().mockReturnValue({
              method: 'PATCH',
            }),
          },
          stockPatch: {
            id: 'stockId',
            stockId: 'stockId',
          },
        }
        const body = {
          updatedField: 'updatedValue',
        }
        const stockId = 'stockId'

        // when
        mapDispatchToProps(dispatch, ownProps).updateStockInformations(
          stockId,
          body,
          handleSuccess,
          handleFail
        )

        // then
        expect(dispatch).toHaveBeenCalledWith({
          config: {
            apiPath: '/stocks/stockId',
            body: {
              updatedField: 'updatedValue',
            },
            handleSuccess: handleSuccess,
            handleFail: handleFail,
            method: 'PATCH',
          },
          type: 'REQUEST_DATA_PATCH_/STOCKS/STOCKID',
        })
      })
    })

    describe('deleteStock', () => {
      it('should submit stock deletion', () => {
        // given
        const handleFail = jest.fn()
        const stockId = 'stockId'

        // when
        mapDispatchToProps(dispatch).deleteStock(stockId, handleFail)

        // then
        expect(dispatch).toHaveBeenCalledWith({
          config: {
            apiPath: 'stocks/stockId',
            handleFail: handleFail,
            method: 'DELETE',
          },
          type: 'REQUEST_DATA_DELETE_STOCKS/STOCKID',
        })
      })
    })
  })
})
