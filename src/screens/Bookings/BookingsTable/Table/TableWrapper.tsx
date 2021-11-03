import React from 'react'
import { TableInstance } from 'react-table'

import styles from './Table.module.scss'
import TableBody from './TableBody'
import TableHead from './TableHead'
import TablePagination from './TablePagination'


type ITableWrapperProps = Pick<
  TableInstance<ITableBooking>,
  "canNextPage" | "canPreviousPage" | "headerGroups" | "nbPages" | "page" | "prepareRow" | "getTableProps" | "getTableBodyProps" | "nextPage" | "previousPage"
> & {
  updateCurrentPage(page: number): void;
  pageIndex: number;
}

const TableWrapper = ({
  canNextPage,
  canPreviousPage,
  headerGroups,
  nbPages,
  page,
  pageIndex,
  prepareRow,
  getTableProps,
  getTableBodyProps,
  nextPage,
  updateCurrentPage,
  previousPage
}: ITableWrapperProps): JSX.Element => {
  
  const goToNextPage = () => {
    nextPage()
    updateCurrentPage(pageIndex + 1)
  }

  const goToPreviousPage = () => {
    previousPage()
    updateCurrentPage(pageIndex - 1)
  }

  return (
    <>
      <table
        className={styles['table']}
        {...getTableProps()}
      >
        <TableHead headerGroups={headerGroups} />
        <TableBody
          page={page}
          prepareRow={prepareRow}
          tableBodyProps={getTableBodyProps()}
        />
      </table>
      <TablePagination
        canNextPage={canNextPage}
        canPreviousPage={canPreviousPage}
        currentPage={pageIndex + 1}
        nbPages={nbPages}
        nextPage={goToNextPage}
        previousPage={goToPreviousPage}
      />
    </>
  )
}


export default TableWrapper
