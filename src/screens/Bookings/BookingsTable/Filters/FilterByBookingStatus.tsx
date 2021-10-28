import isEqual from 'lodash.isequal'
import React, { useState, useRef, useEffect } from 'react'

import useOnClickOrFocusOutside from 'components/hooks/useOnClickOrFocusOutside'
import Icon from 'components/layout/Icon'

import tableStyles from '../Table/Table.module.scss'

import styles from './FilterByBookingStatus.module.scss'
import getAvailableBookingStatuses from './getAvailableBookingStatuses'

interface IFilterByBookingStatusProps {
  bookingStatuses: BookingStatus[];
  bookingsRecap: ITableBooking[];
  setGlobalBookingStatusFilter(statusesFilters: BookingStatus[]): void;
}

const FilterByBookingStatus = ({
  bookingStatuses,
  bookingsRecap,
  setGlobalBookingStatusFilter
}: IFilterByBookingStatusProps): JSX.Element => {
  const [bookingStatusFilters, setBookingStatusFilters] = useState<BookingStatus[]>(bookingStatuses)
  const [isToolTipVisible, setIsToolTipVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const showFilter = () => setIsToolTipVisible(true)
  const hideFilters = () =>  setIsToolTipVisible(false)

  useOnClickOrFocusOutside(containerRef, hideFilters)

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const statusId  = event.target.name as BookingStatus
    const isSelected = event.target.checked

    if (!isSelected) {
      setBookingStatusFilters(previousFilters => [...previousFilters, statusId])
    } else {
      setBookingStatusFilters(previousFilters => previousFilters.filter(el => el !== statusId))
    }
  }

  useEffect(() => {
    if (!isEqual(bookingStatuses, bookingStatusFilters)) {
      setGlobalBookingStatusFilter(bookingStatusFilters)
    }
  }, [bookingStatusFilters, bookingStatuses, setGlobalBookingStatusFilter])

  const iconSrc = () => {
    if (bookingStatusFilters.length > 0) {
      return 'ico-filter-status-active'
    }

    if (isToolTipVisible) {
      return 'ico-filter-status-red'
    }

    return 'ico-filter-status-black'
  }

  const filteredBookingStatuses = getAvailableBookingStatuses(bookingsRecap)

  return (
    <div ref={containerRef}>
      <button
        className={styles['status-filter-button']}
        onClick={showFilter}
        onFocus={showFilter}
        type="button"
      >
        <span className={tableStyles['table-head-label']}>
          Statut
        </span>

        <Icon
          alt="Filtrer par statut"
          png={null}
          svg={iconSrc()}
        />
      </button>
      <span className={styles['status-filter']}>
        {isToolTipVisible && (
          <div className={styles['status-filter-tooltip']}>
            <div className={styles['status-filter-tooltip-title']}>
              Afficher les statuts
            </div>
            {filteredBookingStatuses.map(bookingStatus => (
              <label
                className={styles['status-filter-status-label']}
                key={bookingStatus.value}
              >
                <input
                  checked={!bookingStatusFilters.includes(bookingStatus.value)}
                  id={`bs-${bookingStatus.value}`}
                  name={bookingStatus.value}
                  onChange={handleCheckboxChange}
                  type="checkbox"
                />
                {bookingStatus.title}
              </label>
            ))}
          </div>
        )}
      </span>
    </div>
  )
}

export default FilterByBookingStatus
