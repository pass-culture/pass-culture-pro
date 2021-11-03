import merge from 'lodash.merge'

const tableBookingFactory = bookingExtend =>
  merge(
    {},
    {
      offer: {
        name: 'name',
        id: 'id',
        eventBeginningDate: null,
        isbn: null,
      },
      beneficiary: {
        lastname: 'lastname',
        firstname: 'firstname',
        email: 'user@email.com',
        phonenumber: '+33608255840',
      },
      token: 'TOKEN',
      date: '2020-05-15T22:00:00.000Z',
      status: 'booked',
      isDuo: false,
      amount: 1,
      statusHistory: [{ date: '2020-05-15T22:00:00.000Z', status: 'booked' }],
      offererName: 'offererName',
      venue: {
        id: 'VENUE_1',
        isVirtual: false,
        name: 'venue name',
      },
    },
    bookingExtend
  )

const tableBookingsFactory = array => array.map(tableBookingFactory)

export default tableBookingsFactory
