import React from 'react'

import { tableBookingsFactory } from './__tests-utils__'
import Bookings from './Bookings'

export default {
  title: 'screens/Bookings',
  component: Bookings,
}

const bookingList = tableBookingsFactory([
  {
    offer: {
      isbn: '9864752235',
      name: 'AAAA',
    },
  },
  { isDuo: true, amount: 0 },
  {
    amount: 0,
    beneficiary: {
      lastname: 'BOYENVAL',
      firstname: 'Gaël',
      email: 'gael.boyenval@passculture.com',
    },
    offer: {
      name: 'BBBB',
    },
    status: 'cancelled',
    statusHistory: [
      { date: '2020-05-15T22:00:00.000Z', status: 'cancelled' },
      { date: '2020-05-12T22:00:00.000Z', status: 'validated' },
      { date: '2020-05-10T22:00:00.000Z', status: 'booked' },
    ],
  },
  {
    status: 'confirmed',
    statusHistory: [
      { date: '2020-05-15T22:00:00.000Z', status: 'confirmed' },
      { date: '2020-05-14T22:00:00.000Z', status: 'booked' },
    ],
    offer: {
      name: 'CCCC',
    },
  },
  {
    status: 'reimbursed',
    statusHistory: [
      { date: '2020-05-15T22:00:00.000Z', status: 'reimbursed' },
      { date: '2020-05-14T22:00:00.000Z', status: 'confirmed' },
      { date: '2020-05-13T22:00:00.000Z', status: 'booked' },
    ],
  },
  {},
  { isDuo: true, status: 'validated' },
  { isDuo: true },
  {},
  {},
  {},
  {},
  {},
])

const getAllBookings = () =>
  Promise.resolve({
    requestStatus: 'success',
    hasReachedBookingsCountLimit: false,
    bookingList,
  })

const showResultLimitNotification = () => null
const notifyServerError = () => null

const Template = args => (
  <div style={{ width: 800, margin: '0 auto' }}>
    <Bookings {...args} />
  </div>
)

export const Default = Template.bind({})

Default.args = {
  offerrerVenues: [
    { id: 'AA', displayName: 'venue A' },
    { id: 'BB', displayName: 'venue B' },
  ],
  locationStatuses: [],
  showResultLimitNotification,
  notifyServerError,
  getAllBookings,
}
