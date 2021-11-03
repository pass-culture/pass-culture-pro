import cx from 'classnames'
import React, { useState, useEffect } from 'react'

import styles from './Filters.module.scss'


const DEFAULT_PLACEHOLDER = 'Rechercher par nom d’offre'

const OMNISEARCH_FILTERS: {
  id: SearchByTextFields;
  placeholderText: string;
  optionText: string,
}[] = [
  {
    id: 'offerName',
    placeholderText: DEFAULT_PLACEHOLDER,
    optionText: 'Offre',
  },
  {
    id: 'bookingBeneficiary',
    placeholderText: 'Rechercher par nom ou email',
    optionText: 'Bénéficiaire',
  },
  {
    id: 'offerISBN',
    placeholderText: 'Rechercher par ISBN',
    optionText: 'ISBN',
  },
  {
    id: 'bookingToken',
    placeholderText: 'Rechercher par contremarque',
    optionText: 'Contremarque',
  },
]

interface IFiltersProps {
  currentFilters: SearchByTextFilters;
  updateFilters(filters: Partial<SearchByTextFilters>): void;
}

const Filters = ({ currentFilters, updateFilters } : IFiltersProps): JSX.Element => {
  const [searchText, setSearchText] = useState('')

  const handleFieldChange = (event: React.ChangeEvent<HTMLSelectElement>)  => {
    updateFilters({ field: event.target.value as SearchByTextFields })
  }

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value.toLowerCase())
  }

  const placeholderText = (() => {
    const currentField = OMNISEARCH_FILTERS.find(field => field.id === currentFilters.field)
    return currentField ? currentField.placeholderText : DEFAULT_PLACEHOLDER
  })()

  useEffect(() => {
    const timeoutHandler = setTimeout(() => {
      updateFilters({ text: searchText })
    }, 300)

    return () => {
      clearTimeout(timeoutHandler)
    }
  }, [searchText, updateFilters])

  useEffect(() => {
    if (!currentFilters.text) {
      setSearchText('')
    }
  }, [currentFilters.text])

  return (
    <div className={cx(styles['fw-first-line'])}>
      <select
        aria-label="Rechercher par"
        className={styles['fw-booking-text-filters-select']}
        onBlur={handleFieldChange}
        onChange={handleFieldChange}
      >
        {OMNISEARCH_FILTERS.map(selectOption => (
          <option
            key={selectOption.id}
            value={selectOption.id}
          >
            {selectOption.optionText}
          </option>
        ))}
      </select>

      <span className={styles['vertical-bar']} />

      <input
        aria-label="Terme à rechercher"
        className={styles['fw-booking-text-filters-input']}
        id="text-filter-input"
        onChange={handleTextChange}
        placeholder={placeholderText}
        type="text"
        value={searchText}
      />
    </div>
  )
}

export default Filters
