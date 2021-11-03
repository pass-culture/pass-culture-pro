import React from 'react'
import { usePagination, useSortBy, useTable } from 'react-table'

import TableWrapper from './TableWrapper'

interface ITableFrameProps {
  columns: IBookingTableColumn[];
  data: ITableBooking[];
  nbBookings: number;
  nbBookingsPerPage: number;
  currentPage: number;
  updateCurrentPage(page: number): void;
}

const TableFrame = ({
  columns,
  data,
  nbBookings,
  nbBookingsPerPage,
  currentPage,
  updateCurrentPage,
}:ITableFrameProps): JSX.Element => {
  const {
    canPreviousPage,
    canNextPage,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    nextPage,
    previousPage,
    prepareRow,
    page,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: currentPage,
        pageSize: nbBookingsPerPage,
      },
    },
    useSortBy,
    usePagination
  )
  const pageCount = Math.ceil(nbBookings / nbBookingsPerPage)

  return (
    <TableWrapper
      canNextPage={canNextPage}
      canPreviousPage={canPreviousPage}
      getTableBodyProps={getTableBodyProps}
      getTableProps={getTableProps}
      headerGroups={headerGroups}
      nbPages={pageCount}
      nextPage={nextPage}
      page={page}
      pageIndex={pageIndex}
      prepareRow={prepareRow}
      previousPage={previousPage}
      updateCurrentPage={updateCurrentPage}
    />
  )
}

export default TableFrame
