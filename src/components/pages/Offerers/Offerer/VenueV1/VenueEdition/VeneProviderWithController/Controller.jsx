import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'

import Spinner from 'components/layout/Spinner'
import * as pcapi from 'repository/pcapi/pcapi'

import VenueSync from './VenueSync'

const Controller = ({ notifyError, notifySuccess, venue }) => {
  const { createVenueProvider, loadProviders, loadVenueProviders } = pcapi

  const [providers, setProviders] = useState([])
  const [venueProviders, setVenueProviders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const selectedVenueId = null

  useEffect(() => {
    async function loadData() {
      await loadProviders(venue.id).then(providers => setProviders(providers))
      await loadVenueProviders(venue.id).then(venueProviders => setVenueProviders(venueProviders))
      setIsLoading(false)
    }
    loadData()
  }, [loadProviders, loadVenueProviders, setIsLoading, venue.id])

  const onChange = useCallback(() => {
    // TODO
  }, [])

  const setIsCreationMode = () => {
    // todo
  }

  const cancelProviderSelection = useCallback(() => {
    // todo
    return true
  }, [])

  //TODO
  const isAllocineProviderSelected = true

  const postVenueProvider = useCallback(
    payload => {
      createVenueProvider(payload)
        .then(createdVenueProvider => {
          setVenueProviders([createdVenueProvider])
          setIsCreationMode(false)
          notifySuccess()
        })
        .catch(error => {
          notifyError(error.errors)
          if (!isAllocineProviderSelected) {
            cancelProviderSelection()
          }
        })
    },
    [
      cancelProviderSelection,
      createVenueProvider,
      notifyError,
      notifySuccess,
      isAllocineProviderSelected,
    ]
  )

  if (isLoading) {
    return <Spinner />
  }

  return (
    <VenueSync
      onChange={onChange}
      onSubmit={postVenueProvider}
      providers={providers}
      selectedVenueId={selectedVenueId}
      venue={venue}
      venueProviders={venueProviders}
    />
  )
}

Controller.propTypes = {
  notifyError: PropTypes.func.isRequired,
  notifySuccess: PropTypes.func.isRequired,
  venue: PropTypes.shape({
    id: PropTypes.string.isRequired,
    managingOffererId: PropTypes.string.isRequired,
    siret: PropTypes.string.isRequired,
  }).isRequired,
}

export default Controller
