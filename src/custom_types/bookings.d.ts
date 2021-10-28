
type BookingStatus = 'booked' | 'cancelled' | 'confirmed' | 'reimbursed' | 'validated'

type SearchByTextFields = 'offerName' | 'bookingBeneficiary' | 'offerISBN' | 'bookingToken'

type SortFunction = (firstRow: Row<ITableBooking>, secondRow: Row<ITableBooking>) => number

type IBookingTableColumn = Column<ITableBooking>

interface SearchByTextFilters {
  field: SearchByTextFields;
  text?: string;
}

interface ITableBookingFilters {
  byKeyWord: SearchByTextFilters;
  bookingStatus: BookingStatus[];
}

interface IBookingStatusHistoryItem { 
  status: BookingStatus; 
  date: Date
}

interface ITableBooking { 
  offer : {
    name: string;
    id: string;
    eventBeginningDate: Date | null;
    isbn: string | null;
  };
  beneficiary: {
    lastname: string;
    firstname: string;
    email: string;
    phonenumber: string;
  };
  token: string;
  date: Date;
  status: BookingStatus;
  isDuo: boolean;
  amount: number;
  statusHistory: IBookingStatusHistoryItem[];
  offererName: string;
  venue: {
    id: string;
    isVirtual: boolean;
    name: string;
  }
}

interface IBookingFilters {
  offerVenueId: string | 'all';
  offerEventDate: Date | 'all';
  bookingBeginningDate: Date;
  bookingEndingDate: Date
}

/* @debt standards "Gaël: define a better global way of handling server errors and payloads "*/
interface IGetAllBookingResponse {
  hasReachedBookingsCountLimit: boolean,
  bookingList: ITableBooking[];
  requestStatus: 'error' | 'success',
}

type GetAllBookings = (
  filters: IBookingFilters
) => Promise<IGetAllBookingResponse>

// TODO : pcapi LoadBooking route signatures => remove when swagger provide typescript signatures
interface ILoadBookingParams {
  venueId: string | 'all';
  eventDate: Date | 'all';
  bookingPeriodBeginningDate: Date;
  bookingPeriodEndingDate: Date
  page: number
}

interface IBooking {
  stock: {
    offer_name: string;
    offer_identifier: string;
    event_beginning_datetime: Date | null;
    offer_isbn: string | null;
  };
  beneficiary: {
    lastname: string;
    firstname: string;
    email: string;
    phonenumber: string;
  };
  booking_token: string;
  booking_date: Date;
  booking_status: BookingStatus;
  booking_is_duo: boolean;
  booking_amount: number;
  booking_status_history: IBookingStatusHistoryItem[];
  offerer: {
    name: string;
  };
  venue: {
    identifier: string;
    is_virtual: boolean,
    name: string;
  }
}

interface ILoadBookingResponse {
  page: number;
  pages: number;
  total: number;
  bookings_recap: IBooking[];
}

type LoadFilteredBookings = (
  filters: ILoadBookingParams
) => Promise<ILoadBookingResponse>


