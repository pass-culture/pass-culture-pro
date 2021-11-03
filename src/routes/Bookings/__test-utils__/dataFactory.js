import merge from 'lodash.merge'

export const venueForOffererFactory = venue =>
  merge(
    {},
    {
      audioDisabilityCompliant: true,
      bookingEmail: 'bookingEmail',
      id: 'venue_id',
      isVirtual: false,
      managingOffererId: 'offerer_id',
      mentalDisabilityCompliant: true,
      motorDisabilityCompliant: true,
      name: 'venue name',
      offererName: 'offerer name',
      publicName: 'public venue name',
      visualDisabilityCompliant: true,
      withdrawalDetails: 'withdrawalDetails',
    },
    venue
  )

export const venuesForOfferrerFactory = (venues = [{}, {}]) => venues.map(venueForOffererFactory)

export const filteredBookingsFactory = booking =>
  merge(
    {},
    {
      stock: {
        offer_name: 'offer_name',
        offer_identifier: 'offer_identifier',
      },
      beneficiary: {
        lastname: 'lastname',
        firstname: 'firstname',
        email: 'user@email.com',
        phonenumber: '+33608145840',
      },
      booking_token: 'booking_token',
      booking_date: '2020-05-15T22:00:00.000Z',
      booking_status: 'booked',
      booking_is_duo: false,
      booking_amount: 20,
      booking_status_history: [{ date: '2020-05-15T22:00:00.000Z', status: 'booked' }],
      offerer: {
        name: 'name',
      },
      venue: {
        identifier: 'identifier',
        is_virtual: false,
        name: 'venue name',
      },
    },
    booking
  )

export const filteredBookingsRecapFactory = bookings => bookings.map(filteredBookingsFactory)
