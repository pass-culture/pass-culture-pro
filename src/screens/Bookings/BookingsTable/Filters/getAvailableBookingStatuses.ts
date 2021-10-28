import { statusDisplayInfos } from '../utils/statusDisplayInfos'

type AvailableBookingStatus = { title: string, value: BookingStatus }

export default function getAvailableBookingStatuses(bookingsRecap: ITableBooking[]): AvailableBookingStatus[] {
  const presentBookingStatues: AvailableBookingStatus[] = Array.from(
    new Set(bookingsRecap.map(bookingRecap => bookingRecap.status))
  ).map(bookingStatus => ({
    title: statusDisplayInfos(bookingStatus).status,
    value: bookingStatus,
  }))

  const byStatusTitle = (
    bookingStatusA: AvailableBookingStatus,
    bookingStatusB: AvailableBookingStatus
  ): number => {
    const titleA = bookingStatusA.title
    const titleB = bookingStatusB.title
    return titleA < titleB ? -1 : titleA > titleB ? 1 : 0
  }

  return presentBookingStatues.sort(byStatusTitle)
}
