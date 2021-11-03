import React, { FC } from 'react'

import Select from 'components/layout/inputs/Select'
import { ALL_VENUES_OPTION } from 'constants/booking'

import styles from './Filters.module.scss'

interface IFilterByVenueProps {
  selectedVenueId: string;
  venuesFormattedAndOrdered: SelectOptions;
  updateFilters(filters: Partial<IBookingFilters>): void;
}

const FilterByVenue: FC<IFilterByVenueProps> = ({
  updateFilters,
  selectedVenueId,
  venuesFormattedAndOrdered,
}) => {
  function handleVenueSelection(event: React.ChangeEvent<HTMLSelectElement>): void {
    const venueId = event.target.value
    updateFilters({ offerVenueId: venueId })
  }

  return (
    <Select
      customClass={styles['select-venue']}
      defaultOption={ALL_VENUES_OPTION}
      handleSelection={handleVenueSelection}
      label="Lieu"
      name="lieu"
      options={venuesFormattedAndOrdered}
      selectedValue={selectedVenueId}
    />
  )
}

export default FilterByVenue
