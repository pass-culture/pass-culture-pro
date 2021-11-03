import React from 'react'

import {
  OfferCell,
  DuoCell,
  BeneficiaryCell,
  DateCell,
  TokenCell,
  StatusCell,
} from '../Cells'
import FilterByBookingStatus from '../Filters/FilterByBookingStatus'
import { sortByBeneficiaryName, sortByBookingDate, sortByOfferName } from '../utils/sortingFunctions'

import styles from './Columns.module.scss'

interface IColumnsProps {
  bookingStatusFilter: BookingStatus[];
  bookings: ITableBooking[];
  setGlobalBookingStatusFilter(statuses : BookingStatus[]): void;
}

const columns = ({
  bookingStatusFilter,
  bookings,
  setGlobalBookingStatusFilter
}: IColumnsProps):  IBookingTableColumn[] => {
  const FilterByBookingStatusHeader = () => (
    <FilterByBookingStatus
      bookingStatuses={bookingStatusFilter}
      bookingsRecap={bookings}
      setGlobalBookingStatusFilter={setGlobalBookingStatusFilter}
    />
  )
  return [
    {
      id: '1',
      headerTitle: "Nom de l'offre",
      accessor: 'offer',
      Cell: OfferCell,
      className: styles['cell-offer-name'],
      defaultCanSort: true,
      sortType: sortByOfferName,
    },
    {
      id:' 2',
      headerTitle: '',
      accessor: 'isDuo',
      Cell: DuoCell,
      className: styles['cell-booking-duo'],
      disableSortBy: true,
    },
    {
      id: '3',
      headerTitle: 'Bénéficiaire',
      accessor: 'beneficiary',
      Cell: BeneficiaryCell,
      className: styles['cell-beneficiary'],
      defaultCanSort: true,
      sortType: sortByBeneficiaryName,
    },
    {
      id: '4',
      headerTitle: 'Réservation',
      accessor: 'date',
      Cell: DateCell,
      className: styles['cell-booking-date'],
      defaultCanSort: true,
      sortType: sortByBookingDate,
    },
    {
      id: '5',
      headerTitle: 'Contremarque',
      accessor: 'token',
      Cell: TokenCell,
      className: styles['cell-booking-token'],
      disableSortBy: true,
    },
    {
      id: '6',
      accessor: 'status',
      Cell: StatusCell,
      className: styles['cell-booking-status'],
      disableSortBy: true,
      HeaderTitleFilter: FilterByBookingStatusHeader,
    }
  ]}

export default columns