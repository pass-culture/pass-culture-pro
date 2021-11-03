import React from 'react'

interface IBookingTokenCellProps {
  value: ITableBooking['token'];
}

const BookingTokenCell = ({ value }: IBookingTokenCellProps): JSX.Element => (
  <span>
    {value}
  </span>
)
export default BookingTokenCell
