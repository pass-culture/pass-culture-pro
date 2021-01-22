import { fireEvent } from '@testing-library/dom'
import '@testing-library/jest-dom'
import { act, render, screen } from '@testing-library/react'
import moment from 'moment-timezone'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route } from 'react-router'

import NotificationV2Container from 'components/layout/NotificationV2/NotificationV2Container'
import * as pcapi from 'repository/pcapi/pcapi'
import { configureTestStore } from 'store/testUtils'
import { queryByTextTrimHtml } from 'utils/testHelpers'

import OfferLayoutContainer from '../../OfferLayoutContainer'
import Stocks from '../Stocks'

jest.mock('repository/pcapi/pcapi', () => ({
  deleteStock: jest.fn(),
  loadOffer: jest.fn(),
  bulkCreateOrEditStock: jest.fn(),
}))

const renderOffers = async (props, store) => {
  await act(async () => {
    await render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: '/offres/v2/AG3A/stocks' }]}>
          <Route path="/offres/v2/:offerId([A-Z0-9]+)/">
            <>
              <OfferLayoutContainer {...props} />
              <NotificationV2Container />
            </>
          </Route>
        </MemoryRouter>
      </Provider>
    )
  })
}

describe('stocks page', () => {
  let props
  let defaultOffer
  let defaultStock
  let spiedMomentSetDefaultTimezone
  let stockId
  let store
  beforeEach(() => {
    store = configureTestStore({ data: { users: [{ publicName: 'François', isAdmin: false }] } })
    jest.spyOn(Date.prototype, 'toISOString').mockImplementation(() => '2020-12-15T12:00:00Z')
    spiedMomentSetDefaultTimezone = jest.spyOn(moment.tz, 'setDefault')
    props = {}

    defaultOffer = {
      id: 'AG3A',
      venue: {
        departementCode: '973',
      },
      isEvent: false,
      stocks: [],
    }

    stockId = '2E'
    defaultStock = {
      quantity: 10,
      price: 10.01,
      remainingQuantity: 6,
      bookingsQuantity: 4,
      bookingLimitDatetime: '2020-12-18T23:59:59Z',
      id: stockId,
      isEventDeletable: true,
    }
    pcapi.loadOffer.mockResolvedValue(defaultOffer)
    pcapi.deleteStock.mockResolvedValue({ id: stockId })
  })

  afterEach(() => {
    pcapi.loadOffer.mockReset()
    pcapi.deleteStock.mockReset()
    pcapi.bulkCreateOrEditStock.mockReset()
    spiedMomentSetDefaultTimezone.mockRestore()
  })

  describe('render', () => {
    it('should set timezone based on venue timezone', async () => {
      // Given
      pcapi.loadOffer.mockResolvedValue(defaultOffer)

      // When
      await renderOffers(props, store)

      // Then
      expect(spiedMomentSetDefaultTimezone).toHaveBeenCalledWith('America/Cayenne')
    })

    it('should display "Gratuit" when stock is free', async () => {
      // given
      const offerWithFreeStock = {
        ...defaultOffer,
        stocks: [
          {
            ...defaultStock,
            price: 0,
          },
        ],
      }

      pcapi.loadOffer.mockResolvedValue(offerWithFreeStock)

      // when
      await renderOffers(props, store)

      // then
      expect((await screen.findByPlaceholderText('Gratuit')).value).toBe('')
    })

    it('should display stocks sorted by descending beginning datetime', async () => {
      // given
      const offerWithMultipleStocks = {
        ...defaultOffer,
        isEvent: true,
        stocks: [
          {
            ...defaultStock,
            beginningDatetime: '2020-12-20T22:00:00Z',
          },
          {
            ...defaultStock,
            id: '3F',
            beginningDatetime: '2020-12-25T20:00:00Z',
          },
          {
            ...defaultStock,
            id: '4G',
            beginningDatetime: '2020-12-20T20:00:00Z',
          },
        ],
      }
      pcapi.loadOffer.mockResolvedValue(offerWithMultipleStocks)

      // when
      await renderOffers(props, store)

      // then
      const beginningDatetimeFields = await screen.findAllByLabelText('Date de l’événement')
      const hourFields = await screen.findAllByLabelText('Heure de l’événement')
      expect(beginningDatetimeFields[0].value).toBe('25/12/2020')
      expect(beginningDatetimeFields[1].value).toBe('20/12/2020')
      expect(hourFields[1].value).toBe('19:00')
      expect(beginningDatetimeFields[1].value).toBe('20/12/2020')
      expect(hourFields[2].value).toBe('17:00')
    })

    it('should display "Illimité" for total quantity when stock has unlimited quantity', async () => {
      // given
      const offerWithUnlimitedStock = {
        ...defaultOffer,
        stocks: [
          {
            ...defaultStock,
            quantity: null,
          },
        ],
      }

      pcapi.loadOffer.mockResolvedValue(offerWithUnlimitedStock)

      // when
      await renderOffers(props, store)

      // then
      expect((await screen.findByPlaceholderText('Illimité')).value).toBe('')
    })

    it('should display "Illimité" for remaining quantity when stock has unlimited quantity', async () => {
      // given
      const offerWithUnlimitedStock = {
        ...defaultOffer,
        stocks: [
          {
            ...defaultStock,
            quantity: null,
          },
        ],
      }

      pcapi.loadOffer.mockResolvedValue(offerWithUnlimitedStock)

      // when
      await renderOffers(props, store)

      // then
      expect(await screen.findByText('Illimité')).toBeInTheDocument()
    })

    it('should restore default timezone when unmounting', async () => {
      // Given
      let unmount
      await act(async () => {
        unmount = await render(
          <MemoryRouter>
            <Stocks
              offer={defaultOffer}
              showErrorNotification={jest.fn()}
              showSuccessNotification={jest.fn()}
            />
          </MemoryRouter>
        ).unmount
      })

      // When
      unmount()

      // Then
      expect(spiedMomentSetDefaultTimezone).toHaveBeenCalledTimes(2)
      expect(spiedMomentSetDefaultTimezone).toHaveBeenNthCalledWith(1, 'America/Cayenne')
      expect(spiedMomentSetDefaultTimezone).toHaveBeenNthCalledWith(2)
    })

    describe('render event offer', () => {
      let eventOffer
      beforeEach(() => {
        eventOffer = {
          ...defaultOffer,
          isEvent: true,
          stocks: [
            {
              ...defaultStock,
              beginningDatetime: '2020-12-20T22:00:00Z',
            },
          ],
        }

        pcapi.loadOffer.mockResolvedValue(eventOffer)
      })

      afterEach(() => {
        pcapi.loadOffer.mockReset()
        pcapi.bulkCreateOrEditStock.mockReset()
      })

      it('should display an information message regarding booking cancellation', async () => {
        // when
        await renderOffers(props, store)

        // then
        const informationMessage = screen.getByText(
          'Les utilisateurs ont un délai de 48h pour annuler leur réservation mais ne peuvent pas le faire moins de 48h avant le début de l’événement. Si la date limite de réservation n’est pas encore passée, la place est alors automatiquement remise en vente.'
        )
        expect(informationMessage).toBeInTheDocument()
      })

      it('should display button to add date', async () => {
        // when
        await renderOffers(props, store)

        // then
        const buttonAddDate = await screen.findByRole('button', { name: 'Ajouter une date' })
        expect(buttonAddDate).toBeInTheDocument()
      })

      it("should display offer's stocks fields", async () => {
        // when
        await renderOffers(props, store)

        // then
        expect(pcapi.loadOffer).toHaveBeenCalledWith('AG3A')

        const columnHeaders = await screen.findAllByRole('columnheader')
        const columnCells = await screen.findAllByRole('cell')

        expect(columnHeaders).toHaveLength(8)

        expect(columnHeaders[0].textContent).toBe('Date')
        expect(columnCells[0].querySelector('input').value).toBe('20/12/2020')

        expect(columnHeaders[1].textContent).toBe('Horaire')
        expect(columnCells[1].querySelector('input').value).toBe('19:00')

        expect(columnHeaders[2].textContent).toBe('Prix')
        expect(columnCells[2].querySelector('input').value).toBe('10.01')

        expect(columnHeaders[3].textContent).toBe('Date limite de réservation')
        expect(columnCells[3].querySelector('input').value).toBe('18/12/2020')

        expect(columnHeaders[4].textContent).toBe('Quantité')
        expect(columnCells[4].querySelector('input').value).toBe('10')

        expect(columnHeaders[5].textContent).toBe('Stock restant')
        expect(columnCells[5].textContent).toBe('6')

        expect(columnHeaders[6].textContent).toBe('Réservations')
        expect(columnCells[6].textContent).toBe('4')

        expect(columnCells[7].querySelector('img[alt="Supprimer le stock"]')).toBeInTheDocument()
      })
    })

    describe('render thing offer', () => {
      let thingOffer
      beforeEach(() => {
        thingOffer = {
          ...defaultOffer,
          isEvent: false,
          stocks: [
            {
              ...defaultStock,
            },
          ],
        }
        pcapi.loadOffer.mockResolvedValue(thingOffer)
      })

      afterEach(() => {
        pcapi.loadOffer.mockReset()
        pcapi.bulkCreateOrEditStock.mockReset()
      })

      it('should display an information message regarding booking cancellation', async () => {
        // when
        await renderOffers(props, store)

        // then
        const informationMessage = screen.getByText(
          'Les utilisateurs ont 30 jours pour faire valider leur contremarque. Passé ce délai, la réservation est automatiquement annulée et l’offre remise en vente.'
        )
        expect(informationMessage).toBeInTheDocument()
      })

      it('should display button to add stock', async () => {
        // given
        const thingOfferWithoutStock = { ...thingOffer, stocks: [] }
        pcapi.loadOffer.mockResolvedValue(thingOfferWithoutStock)

        // when
        await renderOffers(props, store)

        // then
        expect(screen.getByRole('button', { name: 'Ajouter un stock' })).toBeEnabled()
      })

      it('should not be able to add a new stock if there is already one', async () => {
        // When
        await renderOffers(props, store)

        // Then
        expect(screen.getByRole('button', { name: 'Ajouter un stock' })).toBeDisabled()
      })

      it("should display offer's stock fields", async () => {
        // when
        await renderOffers(props, store)

        // then
        expect(pcapi.loadOffer).toHaveBeenCalledWith('AG3A')

        const columnHeaders = await screen.findAllByRole('columnheader')
        const columnCells = await screen.findAllByRole('cell')

        expect(columnHeaders).toHaveLength(6)

        expect(columnHeaders[0].textContent).toBe('Prix')
        expect(columnCells[0].querySelector('input').value).toBe('10.01')

        expect(columnHeaders[1].textContent).toBe('Date limite de réservation')
        expect(columnCells[1].querySelector('input').value).toBe('18/12/2020')

        expect(columnHeaders[2].textContent).toBe('Quantité')
        expect(columnCells[2].querySelector('input').value).toBe('10')

        expect(columnHeaders[3].textContent).toBe('Stock restant')
        expect(columnCells[3].textContent).toBe('6')

        expect(columnHeaders[4].textContent).toBe('Réservations')
        expect(columnCells[4].textContent).toBe('4')

        expect(columnCells[5].querySelector('img[alt="Supprimer le stock"]')).toBeInTheDocument()
      })

      describe('when offer is synchronized', () => {
        beforeEach(() => {
          const synchronisedThingOfferWithoutStock = {
            ...defaultOffer,
            isEvent: false,
            lastProvider: {
              id: 'D4',
              name: 'fnac',
            },
            stocks: [],
          }
          pcapi.loadOffer.mockResolvedValue(synchronisedThingOfferWithoutStock)
        })

        afterEach(() => {
          pcapi.loadOffer.mockReset()
          pcapi.bulkCreateOrEditStock.mockReset()
        })

        it('should not be able to add a stock', async () => {
          // When
          await renderOffers(props, store)

          // Then
          expect(screen.getByRole('button', { name: 'Ajouter un stock' })).toBeDisabled()
        })
      })
    })
  })

  describe('edit', () => {
    describe('event offer', () => {
      let eventOffer
      beforeEach(() => {
        eventOffer = {
          ...defaultOffer,
          isEvent: true,
          stocks: [
            {
              ...defaultStock,
              beginningDatetime: '2020-12-20T22:00:00Z',
            },
          ],
        }

        pcapi.loadOffer.mockResolvedValue(eventOffer)
      })

      afterEach(() => {
        pcapi.loadOffer.mockReset()
        pcapi.bulkCreateOrEditStock.mockReset()
      })

      describe('when offer has been manually created', () => {
        it('should not be able to edit a stock when expired', async () => {
          // Given
          const dayAfterBeginningDatetime = '2020-12-21T12:00:00Z'
          jest
            .spyOn(Date.prototype, 'toISOString')
            .mockImplementation(() => dayAfterBeginningDatetime)

          // When
          await renderOffers(props, store)

          // Then
          expect(screen.getByLabelText('Prix')).toBeDisabled()
          expect(screen.getByLabelText('Date de l’événement')).toBeDisabled()
          expect(screen.getByLabelText('Heure de l’événement')).toBeDisabled()
          expect(screen.getByLabelText('Date limite de réservation')).toBeDisabled()
          expect(screen.getByLabelText('Quantité')).toBeDisabled()
        })

        it('should not be able to delete a non deletable stock', async () => {
          // Given
          const eventOffer = {
            ...defaultOffer,
            isEvent: true,
            stocks: [
              {
                ...defaultStock,
                beginningDatetime: '2020-12-20T22:00:00Z',
                isEventDeletable: false,
              },
            ],
          }

          pcapi.loadOffer.mockResolvedValue(eventOffer)
          await renderOffers(props, store)

          // When
          fireEvent.click(screen.getByAltText('Supprimer le stock'))

          // Then
          expect(screen.getByAltText('Supprimer le stock').closest('button')).toBeDisabled()
          expect(pcapi.deleteStock).not.toHaveBeenCalled()
        })

        describe('when editing stock', () => {
          it('should be able to edit beginning date field', async () => {
            // given
            await renderOffers(props, store)

            // when
            fireEvent.click(screen.getByDisplayValue('20/12/2020'))
            fireEvent.click(screen.getByLabelText('day-21'))

            // then
            expect(screen.queryByDisplayValue('20/12/2020')).not.toBeInTheDocument()
            expect(screen.getByDisplayValue('21/12/2020')).toBeInTheDocument()
          })

          it('should not be able to select beginning date before today', async () => {
            // given
            await renderOffers(props, store)

            // when
            fireEvent.click(screen.getByDisplayValue('20/12/2020'))
            fireEvent.click(screen.getByLabelText('day-13'))

            // then
            expect(screen.queryByDisplayValue('13/12/2020')).not.toBeInTheDocument()
            expect(screen.getByDisplayValue('20/12/2020')).toBeInTheDocument()
          })

          it('should be able to remove date field', async () => {
            // given
            await renderOffers(props, store)

            // when
            fireEvent.change(screen.getByLabelText('Date de l’événement'), {
              target: { value: '' },
            })

            // then
            expect(screen.getByLabelText('Date de l’événement')).toBeEnabled()
          })

          it('should be able to edit hour field', async () => {
            // given
            await renderOffers(props, store)

            // when
            fireEvent.click(screen.getByDisplayValue('19:00'))
            fireEvent.click(screen.getByText('18:30'))

            // then
            expect(screen.queryByDisplayValue('19:00')).not.toBeInTheDocument()
            expect(screen.getByDisplayValue('18:30')).toBeInTheDocument()
          })

          it('should be able to edit price field', async () => {
            // given
            await renderOffers(props, store)

            // when
            fireEvent.change(screen.getByDisplayValue('10.01'), { target: { value: '127.03' } })

            // then
            expect(screen.queryByDisplayValue('10.01')).not.toBeInTheDocument()
            expect(screen.getByDisplayValue('127.03')).toBeInTheDocument()
          })

          it('should be able to edit booking limit date field', async () => {
            // given
            await renderOffers(props, store)

            // when
            fireEvent.click(screen.getByDisplayValue('18/12/2020'))
            fireEvent.click(screen.getByLabelText('day-17'))

            // then
            expect(screen.queryByDisplayValue('18/12/2020')).not.toBeInTheDocument()
            expect(screen.getByDisplayValue('17/12/2020')).toBeInTheDocument()
          })

          it('should not be able to select booking limit date after beginning date', async () => {
            // given
            await renderOffers(props, store)

            // when
            fireEvent.click(screen.getByDisplayValue('18/12/2020'))
            fireEvent.click(screen.getByLabelText('day-21'))

            // then
            expect(screen.queryByDisplayValue('21/12/2020')).not.toBeInTheDocument()
            expect(screen.getByDisplayValue('18/12/2020')).toBeInTheDocument()
          })

          it('should set booking limit datetime to beginning datetime when selecting a beginning datetime prior to booking limit datetime', async () => {
            // given
            await renderOffers(props, store)

            // when
            fireEvent.click(screen.getByDisplayValue('20/12/2020'))
            fireEvent.click(screen.getByLabelText('day-17'))

            // then
            expect(screen.getByLabelText('Date limite de réservation').value).toBe('17/12/2020')
          })

          it('should be able to edit total quantity field', async () => {
            // given
            await renderOffers(props, store)

            // when
            fireEvent.change(screen.getByDisplayValue('10'), { target: { value: '23' } })

            // then
            expect(screen.queryByDisplayValue('10')).not.toBeInTheDocument()
            expect(screen.getByDisplayValue('23')).toBeInTheDocument()
          })

          it('should not empty date field when emptying hour field', async () => {
            // given
            await renderOffers(props, store)

            // when
            fireEvent.change(screen.getByDisplayValue('19:00'), { target: { value: '' } })

            // then
            expect(screen.queryByDisplayValue('20/12/2020')).toBeInTheDocument()
          })

          it('should compute remaining quantity based on inputted total quantity', async () => {
            // given
            await renderOffers(props, store)

            // when
            fireEvent.change(screen.getByDisplayValue('10'), { target: { value: '9' } })

            // then
            const initialRemainingQuantity = screen.queryByText(6)
            expect(initialRemainingQuantity).not.toBeInTheDocument()

            const computedRemainingQuantity = screen.queryByText('5')
            expect(computedRemainingQuantity).toBeInTheDocument()
          })

          it('should set remaining quantity to Illimité when emptying total quantity field', async () => {
            // given
            await renderOffers(props, store)

            // when
            fireEvent.change(screen.getByDisplayValue('10'), { target: { value: '' } })

            // then
            const computedRemainingQuantity = screen.getByText('Illimité')
            expect(computedRemainingQuantity).toBeInTheDocument()
          })

          it('should not set remaining quantity to Illimité when total quantity is zero', async () => {
            // given
            pcapi.loadOffer.mockResolvedValue({
              ...eventOffer,
              stocks: [
                {
                  ...defaultStock,
                  beginningDatetime: '2020-12-20T22:00:00Z',
                  quantity: 0,
                  bookingsQuantity: 0,
                },
              ],
            })

            // when
            await renderOffers(props, store)

            // then
            expect(screen.getByLabelText('Quantité').value).not.toBe('')
            expect(screen.getByLabelText('Quantité').value).toBe('0')
            const remainingQuantityValue = screen.getAllByRole('cell')[5].textContent
            expect(remainingQuantityValue).not.toBe('Illimité')
            expect(remainingQuantityValue).toBe('0')
          })

          describe('when clicking on submit button', () => {
            beforeEach(() => {
              pcapi.bulkCreateOrEditStock.mockResolvedValue({})
            })

            afterEach(() => {
              pcapi.loadOffer.mockReset()
              pcapi.bulkCreateOrEditStock.mockReset()
            })

            it('should save changes done to stock', async () => {
              // Given
              await renderOffers(props, store)

              fireEvent.click(screen.getByLabelText('Date de l’événement'))
              fireEvent.click(screen.getByLabelText('day-26'))

              fireEvent.click(screen.getByLabelText('Heure de l’événement'))
              fireEvent.click(screen.getByText('20:00'))

              fireEvent.change(screen.getByLabelText('Prix'), { target: { value: 14.01 } })

              fireEvent.click(screen.getByLabelText('Date limite de réservation'))
              fireEvent.click(screen.getByLabelText('day-25'))

              fireEvent.change(screen.getByLabelText('Quantité'), { target: { value: 6 } })

              // When
              fireEvent.click(screen.getByText('Enregistrer'))

              // Then
              expect(pcapi.bulkCreateOrEditStock).toHaveBeenCalledWith(defaultOffer.id, [
                {
                  beginningDatetime: '2020-12-26T23:00:00Z',
                  bookingLimitDatetime: '2020-12-25T23:59:59Z',
                  id: '2E',
                  price: '14.01',
                  quantity: '6',
                },
              ])
              expect(screen.getByLabelText('Date de l’événement').value).toBe('26/12/2020')
              expect(screen.getByLabelText('Heure de l’événement').value).toBe('20:00')
              expect(screen.getByLabelText('Prix').value).toBe('14.01')
              expect(screen.getByLabelText('Date limite de réservation').value).toBe('25/12/2020')
              expect(screen.getByLabelText('Quantité').value).toBe('6')
            })

            it('should refresh offer', async () => {
              // Given
              const offer = {
                ...defaultOffer,
                isEvent: true,
              }
              const stock = {
                ...defaultStock,
                beginningDatetime: '2020-12-20T22:00:00Z',
              }
              const initialOffer = {
                ...offer,
                stocks: [
                  {
                    ...stock,
                    price: 10.01,
                  },
                ],
              }
              const updatedOffer = {
                ...offer,
                stocks: [
                  {
                    ...stock,
                    price: 10,
                  },
                ],
              }
              pcapi.loadOffer
                .mockResolvedValueOnce(initialOffer)
                .mockResolvedValueOnce(updatedOffer)
              await renderOffers(props, store)
              pcapi.loadOffer.mockClear()

              // When
              await act(async () => {
                await fireEvent.click(screen.getByText('Enregistrer'))
              })

              // Then
              expect(pcapi.loadOffer).toHaveBeenCalledTimes(1)
            })

            it('should set booking limit datetime to exact beginning datetime when not specified or same as beginning date', async () => {
              // Given
              await renderOffers(props, store)
              fireEvent.change(screen.getByLabelText('Date limite de réservation'), {
                target: { value: '' },
              })

              // When
              await act(async () => {
                await fireEvent.click(screen.getByText('Enregistrer'))
              })

              // Then
              const savedStocks = pcapi.bulkCreateOrEditStock.mock.calls[0][1]
              expect(savedStocks[0].bookingLimitDatetime).toBe('2020-12-20T22:00:00Z')
            })

            it('should set booking limit datetime to exact beginning datetime when same as beginning date', async () => {
              // Given
              await renderOffers(props, store)
              fireEvent.click(screen.getByLabelText('Date limite de réservation'))
              fireEvent.click(screen.getByLabelText('day-20'))

              // When
              await act(async () => {
                await fireEvent.click(screen.getByText('Enregistrer'))
              })

              // Then
              const savedStocks = pcapi.bulkCreateOrEditStock.mock.calls[0][1]
              expect(savedStocks[0].bookingLimitDatetime).toBe('2020-12-20T22:00:00Z')
            })

            it('should set booking limit time to end of selected day when specified and different than beginning date', async () => {
              // Given
              await renderOffers(props, store)
              fireEvent.click(screen.getByLabelText('Date limite de réservation'))
              fireEvent.click(screen.getByLabelText('day-19'))

              // When
              await act(async () => {
                await fireEvent.click(screen.getByText('Enregistrer'))
              })

              // Then
              const savedStocks = pcapi.bulkCreateOrEditStock.mock.calls[0][1]
              expect(savedStocks[0].bookingLimitDatetime).toBe('2020-12-19T23:59:59Z')
            })

            it('should set price to 0 when not specified', async () => {
              // Given
              await renderOffers(props, store)
              fireEvent.change(screen.getByLabelText('Prix'), { target: { value: '' } })

              // When
              await act(async () => {
                await fireEvent.click(screen.getByText('Enregistrer'))
              })

              // Then
              const savedStocks = pcapi.bulkCreateOrEditStock.mock.calls[0][1]
              expect(savedStocks[0].price).toBe(0)
            })

            it('should set quantity to null when not specified', async () => {
              // Given
              await renderOffers(props, store)
              fireEvent.change(screen.getByLabelText('Quantité'), { target: { value: '' } })

              // When
              await act(async () => {
                await fireEvent.click(screen.getByText('Enregistrer'))
              })

              // Then
              const savedStocks = pcapi.bulkCreateOrEditStock.mock.calls[0][1]
              expect(savedStocks[0].quantity).toBeNull()
            })

            it('should display error message on api error', async () => {
              // Given
              pcapi.bulkCreateOrEditStock.mockRejectedValueOnce({
                errors: {
                  price: 'Le prix est invalide.',
                  quantity: 'La quantité est invalide.',
                },
              })
              await renderOffers(props, store)

              fireEvent.click(screen.getByLabelText('Date de l’événement'))
              fireEvent.click(screen.getByLabelText('day-26'))

              fireEvent.click(screen.getByLabelText('Heure de l’événement'))
              fireEvent.click(screen.getByText('20:00'))

              // When
              await act(async () => {
                await fireEvent.click(screen.getByText('Enregistrer'))
              })

              // Then
              const errorMessage = await screen.findByText(
                'Une ou plusieurs erreurs sont présentes dans le formulaire.'
              )
              expect(errorMessage).toBeInTheDocument()
            })

            it('should not be able to submit changes when beginning date field is empty', async () => {
              // given
              await renderOffers(props, store)
              const beginningDateField = screen.getByDisplayValue('20/12/2020')
              fireEvent.change(beginningDateField, { target: { value: '' } })

              // when
              fireEvent.click(screen.getByText('Enregistrer'))

              // then
              const errorMessage = await screen.findByText(
                'Une ou plusieurs erreurs sont présentes dans le formulaire.'
              )
              expect(errorMessage).toBeInTheDocument()
              expect(pcapi.bulkCreateOrEditStock).not.toHaveBeenCalled()
            })

            it('should not be able to validate changes when hour field is empty', async () => {
              // given
              await renderOffers(props, store)
              const beginningHourField = screen.getByDisplayValue('19:00')
              fireEvent.change(beginningHourField, { target: { value: '' } })

              // when
              fireEvent.click(screen.getByText('Enregistrer'))

              // then
              const errorMessage = await screen.findByText(
                'Une ou plusieurs erreurs sont présentes dans le formulaire.'
              )
              expect(errorMessage).toBeInTheDocument()
              expect(pcapi.bulkCreateOrEditStock).not.toHaveBeenCalled()
            })

            it('should display error message on pre-submit error', async () => {
              // Given
              await renderOffers(props, store)

              fireEvent.click(screen.getByLabelText('Date de l’événement'))
              fireEvent.click(screen.getByLabelText('day-26'))

              fireEvent.click(screen.getByLabelText('Heure de l’événement'))
              fireEvent.click(screen.getByText('20:00'))

              fireEvent.change(screen.getByLabelText('Prix'), { target: { value: -10 } })
              fireEvent.change(screen.getByLabelText('Quantité'), { target: { value: -20 } })

              // When
              await fireEvent.click(screen.getByText('Enregistrer'))

              // Then
              const errorMessage = await screen.findByText(
                'Une ou plusieurs erreurs sont présentes dans le formulaire.'
              )
              expect(errorMessage).toBeInTheDocument()
            })

            it('should display success message on success', async () => {
              // Given
              pcapi.bulkCreateOrEditStock.mockResolvedValue({})
              await renderOffers(props, store)

              fireEvent.click(screen.getByLabelText('Date de l’événement'))
              fireEvent.click(screen.getByLabelText('day-26'))

              fireEvent.click(screen.getByLabelText('Heure de l’événement'))
              fireEvent.click(screen.getByText('20:00'))

              // When
              await fireEvent.click(screen.getByText('Enregistrer'))

              // Then
              const errorMessage = await screen.findByText('Vos stocks ont bien été sauvegardés.')
              expect(errorMessage).toBeInTheDocument()
            })
          })
        })

        describe('when deleting stock', () => {
          it('should display confirmation dialog box with focus on confirmation button', async () => {
            // Given
            await renderOffers(props, store)

            // When
            fireEvent.click(screen.getByAltText('Supprimer le stock'))

            // Then
            expect(screen.getByLabelText('Voulez-vous supprimer ce stock ?')).toBeInTheDocument()
            expect(
              queryByTextTrimHtml(
                screen,
                'Ce stock ne sera plus disponible à la réservation et entraînera l’annulation des réservations en cours !'
              )
            ).toBeInTheDocument()
            expect(
              screen.getByText('entraînera l’annulation des réservations en cours !', {
                selector: 'strong',
              })
            ).toBeInTheDocument()
            expect(
              screen.getByText(
                'L’ensemble des utilisateurs concernés sera automatiquement averti par e-mail.'
              )
            ).toBeInTheDocument()
            expect(screen.getByRole('button', { name: 'Supprimer' })).toHaveFocus()
          })

          it('should be able to delete a stock', async () => {
            // Given
            await renderOffers(props, store)

            // When
            fireEvent.click(screen.getByAltText('Supprimer le stock'))
            fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }))

            // Then
            expect(pcapi.deleteStock).toHaveBeenCalledWith(stockId)
          })

          it('should not delete stock if aborting on confirmation', async () => {
            // Given
            await renderOffers(props, store)

            // When
            fireEvent.click(screen.getByAltText('Supprimer le stock'))
            fireEvent.click(screen.getByRole('button', { name: 'Annuler' }))

            // Then
            expect(pcapi.deleteStock).not.toHaveBeenCalled()
          })

          it('should discard deleted stock from list', async () => {
            // Given
            const eventOffer = {
              ...defaultOffer,
              isEvent: true,
              stocks: [
                {
                  ...defaultStock,
                  beginningDatetime: '2020-12-20T22:00:00Z',
                },
              ],
            }
            const eventOfferWithoutStock = {
              ...defaultOffer,
              isEvent: true,
              stocks: [],
            }
            pcapi.loadOffer
              .mockResolvedValueOnce(eventOffer)
              .mockResolvedValueOnce(eventOfferWithoutStock)

            await renderOffers(props, store)

            // When
            await act(async () => {
              fireEvent.click(await screen.findByAltText('Supprimer le stock'))
              await fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }))
            })

            // Then
            expect(screen.getAllByRole('row')).toHaveLength(1)
          })

          it('should display a success message after deletion', async () => {
            // Given
            await renderOffers(props, store)

            // When
            fireEvent.click(screen.getByAltText('Supprimer le stock'))
            fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }))

            // Then
            expect(await screen.findByText('Le stock a été supprimé.')).toBeInTheDocument()
          })

          it('should display an error message when deletion fails', async () => {
            // Given
            pcapi.deleteStock.mockRejectedValue({})
            await renderOffers(props, store)

            // When
            fireEvent.click(screen.getByAltText('Supprimer le stock'))
            fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }))

            // Then
            expect(
              await screen.findByText('Une erreur est survenue lors de la suppression du stock.')
            ).toBeInTheDocument()
          })

          it('should disable deleting button', async () => {
            // given
            await renderOffers(props, store)

            // when
            await act(async () => {
              fireEvent.click(await screen.findByAltText('Supprimer le stock'))
            })

            // then
            expect(screen.getByAltText('Supprimer le stock').closest('button')).toBeDisabled()
          })
        })
      })

      describe('when offer has been synchronized with Allocine', () => {
        beforeEach(() => {
          const eventOfferFromAllocine = {
            ...eventOffer,
            lastProvider: {
              id: 'CY',
              name: 'allociné',
            },
          }

          pcapi.loadOffer.mockResolvedValue(eventOfferFromAllocine)
        })

        afterEach(() => {
          pcapi.loadOffer.mockReset()
          pcapi.bulkCreateOrEditStock.mockReset()
        })

        describe('when editing stock', () => {
          it('should be able to update price and quantity but not beginning date nor hour fields', async () => {
            // When
            await renderOffers(props, store)

            // Then
            expect(screen.getByLabelText('Date de l’événement')).toBeDisabled()
            expect(screen.getByLabelText('Heure de l’événement')).toBeDisabled()
            expect(screen.getByLabelText('Date limite de réservation')).toBeEnabled()
            expect(screen.getByLabelText('Prix')).toBeEnabled()
            expect(screen.getByLabelText('Quantité')).toBeEnabled()
          })
        })
      })
    })

    describe('thing offer', () => {
      let thingOffer
      beforeEach(() => {
        thingOffer = {
          ...defaultOffer,
          isEvent: false,
          stocks: [
            {
              ...defaultStock,
              isEventDeletable: true,
            },
          ],
        }
        pcapi.loadOffer.mockResolvedValue(thingOffer)
      })

      afterEach(() => {
        pcapi.loadOffer.mockReset()
        pcapi.bulkCreateOrEditStock.mockReset()
      })

      describe('when offer has been manually created', () => {
        it('should be able to edit price field', async () => {
          // given
          await renderOffers(props, store)

          // when
          fireEvent.change(screen.getByDisplayValue('10.01'), { target: { value: '127.03' } })

          // then
          expect(screen.queryByDisplayValue('10.01')).not.toBeInTheDocument()
          expect(screen.getByDisplayValue('127.03')).toBeInTheDocument()
        })

        it('should be able to edit booking limit date field', async () => {
          // given
          await renderOffers(props, store)

          // when
          fireEvent.click(screen.getByDisplayValue('18/12/2020'))
          fireEvent.click(screen.getByLabelText('day-17'))

          // then
          expect(screen.queryByDisplayValue('18/12/2020')).not.toBeInTheDocument()
          expect(screen.getByDisplayValue('17/12/2020')).toBeInTheDocument()
        })

        it('should be able to edit total quantity field', async () => {
          // given
          await renderOffers(props, store)

          // when
          fireEvent.change(screen.getByDisplayValue('10'), { target: { value: '23' } })

          // then
          expect(screen.queryByDisplayValue('10')).not.toBeInTheDocument()
          expect(screen.getByDisplayValue('23')).toBeInTheDocument()
        })

        it('should compute remaining quantity based on inputted total quantity', async () => {
          // given
          await renderOffers(props, store)

          // when
          fireEvent.change(screen.getByDisplayValue('10'), { target: { value: '9' } })

          // then
          const initialRemainingQuantity = screen.queryByText(6)
          expect(initialRemainingQuantity).not.toBeInTheDocument()

          const computedRemainingQuantity = screen.queryByText('5')
          expect(computedRemainingQuantity).toBeInTheDocument()
        })

        it('should set remaining quantity to Illimité when emptying total quantity field', async () => {
          // given
          await renderOffers(props, store)

          // when
          fireEvent.change(screen.getByDisplayValue('10'), { target: { value: '' } })

          // then
          const computedRemainingQuantity = screen.getByText('Illimité')
          expect(computedRemainingQuantity).toBeInTheDocument()
        })

        it('should not set remaining quantity to Illimité when total quantity is zero', async () => {
          // given
          pcapi.loadOffer.mockResolvedValue({
            ...thingOffer,
            stocks: [{ ...defaultStock, quantity: 0, bookingsQuantity: 0 }],
          })

          // when
          await renderOffers(props, store)

          // then
          expect(screen.getByLabelText('Quantité').value).not.toBe('')
          expect(screen.getByLabelText('Quantité').value).toBe('0')
          const remainingQuantityValue = screen.getAllByRole('cell')[3].textContent
          expect(remainingQuantityValue).not.toBe('Illimité')
          expect(remainingQuantityValue).toBe('0')
        })

        describe('when clicking on submit button', () => {
          it('should save changes done to stock', async () => {
            // Given
            pcapi.bulkCreateOrEditStock.mockResolvedValue({})
            await renderOffers(props, store)

            fireEvent.change(screen.getByLabelText('Prix'), { target: { value: 14.01 } })

            fireEvent.click(screen.getByLabelText('Date limite de réservation'))
            fireEvent.click(screen.getByLabelText('day-25'))

            fireEvent.change(screen.getByLabelText('Quantité'), { target: { value: 6 } })

            // When
            fireEvent.click(screen.getByText('Enregistrer'))

            // Then
            expect(pcapi.bulkCreateOrEditStock).toHaveBeenCalledWith(defaultOffer.id, [
              {
                bookingLimitDatetime: '2020-12-25T23:59:59Z',
                id: '2E',
                price: '14.01',
                quantity: '6',
              },
            ])
            expect(screen.getByLabelText('Prix').value).toBe('14.01')
            expect(screen.getByLabelText('Date limite de réservation').value).toBe('25/12/2020')
            expect(screen.getByLabelText('Quantité').value).toBe('6')
          })

          it('should refresh offer and leave edition mode', async () => {
            // Given
            pcapi.bulkCreateOrEditStock.mockResolvedValue({})
            const initialOffer = {
              ...defaultOffer,
              stocks: [
                {
                  ...defaultStock,
                  price: 10.01,
                },
              ],
            }
            const updatedOffer = {
              ...defaultOffer,
              stocks: [
                {
                  ...defaultStock,
                  price: 10,
                },
              ],
            }
            pcapi.loadOffer.mockResolvedValueOnce(initialOffer).mockResolvedValueOnce(updatedOffer)
            await renderOffers(props, store)
            pcapi.loadOffer.mockClear()

            // When
            await act(async () => {
              await fireEvent.click(screen.getByText('Enregistrer'))
            })

            // Then
            expect(pcapi.loadOffer).toHaveBeenCalledTimes(1)
          })

          it('should set booking limit time to end of selected day when specified', async () => {
            // Given
            pcapi.bulkCreateOrEditStock.mockResolvedValue({})
            await renderOffers(props, store)
            fireEvent.click(screen.getByLabelText('Date limite de réservation'))
            fireEvent.click(screen.getByLabelText('day-19'))

            // When
            fireEvent.click(screen.getByText('Enregistrer'))

            // Then
            const savedStocks = pcapi.bulkCreateOrEditStock.mock.calls[0][1]
            expect(savedStocks[0].bookingLimitDatetime).toBe('2020-12-19T23:59:59Z')
          })

          it('should set booking limit datetime to null when not specified', async () => {
            // Given
            pcapi.bulkCreateOrEditStock.mockResolvedValue({})
            await renderOffers(props, store)
            fireEvent.change(screen.getByLabelText('Date limite de réservation'), {
              target: { value: '' },
            })

            // When
            fireEvent.click(screen.getByText('Enregistrer'))

            // Then
            const savedStocks = pcapi.bulkCreateOrEditStock.mock.calls[0][1]
            expect(savedStocks[0].bookingLimitDatetime).toBeNull()
          })

          it('should set price to 0 when not specified', async () => {
            // Given
            pcapi.bulkCreateOrEditStock.mockResolvedValue({})
            await renderOffers(props, store)
            fireEvent.change(screen.getByLabelText('Prix'), { target: { value: '' } })

            // When
            fireEvent.click(screen.getByText('Enregistrer'))
            // Then
            const savedStocks = pcapi.bulkCreateOrEditStock.mock.calls[0][1]
            expect(savedStocks[0].price).toBe(0)
          })

          it('should set quantity to null when not specified', async () => {
            // Given
            pcapi.bulkCreateOrEditStock.mockResolvedValue({})
            await renderOffers(props, store)
            fireEvent.change(screen.getByLabelText('Quantité'), { target: { value: '' } })

            // When
            fireEvent.click(screen.getByText('Enregistrer'))
            // Then
            const savedStocks = pcapi.bulkCreateOrEditStock.mock.calls[0][1]
            expect(savedStocks[0].quantity).toBeNull()
          })

          it('should display error message on api error', async () => {
            // Given
            pcapi.bulkCreateOrEditStock.mockRejectedValueOnce({
              errors: {
                price: 'Le prix est invalide.',
                quantity: 'La quantité est invalide.',
              },
            })
            await renderOffers(props, store)

            fireEvent.change(screen.getByLabelText('Quantité'), { target: { value: '10' } })

            // When
            await fireEvent.click(screen.getByText('Enregistrer'))

            // Then
            const errorMessage = await screen.findByText(
              'Une ou plusieurs erreurs sont présentes dans le formulaire.'
            )
            expect(errorMessage).toBeInTheDocument()
          })

          it('should display error message on pre-submit error', async () => {
            // Given
            await renderOffers(props, store)

            fireEvent.change(screen.getByLabelText('Prix'), { target: { value: -10 } })
            fireEvent.change(screen.getByLabelText('Quantité'), { target: { value: -20 } })

            // When
            await fireEvent.click(screen.getByText('Enregistrer'))

            // Then
            const errorMessage = await screen.findByText(
              'Une ou plusieurs erreurs sont présentes dans le formulaire.'
            )
            expect(errorMessage).toBeInTheDocument()
          })

          it('should display success message on success', async () => {
            // Given
            pcapi.bulkCreateOrEditStock.mockResolvedValue({})
            await renderOffers(props, store)

            fireEvent.change(screen.getByLabelText('Quantité'), { target: { value: '10' } })

            // When
            await fireEvent.click(screen.getByText('Enregistrer'))

            // Then
            const errorMessage = await screen.findByText('Vos stocks ont bien été sauvegardés.')
            expect(errorMessage).toBeInTheDocument()
          })
        })
      })

      describe('when offer has been synchronized (with Titelive, leslibraires.fr, FNAC or Praxiel)', () => {
        beforeEach(() => {
          const synchronisedThingOffer = {
            ...thingOffer,
            lastProvider: {
              id: 'D4',
              name: 'fnac',
            },
          }
          pcapi.loadOffer.mockResolvedValue(synchronisedThingOffer)
        })

        afterEach(() => {
          pcapi.loadOffer.mockReset()
          pcapi.bulkCreateOrEditStock.mockReset()
        })

        it('should not be able to edit a stock', async () => {
          // When
          await renderOffers(props, store)

          // Then
          expect(screen.getByLabelText('Prix')).toBeDisabled()
          expect(screen.getByLabelText('Date limite de réservation')).toBeDisabled()
          expect(screen.getByLabelText('Quantité')).toBeDisabled()
        })

        it('should not be able to delete a stock', async () => {
          // When
          await renderOffers(props, store)

          // Then
          expect(screen.getByAltText('Supprimer le stock').closest('button')).toBeDisabled()
        })
      })
    })
  })

  describe('create', () => {
    describe('event offer', () => {
      let noStockOffer
      beforeEach(() => {
        noStockOffer = {
          ...defaultOffer,
          isEvent: true,
          stocks: [],
        }

        pcapi.loadOffer.mockResolvedValue(noStockOffer)
      })

      afterEach(() => {
        pcapi.loadOffer.mockReset()
        pcapi.bulkCreateOrEditStock.mockReset()
      })

      it('should append new stock line on top of stocks list when clicking on add button', async () => {
        // given
        const eventOffer = {
          ...defaultOffer,
          isEvent: true,
          stocks: [
            {
              ...defaultStock,
              beginningDatetime: '2020-12-20T22:00:00Z',
            },
          ],
        }
        pcapi.loadOffer.mockResolvedValue(eventOffer)
        await renderOffers(props, store)
        fireEvent.click(screen.getByText('Ajouter une date'))

        // when
        fireEvent.click(screen.getByText('Ajouter une date'))

        // then
        expect(screen.getAllByRole('row')).toHaveLength(4)
        const eventsDates = screen.getAllByLabelText('Date de l’événement')
        expect(eventsDates[0].value).toBe('')
        expect(eventsDates[1].value).toBe('')
        expect(eventsDates[2].value).toBe('20/12/2020')
      })

      it('should have date, hour, price, limit datetime and quantity fields emptied by default', async () => {
        // given
        await renderOffers(props, store)

        // when
        fireEvent.click(screen.getByText('Ajouter une date'))

        // then
        expect(screen.getByLabelText('Date de l’événement').value).toBe('')
        expect(screen.getByLabelText('Heure de l’événement').value).toBe('')
        expect(screen.getByLabelText('Prix').value).toBe('')
        expect(screen.getByLabelText('Date limite de réservation').value).toBe('')
        expect(screen.getByLabelText('Quantité').value).toBe('')
      })

      it('should not have remaining stocks and bookings columns', async () => {
        // given
        await renderOffers(props, store)

        // when
        fireEvent.click(screen.getByText('Ajouter une date'))

        // then
        const columnCells = screen.getAllByRole('cell')
        expect(columnCells[3].textContent).toBe('')
        expect(columnCells[4].textContent).toBe('')
      })

      it('should have a cancel button to cancel new stock', async () => {
        // given
        await renderOffers(props, store)

        // when
        fireEvent.click(screen.getByText('Ajouter une date'))

        // then
        expect(screen.queryByAltText('Supprimer le stock')).toBeInTheDocument()
      })

      it('should add new stocks to stocks and remove new empty stock line when clicking on validate button', async () => {
        // given
        pcapi.bulkCreateOrEditStock.mockResolvedValue({})
        const offer = {
          ...defaultOffer,
          isEvent: true,
        }
        const initialOffer = {
          ...offer,
          stocks: [],
        }
        const updatedOffer = {
          ...offer,
          stocks: [
            {
              quantity: 15,
              price: 15,
              remainingQuantity: 15,
              bookingsQuantity: 0,
              beginningDatetime: '2020-12-24T23:00:00Z',
              bookingLimitDatetime: '2020-12-22T23:59:59Z',
              id: '2E',
              isEventDeletable: true,
            },
            {
              quantity: 15,
              price: 15,
              remainingQuantity: 15,
              bookingsQuantity: 0,
              beginningDatetime: '2020-12-25T23:00:00Z',
              bookingLimitDatetime: '2020-12-23T23:59:59Z',
              id: '3E',
              isEventDeletable: true,
            },
          ],
        }
        pcapi.loadOffer.mockResolvedValueOnce(initialOffer).mockResolvedValueOnce(updatedOffer)
        await renderOffers(props, store)

        fireEvent.click(screen.getByText('Ajouter une date'))

        fireEvent.click(screen.getAllByLabelText('Date de l’événement')[0])
        fireEvent.click(screen.getByLabelText('day-24'))

        fireEvent.click(screen.getAllByLabelText('Heure de l’événement')[0])
        fireEvent.click(screen.getByText('20:00'))

        fireEvent.change(screen.getByLabelText('Prix'), { target: { value: 15 } })

        fireEvent.click(screen.getAllByLabelText('Date limite de réservation')[0])
        fireEvent.click(screen.getByLabelText('day-22'))

        fireEvent.change(screen.getByLabelText('Quantité'), { target: { value: 15 } })

        fireEvent.click(screen.getByText('Ajouter une date'))

        fireEvent.click(screen.getAllByLabelText('Date de l’événement')[0])
        fireEvent.click(screen.getByLabelText('day-25'))

        fireEvent.click(screen.getAllByLabelText('Heure de l’événement')[0])
        fireEvent.click(screen.getByText('20:00'))

        fireEvent.click(screen.getAllByLabelText('Date limite de réservation')[0])
        fireEvent.click(screen.getByLabelText('day-23'))

        // when
        await act(async () => {
          await fireEvent.click(screen.getByText('Enregistrer'))
        })

        // then
        expect(pcapi.bulkCreateOrEditStock).toHaveBeenCalledWith(offer.id, [
          {
            beginningDatetime: '2020-12-25T23:00:00Z',
            bookingLimitDatetime: '2020-12-23T23:59:59Z',
            price: 0,
            quantity: null,
          },
          {
            beginningDatetime: '2020-12-24T23:00:00Z',
            bookingLimitDatetime: '2020-12-22T23:59:59Z',
            price: '15',
            quantity: '15',
          },
        ])
        expect(screen.getAllByRole('row')).toHaveLength(3)
      })

      it('should cancel new stock addition when clicking on cancel button', async () => {
        // Given
        await renderOffers(props, store)
        fireEvent.click(screen.getByText('Ajouter une date'))

        // When
        fireEvent.click(screen.getByAltText('Supprimer le stock'))

        // Then
        expect(pcapi.bulkCreateOrEditStock).not.toHaveBeenCalled()
        expect(screen.getAllByRole('row')).toHaveLength(1)
      })

      it('should be able to add second stock while first one is not validated', async () => {
        // Given
        await renderOffers(props, store)

        // When
        fireEvent.click(screen.getByText('Ajouter une date'))

        // Then
        expect(screen.getByText('Ajouter une date')).toBeEnabled()
      })

      it('should display error message on api error', async () => {
        // Given
        pcapi.bulkCreateOrEditStock.mockRejectedValueOnce({
          errors: {
            price: 'Le prix est invalide.',
            quantity: 'La quantité est invalide.',
          },
        })
        await renderOffers(props, store)
        fireEvent.click(screen.getByText('Ajouter une date'))

        fireEvent.click(screen.getByLabelText('Date de l’événement'))
        fireEvent.click(screen.getByLabelText('day-26'))

        fireEvent.click(screen.getByLabelText('Heure de l’événement'))
        fireEvent.click(screen.getByText('20:00'))

        // When
        await fireEvent.click(screen.getByText('Enregistrer'))

        // Then
        const errorMessage = await screen.findByText(
          'Une ou plusieurs erreurs sont présentes dans le formulaire.'
        )
        expect(errorMessage).toBeInTheDocument()
      })

      it('should display error message on pre-submit error', async () => {
        // Given
        await renderOffers(props, store)
        fireEvent.click(screen.getByText('Ajouter une date'))

        fireEvent.click(screen.getByLabelText('Date de l’événement'))
        fireEvent.click(screen.getByLabelText('day-26'))

        fireEvent.click(screen.getByLabelText('Heure de l’événement'))
        fireEvent.click(screen.getByText('20:00'))

        fireEvent.change(screen.getByLabelText('Prix'), { target: { value: -10 } })
        fireEvent.change(screen.getByLabelText('Quantité'), { target: { value: -20 } })

        // When
        await fireEvent.click(screen.getByText('Enregistrer'))

        // Then
        const errorMessage = await screen.findByText(
          'Une ou plusieurs erreurs sont présentes dans le formulaire.'
        )
        expect(errorMessage).toBeInTheDocument()
        expect(pcapi.bulkCreateOrEditStock).toHaveBeenCalledTimes(0)
      })

      it('should display success message on success', async () => {
        // Given
        pcapi.bulkCreateOrEditStock.mockResolvedValue({})
        await renderOffers(props, store)
        fireEvent.click(screen.getByText('Ajouter une date'))

        fireEvent.click(screen.getByLabelText('Date de l’événement'))
        fireEvent.click(screen.getByLabelText('day-26'))

        fireEvent.click(screen.getByLabelText('Heure de l’événement'))
        fireEvent.click(screen.getByText('20:00'))

        // When
        await fireEvent.click(screen.getByText('Enregistrer'))

        // Then
        const errorMessage = await screen.findByText('Vos stocks ont bien été sauvegardés.')
        expect(errorMessage).toBeInTheDocument()
      })
    })

    describe('thing offer', () => {
      let noStockOffer
      beforeEach(() => {
        noStockOffer = {
          ...defaultOffer,
          isEvent: false,
          stocks: [],
        }

        pcapi.loadOffer.mockResolvedValue(noStockOffer)
      })

      afterEach(() => {
        pcapi.loadOffer.mockReset()
        pcapi.bulkCreateOrEditStock.mockReset()
      })

      it('should append new stock line when clicking on add button', async () => {
        // given
        const thingOffer = {
          ...defaultOffer,
          isEvent: false,
          stocks: [],
        }
        pcapi.loadOffer.mockResolvedValue(thingOffer)
        await renderOffers(props, store)

        // when
        fireEvent.click(screen.getByText('Ajouter un stock'))

        // then
        expect(screen.getAllByRole('row')).toHaveLength(2)
      })

      it('should have price, limit datetime and quantity fields emptied by default', async () => {
        // given
        await renderOffers(props, store)

        // when
        fireEvent.click(screen.getByText('Ajouter un stock'))

        // then
        expect(screen.getByLabelText('Prix').value).toBe('')
        expect(screen.getByLabelText('Date limite de réservation').value).toBe('')
        expect(screen.getByLabelText('Quantité').value).toBe('')
      })

      it('should not have remaining stocks and bookings columns', async () => {
        // given
        await renderOffers(props, store)

        // when
        fireEvent.click(screen.getByText('Ajouter un stock'))

        // then
        const columnCells = screen.getAllByRole('cell')
        expect(columnCells[3].textContent).toBe('')
        expect(columnCells[4].textContent).toBe('')
      })

      it('should have a cancel button to cancel new stock', async () => {
        // given
        await renderOffers(props, store)

        // when
        fireEvent.click(screen.getByText('Ajouter un stock'))

        // then
        expect(screen.queryByAltText('Supprimer le stock')).toBeInTheDocument()
      })

      it('should add new stock to stocks and remove new empty stock line when clicking on validate button', async () => {
        // given
        pcapi.bulkCreateOrEditStock.mockResolvedValue({})
        const offer = {
          ...defaultOffer,
          isEvent: false,
        }
        const initialOffer = {
          ...offer,
          stocks: [],
        }
        const updatedOffer = {
          ...offer,
          stocks: [
            {
              quantity: 15,
              price: 15,
              remainingQuantity: 15,
              bookingsQuantity: 0,
              beginningDatetime: '2020-12-24T23:00:00Z',
              bookingLimitDatetime: '2020-12-22T23:59:59Z',
              id: stockId,
              isEventDeletable: true,
            },
          ],
        }
        pcapi.loadOffer.mockResolvedValueOnce(initialOffer).mockResolvedValueOnce(updatedOffer)
        await renderOffers(props, store)

        fireEvent.click(screen.getByText('Ajouter un stock'))

        fireEvent.change(screen.getByLabelText('Prix'), { target: { value: 15 } })

        fireEvent.click(screen.getByLabelText('Date limite de réservation'))
        fireEvent.click(screen.getByLabelText('day-22'))

        fireEvent.change(screen.getByLabelText('Quantité'), { target: { value: 15 } })

        // when
        await act(async () => {
          await fireEvent.click(screen.getByText('Enregistrer'))
        })

        // then
        expect(pcapi.bulkCreateOrEditStock).toHaveBeenCalledWith('AG3A', [
          {
            bookingLimitDatetime: '2020-12-22T23:59:59Z',
            price: '15',
            quantity: '15',
          },
        ])
        expect(screen.getAllByRole('row')).toHaveLength(2)
      })

      it('should display error message on api error', async () => {
        // Given
        pcapi.bulkCreateOrEditStock.mockRejectedValue({
          errors: {
            price: 'Le prix est invalide.',
            quantity: 'La quantité est invalide.',
          },
        })
        await renderOffers(props, store)
        fireEvent.click(screen.getByText('Ajouter un stock'))

        fireEvent.change(screen.getByLabelText('Quantité'), { target: { value: 15 } })

        // When
        await fireEvent.click(screen.getByText('Enregistrer'))

        // Then
        const errorMessage = await screen.findByText(
          'Une ou plusieurs erreurs sont présentes dans le formulaire.'
        )
        expect(errorMessage).toBeInTheDocument()
      })

      it('should display error message on pre-submit error', async () => {
        // Given
        await renderOffers(props, store)
        fireEvent.click(screen.getByText('Ajouter un stock'))

        fireEvent.change(screen.getByLabelText('Prix'), { target: { value: -10 } })
        fireEvent.change(screen.getByLabelText('Quantité'), { target: { value: -20 } })

        // When
        await fireEvent.click(screen.getByText('Enregistrer'))

        // Then
        const errorMessage = await screen.findByText(
          'Une ou plusieurs erreurs sont présentes dans le formulaire.'
        )
        expect(errorMessage).toBeInTheDocument()
        expect(pcapi.bulkCreateOrEditStock).toHaveBeenCalledTimes(0)
      })

      it('should display success message on success', async () => {
        // Given
        pcapi.bulkCreateOrEditStock.mockResolvedValue({})
        await renderOffers(props, store)
        fireEvent.click(screen.getByText('Ajouter un stock'))

        fireEvent.change(screen.getByLabelText('Quantité'), { target: { value: 15 } })

        // When
        await fireEvent.click(screen.getByText('Enregistrer'))

        // Then
        const errorMessage = await screen.findByText('Vos stocks ont bien été sauvegardés.')
        expect(errorMessage).toBeInTheDocument()
      })

      it('should cancel new stock addition when clicking on cancel button', async () => {
        // Given
        await renderOffers(props, store)
        fireEvent.click(screen.getByText('Ajouter un stock'))

        // When
        fireEvent.click(screen.getByAltText('Supprimer le stock'))

        // Then
        expect(pcapi.bulkCreateOrEditStock).not.toHaveBeenCalled()
        expect(screen.getAllByRole('row')).toHaveLength(1)
      })

      it('should not be able to add second stock while first one is not validated', async () => {
        // Given
        await renderOffers(props, store)

        // When
        fireEvent.click(screen.getByText('Ajouter un stock'))

        // Then
        expect(screen.getByText('Ajouter un stock')).toBeDisabled()
      })
    })
  })
})
