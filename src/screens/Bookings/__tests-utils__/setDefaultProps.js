export default () => ({
  getAllBookings: jest.fn().mockResolvedValue({
    hasReachedBookingsCountLimit: false,
    requestStatus: 'success',
    bookingList: [],
  }),
  locationStatuses: [],
  showResultLimitNotification: jest.fn(),
  notifyServerError: jest.fn(),
  offerrerVenues: [
    { id: 'VENUE_1', displayName: 'VENUE 1' },
    { id: 'VENUE_2', displayName: 'VENUE 2' },
  ],
})
