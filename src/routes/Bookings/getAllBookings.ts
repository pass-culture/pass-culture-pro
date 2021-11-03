import { MAX_LOADED_PAGES } from 'constants/booking'
import * as pcapi from 'repository/pcapi'

const mergeResponses = (
  previousResult:ILoadBookingResponse,
  currentResult:ILoadBookingResponse
): ILoadBookingResponse => ({
  ...previousResult,
  ...currentResult,
  bookings_recap: [
    ...previousResult.bookings_recap,
    ...currentResult.bookings_recap
  ]
})

interface ILoadRemainingBookingPages {
  totalPages: number;
  initialResult: ILoadBookingResponse;
  bookingsFilters: ILoadBookingParams;
}

const loadRemainingBookingPages = async ({
  totalPages,
  initialResult,
  bookingsFilters
} : ILoadRemainingBookingPages) => {
  let currentPage = 1
  const remainingCalls: Promise<ILoadBookingResponse>[] = []

  while (currentPage < totalPages) {
    currentPage += 1
    remainingCalls.push(pcapi.loadFilteredBookingsRecap({ ...bookingsFilters, page: currentPage }))
  }

  return await Promise.all(remainingCalls)
    .then((results) => {
      return results.reduce(mergeResponses, { ...initialResult })
    })
    .catch((err) => {
      /* @debt bugRisk "Gaël: handle error properly"*/
      console.log(err)
      return {
        ...initialResult,
        requestStatus: 'error',
      }
    })

}

const serializeBooking = (booking: IBooking): ITableBooking => ({
  offer: {
    name: booking.stock.offer_name,
    id: booking.stock.offer_identifier,
    eventBeginningDate: booking.stock.event_beginning_datetime,
    isbn: booking.stock.offer_isbn,
  },
  venue: {
    name: booking.venue.name,
    id: booking.venue.identifier,
    isVirtual: booking.venue.is_virtual,
  },
  beneficiary: {
    lastname: booking.beneficiary.lastname,
    firstname: booking.beneficiary.firstname,
    email: booking.beneficiary.email,
    phonenumber: booking.beneficiary.phonenumber,
  },
  token: booking.booking_token,
  date: booking.booking_date,
  status: booking.booking_status,
  isDuo: booking.booking_is_duo,
  amount: booking.booking_amount,
  statusHistory: booking.booking_status_history,
  offererName: booking.offerer.name
})

const getAllBookings: GetAllBookings = async (
  filters
) => {
  const bookingsFilters:ILoadBookingParams = {
    page: 1,
    venueId: filters.offerVenueId,
    eventDate: filters.offerEventDate,
    bookingPeriodBeginningDate: filters.bookingBeginningDate,
    bookingPeriodEndingDate: filters.bookingEndingDate,
  }

  const initialResult = await pcapi.loadFilteredBookingsRecap({ ...bookingsFilters })
    .catch(() => {
      return {
        requestStatus: 'error',
        page: 0,
        pages: 0,
        total: 0,
        bookings_recap: [],
      }
    })
  
  const totalPages = Math.min(initialResult.pages, MAX_LOADED_PAGES)

  const result = totalPages > 1
    ? await loadRemainingBookingPages({
      initialResult,
      totalPages,
      bookingsFilters
    })
    : initialResult

  return {
    hasReachedBookingsCountLimit: result.page === MAX_LOADED_PAGES && result.page < result.pages,
    bookingList: result.bookings_recap.map(serializeBooking),
    requestStatus: result.requestStatus || 'success'
  }
}

export default getAllBookings