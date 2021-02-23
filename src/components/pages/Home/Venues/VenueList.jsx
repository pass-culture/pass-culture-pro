import React from 'react'

import { Venue } from 'components/pages/Home/Venues/Venue'

export const VenueList = ({ physicalVenues, selectedOffererId, virtualVenue }) => (
  <div className="h-venue-list">
    {virtualVenue && (
      <Venue
        isVirtual
        name="Lieu numérique"
      />
    )}

    {physicalVenues &&
      physicalVenues.map(venue => (
        <Venue
          id={venue.id}
          key={venue.id}
          name={venue.name}
          offererId={selectedOffererId}
          publicName={venue.publicName}
        />
      ))}
  </div>
)
