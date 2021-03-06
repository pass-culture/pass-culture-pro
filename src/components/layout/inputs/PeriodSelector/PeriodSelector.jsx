import PropTypes from 'prop-types'
import React from 'react'
import DatePicker from 'react-datepicker'

import InputWithCalendar from './InputWithCalendar'

const PeriodSelector = ({
  changePeriodBeginningDateValue,
  changePeriodEndingDateValue,
  isDisabled,
  label,
  maxDateEnding,
  minDateBeginning,
  periodBeginningDate,
  periodEndingDate,
  todayDate,
}) => {
  return (
    <div className="period-filter">
      <label className="period-filter-label">
        {label}
        <div className={`period-filter-inputs ${isDisabled ? 'disabled' : ''}`}>
          <div className="period-filter-begin-picker">
            <DatePicker
              className="period-filter-input"
              customInput={(
                <InputWithCalendar
                  customClass={`field-date-only field-date-begin ${isDisabled ? 'disabled' : ''}`}
                />
              )}
              dateFormat="dd/MM/yyyy"
              disabled={isDisabled}
              dropdownMode="select"
              maxDate={periodEndingDate}
              minDate={minDateBeginning}
              onChange={changePeriodBeginningDateValue}
              openToDate={periodBeginningDate ? periodBeginningDate : todayDate}
              placeholderText="JJ/MM/AAAA"
              selected={periodBeginningDate}
            />
          </div>
          <span className="vertical-bar" />
          <div className="period-filter-end-picker">
            <DatePicker
              className="period-filter-input"
              customInput={(
                <InputWithCalendar
                  customClass={`field-date-only field-date-end ${isDisabled ? 'disabled' : ''}`}
                />
              )}
              dateFormat="dd/MM/yyyy"
              disabled={isDisabled}
              dropdownMode="select"
              maxDate={maxDateEnding}
              minDate={periodBeginningDate}
              onChange={changePeriodEndingDateValue}
              openToDate={periodEndingDate ? periodEndingDate : todayDate}
              placeholderText="JJ/MM/AAAA"
              selected={periodEndingDate}
            />
          </div>
        </div>
      </label>
    </div>
  )
}

PeriodSelector.defaultProps = {
  isDisabled: false,
  maxDateEnding: undefined,
  minDateBeginning: undefined,
  periodBeginningDate: undefined,
  periodEndingDate: undefined,
}

PeriodSelector.propTypes = {
  changePeriodBeginningDateValue: PropTypes.func.isRequired,
  changePeriodEndingDateValue: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  maxDateEnding: PropTypes.instanceOf(Date),
  minDateBeginning: PropTypes.instanceOf(Date),
  periodBeginningDate: PropTypes.instanceOf(Date),
  periodEndingDate: PropTypes.instanceOf(Date),
  todayDate: PropTypes.instanceOf(Date).isRequired,
}

export default PeriodSelector
