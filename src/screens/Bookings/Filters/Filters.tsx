import cx from 'classnames'
import isEqual from 'lodash.isequal'
import React, { useCallback, useState, FC, useEffect } from 'react'

import FilterByBookingPeriod from './FilterByBookingPeriod'
import FilterByEventDate from './FilterByEventDate'
import FilterByVenue from './FilterByVenue'
import styles from './Filters.module.scss'

interface IFiltersProps {
  initialFilters: IBookingFilters;
  filters: IBookingFilters|null;
  setFilters(filters: IBookingFilters): void;
  isLoading: boolean;
  offerrerVenues: SelectOptions;
}

const Filters: FC<IFiltersProps> = ({
  initialFilters,
  filters,
  setFilters,
  isLoading,
  offerrerVenues,
}) => {
  const [formValues, setFormValues] = useState(initialFilters)
  const areFiltersAndValuesDifferent = !isEqual(formValues, filters)
  const shouldDisplayModifiedFilters = areFiltersAndValuesDifferent && filters
  const isResetFilterDisabled = isEqual(formValues, initialFilters)

  const resetFilters = useCallback(() => {
    setFormValues({ ...initialFilters })
  }, [setFormValues, initialFilters])

  const updateFormValues = useCallback(updatedFormValues => {    
    setFormValues(currentFormValues => ({
      ...currentFormValues,
      ...updatedFormValues,
    }))
  }, [])

  const onSubmitFilters = useCallback((event) => {
    event.preventDefault()    
    if (areFiltersAndValuesDifferent) {
      setFilters(formValues)
    }
  },
  [setFilters, areFiltersAndValuesDifferent, formValues]
  )

  useEffect(() => {
    if (filters) {
      setFormValues(filters)
    }
  }, [filters])

  return (
    <>
      <div className={styles['filters-header']} >
        <h2 className={styles['filters-header-title']}>
          Affichage des réservations
        </h2>
        {/* WHY should we not just disable the button like eslewhere */}
      
        <button
          className={cx('tertiary-button', styles['filters-header-reset'])}
          disabled={isResetFilterDisabled}
          onClick={resetFilters}
          type="button"
        >
          Réinitialiser les filtres
        </button>
      </div>
      
      <form
        className={styles['filters-form']}
        onSubmit={onSubmitFilters}
      >
        <FilterByVenue
          selectedVenueId={formValues.offerVenueId}
          updateFilters={updateFormValues}
          venuesFormattedAndOrdered={offerrerVenues}
        />

        <FilterByEventDate
          selectedOfferDate={formValues.offerEventDate}
          updateFilters={updateFormValues}
        />

        <FilterByBookingPeriod
          selectedBookingBeginningDate={formValues.bookingBeginningDate}
          selectedBookingEndingDate={formValues.bookingEndingDate}
          updateFilters={updateFormValues}
        />

        <div className={styles['filters-footer']}>
          <button
            className={cx(styles['filters-submit'], 'primary-button')}
            disabled={isLoading}
            type="submit"
          >
            Afficher
          </button>
          
          {shouldDisplayModifiedFilters && (
            <p className={styles['filters-update-message']}>
              Vos filtres ont été modifiés. Veuillez cliquer sur « Afficher » pour actualiser votre recherche.
            </p>
          )}
        </div>
      </form>
    </>
  )
}

export default Filters
