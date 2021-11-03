type BookingFilter<T> = (searchType: T, booking: ITableBooking) => boolean


const doesOfferNameMatchFilter: BookingFilter<string> = (offerName, booking) => {
  const offerNameFromBooking = _sanitize(booking.offer.name)
  return offerNameFromBooking.includes(_sanitize(offerName))
}

const doesBookingBeneficiaryMatchFilter: BookingFilter<string> = (bookingBeneficiary, booking) => {
  const beneficiarySanitarized = _sanitize(bookingBeneficiary)
  const beneficiaryLastNameFromBooking = _sanitize(booking.beneficiary.lastname)
  const beneficiaryFirstNameFromBooking = _sanitize(booking.beneficiary.firstname)
  const beneficiaryEmailFromBooking = _sanitize(booking.beneficiary.email)

  const firstNameLastName = beneficiaryFirstNameFromBooking.concat(
    ' ',
    beneficiaryLastNameFromBooking
  )
  const lastNameFirstName = beneficiaryLastNameFromBooking.concat(
    ' ',
    beneficiaryFirstNameFromBooking
  )

  const referential = [
    beneficiaryLastNameFromBooking,
    beneficiaryFirstNameFromBooking,
    beneficiaryEmailFromBooking,
    firstNameLastName,
    lastNameFirstName,
  ]

  return referential.filter(item => item.includes(beneficiarySanitarized)).length > 0
}

const doesBookingTokenMatchFilter: BookingFilter<string> = (bookingToken, booking) => {
  if (booking.token === null) {
    return false
  }
  const bookingTokenFromBooking = booking.token.toLowerCase()
  return bookingTokenFromBooking.includes(bookingToken.toLowerCase().trim())
}

const doesISBNMatchFilter: BookingFilter<string> = (
  isbn,
  booking
) => {
  if (booking.offer?.isbn) {
    return booking.offer.isbn.includes(isbn.trim())
  }
  return false
}

const doesBookingStatusMatchFilter: BookingFilter<BookingStatus[]> = (statuses, booking) => {
  if (statuses) {
    return !statuses.includes(booking.status)
  }
  return true
}

const doesOmniSearchMatch: BookingFilter<SearchByTextFilters> = 
  ({ field, text }, booking) => {
    if (!text) {
      return true
    }

    const checkFilter = {
      offerName: () => doesOfferNameMatchFilter(text, booking),
      bookingBeneficiary: () => doesBookingBeneficiaryMatchFilter(text, booking),
      offerISBN: () => doesISBNMatchFilter(text, booking),
      bookingToken: () => doesBookingTokenMatchFilter(text, booking),
    }[field]

    return !checkFilter ? true : checkFilter()
  }

const filterBookingsRecap = (
  bookingsRecap: ITableBooking[],
  filters: ITableBookingFilters
): ITableBooking[] => {
  const { byKeyWord, bookingStatus } = filters

  return bookingsRecap.filter(
    booking =>
      doesOmniSearchMatch(byKeyWord, booking) &&
      doesBookingStatusMatchFilter(bookingStatus, booking)
  )
}

const _sanitize = (input: string): string => {
  const REMOVE_ACCENTS_REGEX = /[\u0300-\u036f]/g
  return input.normalize('NFD').replace(REMOVE_ACCENTS_REGEX, '').trim().toLowerCase()
}

export default filterBookingsRecap
