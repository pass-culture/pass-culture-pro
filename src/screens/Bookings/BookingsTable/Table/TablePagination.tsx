import React from 'react'
import { TableInstance } from 'react-table'

import Icon from 'components/layout/Icon'

import styles from './Table.module.scss'

type ITablePaginationProps = Pick<
  TableInstance<ITableBooking>,
  "canNextPage" | "canPreviousPage" | "currentPage" | "nbPages" | "nextPage" | "previousPage"
>

const TablePagination = ({
  canNextPage,
  canPreviousPage,
  currentPage,
  previousPage,
  nbPages,
  nextPage,
}: ITablePaginationProps): JSX.Element => (
  <div
    className={styles.pagination}
    data-testid="table-pagination"
  >
    <button
      aria-label="Page précédente"
      className={styles['pagination-button']}
      disabled={!canPreviousPage}
      onClick={previousPage}
      type="button"
    >
      <Icon
        alt={null}
        png={null}
        svg="ico-left-arrow"
      />
    </button>
    <span className={styles['pagination-page-infos']}>
      {`Page ${currentPage}/${nbPages}`}
    </span>
    <button
      aria-label="Page suivante"
      className={styles['pagination-button']}
      disabled={!canNextPage}
      onClick={nextPage}
      type="button"
    >
      <Icon
        alt={null}
        png={null}
        svg="ico-right-arrow"
      />
    </button>
  </div>
)

export default TablePagination
