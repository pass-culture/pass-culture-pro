import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'

import PageTitle from 'components/layout/PageTitle/PageTitle'
import Titles from 'components/layout/Titles/Titles'
import * as pcapi from 'repository/pcapi/pcapi'

import OfferForm from './OfferForm/OfferForm'
import OfferPreviewLink from './OfferPreviewLink/OfferPreviewLink'

const OfferDetails = props => {
  const { history, isUserAdmin, location, match } = props

  const [offer, setOffer] = useState(null)
  const [formInitialValues, setFormInitialValues] = useState({})
  const [formValues, setFormValues] = useState({})
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    async function loadOffer(offerId) {
      const existingOffer = await pcapi.loadOffer(offerId)
      setOffer(existingOffer)
    }

    if (match.params.offerId) {
      loadOffer(match.params.offerId)
    }
  }, [match.params.offerId])

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    if (queryParams.get('structure')) {
      setFormInitialValues(oldFormInitialValues => ({
        ...oldFormInitialValues,
        offererId: queryParams.get('structure'),
      }))
    }
    if (queryParams.get('lieu')) {
      setFormInitialValues(oldFormInitialValues => ({
        ...oldFormInitialValues,
        venueId: queryParams.get('lieu'),
      }))
    }
  }, [setFormInitialValues, location.search])

  const handleFormValuesChanges = useCallback(
    updatedFormValues => {
      setFormValues(updatedFormValues)
    },
    [setFormValues]
  )

  const handleSubmitOffer = useCallback(
    async offerValues => {
      try {
        let redirectId
        if (offer) {
          await pcapi.updateOffer(offer.id, offerValues)
          redirectId = offer.id
        } else {
          const response = await pcapi.createOffer(offerValues)
          redirectId = response.id
        }
        history.push(`/offres/v2/${redirectId}/edition`)
      } catch (error) {
        if (error && 'errors' in error) {
          const mapApiErrorsToFormErrors = {
            venue: 'venueId',
          }
          let newFormErrors = {}
          let formFieldName
          for (let apiFieldName in error.errors) {
            formFieldName = apiFieldName
            if (apiFieldName in mapApiErrorsToFormErrors) {
              formFieldName = mapApiErrorsToFormErrors[apiFieldName]
            }
            newFormErrors[formFieldName] = error.errors[apiFieldName]
          }
          setFormErrors(newFormErrors)
        }
      }
    },
    [history, offer, setFormErrors]
  )

  let pageTitle = 'Nouvelle offre'
  let mediationId = null
  if (offer) {
    pageTitle = 'Éditer une offre'
    mediationId = offer.activeMediation ? offer.activeMediation.id : null
  }

  const actionLink = offer && (
    <OfferPreviewLink
      mediationId={mediationId}
      offerId={offer.id}
    />
  )

  return (
    <div className="offer-page-v2">
      <PageTitle title={pageTitle} />
      <Titles
        action={actionLink}
        title={pageTitle}
      />

      <p className="page-subtitle">
        {'Tous les champs sont obligatoires sauf mention contraire'}
      </p>

      <div className="content">
        <OfferForm
          initialValues={formInitialValues}
          isUserAdmin={isUserAdmin}
          offer={offer}
          onChange={handleFormValuesChanges}
          onSubmit={handleSubmitOffer}
          submitErrors={formErrors}
        />
      </div>
      <div className="debug">
        <h3>
          {'Form Values'}
        </h3>
        {JSON.stringify(formValues, null, 2)}
      </div>
    </div>
  )
}

OfferDetails.propTypes = {
  isUserAdmin: PropTypes.bool.isRequired,
}

export default OfferDetails
