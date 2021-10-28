import React from 'react'
import DatePicker from 'react-datepicker'

import InputWithCalendar from 'components/layout/inputs/PeriodSelector/InputWithCalendar'
import { DEFAULT_FILTERS } from 'constants/booking'
import { getToday } from 'utils/date'

import styles from './Filters.module.scss'

interface IFilterByEventDateProps {
  selectedOfferDate: Date | 'all';
  updateFilters(filters: Partial<IBookingFilters>): void;
}

const FilterByEventDate = ({ updateFilters, selectedOfferDate }: IFilterByEventDateProps): JSX.Element => {
  
  const handleOfferDateChange = (offerEventDate: Date) => updateFilters({
    offerEventDate: offerEventDate ? offerEventDate : DEFAULT_FILTERS.offerEventDate,
  })

  return (
    <div className={styles['event-date']}>
      <label htmlFor="select-filter-date" >
        Date de l’évènement
      </label>
      <div>
        <DatePicker
          className={styles['event-date-picker']}
          customInput={(
            <InputWithCalendar customClass={styles['event-date-input']} />
          )}
          dateFormat="dd/MM/yyyy"
          dropdownMode="select"
          id="select-filter-date"
          onChange={handleOfferDateChange}
          openToDate={
            selectedOfferDate === 'all'
              ? getToday()
              : selectedOfferDate
          }
          placeholderText="JJ/MM/AAAA"
          selected={
            selectedOfferDate === 'all' ? undefined : selectedOfferDate
          }
        />
      </div>
    </div>
  )
}

export default FilterByEventDate
