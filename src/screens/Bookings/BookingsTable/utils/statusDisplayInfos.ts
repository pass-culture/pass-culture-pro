import { BOOKING_STATUS } from 'constants/booking'
import { FORMAT_DD_MM_YYYY, FORMAT_DD_MM_YYYY_HH_mm } from 'utils/date'

interface BookingStatusDisplayInfo {
  id: BookingStatus;
  status: string;
  label: string;
  statusColorClass: string;
  dateFormat: string;
  svgIconFilename: string;
}

const BOOKING_STATUS_DISPLAY_INFORMATIONS: BookingStatusDisplayInfo[] = [
  {
    id: BOOKING_STATUS.VALIDATED,
    status: 'validé',
    label: 'Réservation validée',
    statusColorClass: 'status-bg-validated',
    dateFormat: FORMAT_DD_MM_YYYY_HH_mm,
    svgIconFilename: 'ico-status-double-validated',
  },
  {
    id: BOOKING_STATUS.CANCELLED,
    status: 'annulé',
    label: 'Réservation annulée',
    statusColorClass: 'status-bg-cancelled',
    dateFormat: FORMAT_DD_MM_YYYY_HH_mm,
    svgIconFilename: 'ico-status-cancelled',
  },
  {
    id: BOOKING_STATUS.BOOKED,
    status: 'réservé',
    label: 'Réservé',
    statusColorClass: 'status-bg-booked',
    dateFormat: FORMAT_DD_MM_YYYY_HH_mm,
    svgIconFilename: 'ico-status-booked',
  },
  {
    id: BOOKING_STATUS.REIMBURSED,
    status: 'remboursé',
    label: 'Remboursée',
    statusColorClass: 'status-bg-reimbursed',
    dateFormat: FORMAT_DD_MM_YYYY,
    svgIconFilename: 'ico-status-reimbursed',
  },
  {
    id: BOOKING_STATUS.CONFIRMED,
    status: 'confirmé',
    label: 'Réservation confirmée',
    statusColorClass: 'status-bg-confirmed',
    dateFormat: FORMAT_DD_MM_YYYY_HH_mm,
    svgIconFilename: 'ico-status-validated',
  },
]

export const statusDisplayInfos = (
  bookingStatus: BookingStatus
): BookingStatusDisplayInfo =>
  BOOKING_STATUS_DISPLAY_INFORMATIONS.find(({ id }) => bookingStatus === id) ||BOOKING_STATUS_DISPLAY_INFORMATIONS[0]