import React from 'react'
import { TableInstance, HeaderGroup } from 'react-table'

import Icon from 'components/layout/Icon'

import styles from './Table.module.scss'

const IS_MULTI_SORT_ACTIVATED = false

const handleOnKeyDown = (column: HeaderGroup<ITableBooking>, selector?: boolean) => (event: React.KeyboardEvent<HTMLInputElement>) => {
  const enterKeyHasBeenPressed = event.key === 'Enter'
  if (enterKeyHasBeenPressed) {
    column.toggleSortBy(selector, IS_MULTI_SORT_ACTIVATED)
  }
}

interface ITableHeadProps {
  headerGroups: TableInstance<ITableBooking>['headerGroups']
}

const TableHead = ({ headerGroups }: ITableHeadProps): JSX.Element => (
  <thead>
    {headerGroups.map(headerGroup => (
      <tr key="header-group">
        {headerGroup.headers.map(column => (
          <th
            {...column.getHeaderProps(column.getSortByToggleProps())}
            className={column.className}
            key={column.id}
          >
            {column.HeaderTitleFilter
              ? column.render('HeaderTitleFilter')
              : column.render('headerTitle')}
            {column.canSort ? (
              <span className={styles['table-sorting-icons']}>
                {column.isSorted ? (
                  column.isSortedDesc ? (
                    <Icon
                      alt={null}
                      onKeyDown={handleOnKeyDown(column)}
                      png={null}
                      role="button"
                      svg="ico-arrow-up-r"
                      tabIndex={0}
                    />
                  ) : (
                    <Icon
                      alt={null}
                      onKeyDown={handleOnKeyDown(column, true)}
                      png={null}
                      role="button"
                      svg="ico-arrow-down-r"
                      tabIndex={0}
                    />
                  )
                ) : (
                  <Icon
                    alt={null}
                    onKeyDown={handleOnKeyDown(column, false)}
                    png={null}
                    role="button"
                    svg="ico-unfold"
                    tabIndex={0}
                  />
                )}
              </span>
            ) : (
              ''
            )}
          </th>
        ))}
      </tr>
    ))}
  </thead>
)


export default TableHead
