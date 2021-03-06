import PropTypes from 'prop-types'
import React from 'react'
import DatePicker from 'react-datepicker'

import InputWithCalendar from 'components/layout/inputs/PeriodSelector/InputWithCalendar'
import { DEFAULT_PRE_FILTERS } from 'components/pages/Bookings/PreFilters/_constants'
import { getToday } from 'utils/date'

const FilterByEventDate = ({ updateFilters, selectedOfferDate }) => {
  function handleOfferDateChange(offerEventDate) {
    updateFilters({
      offerEventDate: offerEventDate ? offerEventDate : DEFAULT_PRE_FILTERS.offerEventDate,
    })
  }

  return (
    <div className="pf-offer-date">
      <label
        className="pf-offer-date-label"
        htmlFor="select-filter-date"
      >
        {'Date de l’évènement'}
      </label>
      <div className="pf-offer-date-picker">
        <DatePicker
          className="pf-offer-date-input"
          customInput={<InputWithCalendar customClass="field-date-only" />}
          dateFormat="dd/MM/yyyy"
          dropdownMode="select"
          id="select-filter-date"
          onChange={handleOfferDateChange}
          openToDate={
            selectedOfferDate === DEFAULT_PRE_FILTERS.offerEventDate
              ? getToday()
              : selectedOfferDate
          }
          placeholderText="JJ/MM/AAAA"
          selected={
            selectedOfferDate === DEFAULT_PRE_FILTERS.offerEventDate ? '' : selectedOfferDate
          }
        />
      </div>
    </div>
  )
}

FilterByEventDate.propTypes = {
  selectedOfferDate: PropTypes.oneOfType([PropTypes.shape(), PropTypes.string]).isRequired,
  updateFilters: PropTypes.func.isRequired,
}

export default FilterByEventDate
