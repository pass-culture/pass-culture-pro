import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

import PageTitle from 'components/layout/PageTitle/PageTitle'
import { isOfferDisabled } from 'components/pages/Offers/domain/isOfferDisabled'
import OfferCreation from 'components/pages/Offers/Offer/OfferDetails/OfferForm/OfferCreation'
import OfferEditionContainer from 'components/pages/Offers/Offer/OfferDetails/OfferForm/OfferEditionContainer'
import OfferPreview from 'components/pages/Offers/Offer/OfferDetails/OfferPreview/OfferPreview'
import OfferStatusBanner from 'components/pages/Offers/Offer/OfferDetails/OfferStatusBanner/OfferStatusBanner'
import OfferThumbnail from 'components/pages/Offers/Offer/OfferDetails/OfferThumbnail/OfferThumbnail'
import OfferPreviewLink from 'components/pages/Offers/Offer/OfferPreviewLink/OfferPreviewLink'
import * as pcapi from 'repository/pcapi/pcapi'
import { loadCategories } from 'store/offers/thunks'

import { queryParamsFromOfferer } from '../../utils/queryParamsFromOfferer'

const OfferDetails = ({
  history,
  isUserAdmin,
  location,
  offer,
  reloadOffer,
  showEditionSuccessNotification,
  showErrorNotification,
  trackCreateOffer,
  trackEditOffer,
  userEmail,
}) => {
  const dispatch = useDispatch()
  const initialValues = {}
  const queryParams = queryParamsFromOfferer(location)

  if (queryParams.structure !== '') {
    initialValues.offererId = queryParams.structure
  }

  if (queryParams.lieu !== '') {
    initialValues.venueId = queryParams.lieu
  }

  const formInitialValues = useRef(initialValues)
  const [formValues, setFormValues] = useState({})
  const [offerSubCategory, setOfferSubCategory] = useState({})
  const [formErrors, setFormErrors] = useState({})
  const [showThumbnailForm, setShowThumbnailForm] = useState(false)
  const [thumbnailInfo, setThumbnailInfo] = useState({})
  const [thumbnailError, setThumbnailError] = useState(false)
  const [isSubmitLoading, setIsSubmitLoading] = useState(false)

  useEffect(() => {
    offer?.id && reloadOffer()
  }, [offer?.id, reloadOffer])

  const postThumbnail = useCallback(
    async (offerId, thumbnailInfo) => {
      const offerThumbnailHasBeenUpdated = Object.values(thumbnailInfo).length > 0
      if (offerThumbnailHasBeenUpdated) {
        const { credit, thumbnail, croppingRect, thumbUrl } = thumbnailInfo

        try {
          await pcapi.postThumbnail(
            formValues.offererId,
            offerId,
            credit,
            thumbnail,
            thumbUrl,
            croppingRect?.x,
            croppingRect?.y,
            croppingRect?.height
          )
        } catch (error) {
          setThumbnailError(true)
          showErrorNotification()

          throw error
        }
      }
    },
    [showErrorNotification, formValues.offererId]
  )

  const handleSubmitOffer = useCallback(
    async offerValues => {
      setIsSubmitLoading(true)
      try {
        if (offer) {
          await pcapi.updateOffer(offer.id, offerValues)
          trackEditOffer(offer.id)
          showEditionSuccessNotification()
          reloadOffer()
          setFormErrors({})
        } else {
          const response = await pcapi.createOffer(offerValues)
          const createdOfferId = response.id
          trackCreateOffer(createdOfferId)
          await postThumbnail(createdOfferId, thumbnailInfo)

          let queryString = ''

          if (formInitialValues.current.offererId !== undefined) {
            queryString = `?structure=${formInitialValues.current.offererId}`
          }

          if (formInitialValues.current.venueId !== undefined) {
            queryString += `&lieu=${formInitialValues.current.venueId}`
          }

          history.push(`/offres/${createdOfferId}/stocks${queryString}`)
        }
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
          showErrorNotification()
        }
      }

      setIsSubmitLoading(false)
    },
    [
      history,
      offer,
      postThumbnail,
      reloadOffer,
      showEditionSuccessNotification,
      showErrorNotification,
      thumbnailInfo,
      trackEditOffer,
      trackCreateOffer,
    ]
  )

  const offerStatus = offer?.status
  const isDisabled = offerStatus ? isOfferDisabled(offerStatus) : false

  useEffect(() => {
    dispatch(loadCategories())
  }, [dispatch])

  return (
    <>
      <PageTitle title="Détails de l'offre" />

      <div className={Object.entries(formValues).length !== 0 ? 'sidebar-container' : ''}>
        <div className="content">
          {offer ? (
            <>
              {isDisabled && <OfferStatusBanner status={offerStatus} />}
              <OfferEditionContainer
                formValues={formValues}
                isDisabled={isDisabled}
                isSubmitLoading={isSubmitLoading}
                isUserAdmin={isUserAdmin}
                offer={offer}
                onSubmit={handleSubmitOffer}
                setFormValues={setFormValues}
                setPreviewOfferCategory={setOfferSubCategory}
                setShowThumbnailForm={setShowThumbnailForm}
                showErrorNotification={showErrorNotification}
                submitErrors={formErrors}
                userEmail={userEmail}
              />
            </>
          ) : (
            <OfferCreation
              formValues={formValues}
              initialValues={formInitialValues.current}
              isSubmitLoading={isSubmitLoading}
              isUserAdmin={isUserAdmin}
              onSubmit={handleSubmitOffer}
              setFormValues={setFormValues}
              setPreviewOfferCategory={setOfferSubCategory}
              setShowThumbnailForm={setShowThumbnailForm}
              showErrorNotification={showErrorNotification}
              submitErrors={formErrors}
              userEmail={userEmail}
            />
          )}
        </div>

        {showThumbnailForm && (
          <div className="sidebar">
            <div className="sidebar-wrapper">
              <OfferThumbnail
                isDisabled={isDisabled}
                offerId={offer?.id}
                postThumbnail={postThumbnail}
                setThumbnailInfo={setThumbnailInfo}
                thumbnailError={thumbnailError}
                url={offer?.thumbUrl}
              />
              <OfferPreview
                formValues={formValues}
                offerSubCategory={offerSubCategory}
              />
            </div>
            {offer ? (
              <OfferPreviewLink
                mediationId={offer.activeMediation ? offer.activeMediation.id : null}
                offerId={offer.id}
              />
            ) : null}
          </div>
        )}
      </div>
    </>
  )
}

OfferDetails.defaultProps = {
  offer: null,
  reloadOffer: null,
}

OfferDetails.propTypes = {
  history: PropTypes.shape().isRequired,
  isUserAdmin: PropTypes.bool.isRequired,
  location: PropTypes.shape().isRequired,
  offer: PropTypes.shape(),
  reloadOffer: PropTypes.func,
  showEditionSuccessNotification: PropTypes.func.isRequired,
  showErrorNotification: PropTypes.func.isRequired,
  trackCreateOffer: PropTypes.func.isRequired,
  trackEditOffer: PropTypes.func.isRequired,
  userEmail: PropTypes.string.isRequired,
}

export default OfferDetails
