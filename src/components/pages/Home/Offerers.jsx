import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Icon from 'components/layout/Icon'
import Select, { buildSelectOptions } from 'components/layout/inputs/Select'
import Spinner from 'components/layout/Spinner'
import * as pcapi from 'repository/pcapi/pcapi'

import { steps, STEP_ID_OFFERERS } from './HomepageBreadcrumb'

const Offerers = () => {
  const [offererOptions, setOffererOptions] = useState([])
  const [selectedOffererId, setSelectedOffererId] = useState(null)
  const [selectedOfferer, setSelectedOfferer] = useState(null)
  const [offlineVenues, setOfflineVenues] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(function fetchData() {
    pcapi.getAllOfferersNames().then(receivedOffererNames => {
      setSelectedOffererId(receivedOffererNames[0].id)
      setOffererOptions(buildSelectOptions('id', 'name', receivedOffererNames))
    })
  }, [])

  useEffect(() => {
    pcapi.getOfferer(selectedOffererId).then(receivedOfferer => {
      setSelectedOfferer(receivedOfferer)
      setIsLoading(false)
    })
  }, [setIsLoading, selectedOffererId, setSelectedOfferer])

  useEffect(() => {
    if (isLoading) return
    pcapi.getVenuesForOfferer(selectedOfferer.id).then(venues => {
      setOfflineVenues(venues.filter(venue => !venue.isVirtual))
    })
  }, [isLoading, selectedOfferer])

  const handleChangeOfferer = useCallback(
    event => {
      const newOffererId = event.target.value
      if (newOffererId !== selectedOfferer.id) {
        setSelectedOffererId(newOffererId)
      }
    },
    [selectedOfferer, setSelectedOffererId]
  )

  if (isLoading) {
    return (
      <div className="h-card h-card-secondary h-card-placeholder">
        <div className="h-card-inner">
          <Spinner />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="h-card h-card-secondary">
        <div className="h-card-inner">
          <div className="h-card-header">
            <div className="h-card-header-block">
              <Select
                handleSelection={handleChangeOfferer}
                id={steps[STEP_ID_OFFERERS].hash}
                name="offererId"
                options={offererOptions}
                selectedValue={selectedOfferer.id}
              />
            </div>
            <div className="h-card-actions">
              <Link
                className="tertiary-button"
                to={`/structures/${selectedOfferer.id}`}
              >
                <Icon svg="ico-outer-pen" />
                {'Modifier'}
              </Link>
            </div>
          </div>
          <div className="h-card-cols">
            <div className="h-card-col">
              <h3 className="h-card-secondary-title">
                {'Informations pratiques'}
              </h3>
              <div className="h-card-content">
                <dl className="h-description-list">
                  <dt>
                    {'Siren :'}
                  </dt>
                  <dd>
                    {selectedOfferer.siren}
                  </dd>

                  <dt>
                    {'Désignation :'}
                  </dt>
                  <dd>
                    {selectedOfferer.name}
                  </dd>
                  <dt>
                    {'Siège social : '}
                  </dt>
                  <dd>
                    {selectedOfferer.address}
                    {' '}
                    {selectedOfferer.postalCode}
                    {' '}
                    {selectedOfferer.city}
                  </dd>
                </dl>
              </div>
            </div>

            <div className="h-card-col">
              <h3 className="h-card-secondary-title">
                {'Coordonnées bancaires'}
              </h3>
              <div className="h-card-content h-content-attention">
                {'Hello world !'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-venue-list">
        <div className="h-section-row nested">
          <div className="h-card h-card-primary">
            <div className="h-card-inner">
              <h3 className="h-card-title">
                <Icon
                  className="h-card-title-ico"
                  svg="ico-screen-play"
                />
                {'Lieu numérique'}
              </h3>
            </div>
          </div>
        </div>

        {offlineVenues &&
          offlineVenues.map(venue => (
            <div
              className="h-section-row nested"
              key={venue.id}
            >
              <div className="h-card h-card-secondary">
                <div className="h-card-inner">
                  <div className="h-card-header-row">
                    <h3 className="h-card-title">
                      <Icon
                        className="h-card-title-ico"
                        svg="ico-box"
                      />
                      {venue.name}
                    </h3>
                    <Link
                      className="tertiary-button"
                      to={`/structures/${selectedOfferer.id}/lieux/${venue.id}`}
                    >
                      <Icon svg="ico-outer-pen" />
                      {'Modifier'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  )
}

export default Offerers
