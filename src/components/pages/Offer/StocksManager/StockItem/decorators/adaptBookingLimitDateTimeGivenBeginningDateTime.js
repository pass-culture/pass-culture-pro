import createDecorator from 'final-form-calculate'
import moment from 'moment'
import 'moment-timezone'
import createCachedSelector from 're-reselect'
import {
  BOOKING_LIMIT_DATETIME_HOURS,
  BOOKING_LIMIT_DATETIME_MINUTES,
} from '../utils'

function mapArgsToCacheKey({ isEvent, timezone }) {
  return `${isEvent || ''} ${timezone || ''}`
}

const adaptBookingLimitDateTimeGivenBeginningDateTime = createCachedSelector(
  ({ isEvent }) => isEvent,
  ({ timezone }) => timezone,
  (isEvent, timezone) =>
    createDecorator(
      {
        field: 'bookingLimitDatetime',
        updates: (bookingLimitDatetime, fieldName, allValues) => {
          const { beginningDatetime } = allValues
          const bookingLimitDatetimeMoment = moment(bookingLimitDatetime)

          if (
            !isEvent ||
            bookingLimitDatetimeMoment.isBefore(beginningDatetime, 'day')
          ) {
            let dateTimeMoment = bookingLimitDatetimeMoment.utc()
            if (timezone) {
              dateTimeMoment = dateTimeMoment.tz(timezone)
            }

            const updatedDateTime = dateTimeMoment
              .hours(BOOKING_LIMIT_DATETIME_HOURS)
              .minutes(BOOKING_LIMIT_DATETIME_MINUTES)
              .toISOString()

            return {
              bookingLimitDatetime: updatedDateTime,
            }
          }

          return {
            bookingLimitDatetime: beginningDatetime,
          }
        },
      },
      {
        field: 'beginningDatetime',
        updates: (beginningDatetime, fieldName, allValues) => {
          const { bookingLimitDatetime } = allValues
          const bookingLimitDatetimeMoment = moment(bookingLimitDatetime)

          if (
            !isEvent ||
            bookingLimitDatetimeMoment.isBefore(beginningDatetime, 'day')
          ) {
            let dateTimeMoment = bookingLimitDatetimeMoment.utc()
            if (timezone) {
              dateTimeMoment = dateTimeMoment.tz(timezone)
            }

            const updatedDateTime = dateTimeMoment
              .hours(BOOKING_LIMIT_DATETIME_HOURS)
              .minutes(BOOKING_LIMIT_DATETIME_MINUTES)
              .toISOString()

            return {
              bookingLimitDatetime: updatedDateTime,
            }
          }

          return {
            bookingLimitDatetime: beginningDatetime,
          }
        },
      }
    )
)(mapArgsToCacheKey)

export default adaptBookingLimitDateTimeGivenBeginningDateTime
