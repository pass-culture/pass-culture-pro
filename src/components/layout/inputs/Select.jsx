import PropTypes from 'prop-types'
import React from 'react'

import InputError from './Errors/InputError'

export const buildSelectOptions = (idField, valueField, data) => {
  return data
    .map(item => ({
      id: item[idField].toString(),
      displayName: item[valueField],
    }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName, 'fr'))
}

const Select = ({
  defaultOption,
  error,
  isDisabled,
  handleSelection,
  label,
  name,
  options,
  required,
  selectedValue,
}) => (
  <div className="input-select">
    <label htmlFor={name}>
      {label}
    </label>
    <select
      className={`${error ? 'error' : ''}`}
      disabled={isDisabled}
      id={name}
      name={name}
      onBlur={handleSelection}
      onChange={handleSelection}
      required={required}
      value={selectedValue || defaultOption.id}
    >
      <option value={defaultOption.id}>
        {defaultOption.displayName}
      </option>
      {options.map(option => (
        <option
          key={option.id}
          value={option.id}
        >
          {option.displayName}
        </option>
      ))}
    </select>
    {error && <InputError message={error} />}
  </div>
)

Select.defaultProps = {
  error: null,
  isDisabled: false,
  required: false,
}

Select.propTypes = {
  defaultOption: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  error: PropTypes.string,
  handleSelection: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    })
  ).isRequired,
  required: PropTypes.bool,
  selectedValue: PropTypes.string.isRequired,
}

export default Select
