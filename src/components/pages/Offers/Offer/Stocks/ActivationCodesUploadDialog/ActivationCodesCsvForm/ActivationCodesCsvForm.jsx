import PropTypes from 'prop-types'
import React, { forwardRef, Fragment } from 'react'

export const ActivationCodeCsvForm = forwardRef(function ActivationCodeCsvForm(
  { isFileInputDisabled, submitThumbnail },
  ref
) {
  return (
    <Fragment>
      <div className="activation-codes-upload-description">
        <p>
          {
            'Pour les offres nécessitant une activation par code sur une plateforme extérieure, vous pouvez importer directement un fichier .csv.'
          }
        </p>
        <p>
          {
            'Le stock disponible sera automatiquement mis à jour. Les jeunes auront accès à ce code dans leur espace réservation.'
          }
        </p>
      </div>
      <div className="activation-codes-upload-button-section">
        <label className="primary-button activation-codes-upload-label">
          {"Importer un fichier .csv depuis l'ordinateur"}
          <input
            accept=".csv"
            className="activation-codes-upload-input"
            disabled={isFileInputDisabled}
            onChange={submitThumbnail}
            ref={ref}
            type="file"
          />
        </label>
        <div className="activation-codes-upload-button-caption">
          <p>
            {'Format supporté : CSV'}
          </p>
          <p>
            {'Le poids du fichier ne doit pas dépasser 1 Mo'}
          </p>
        </div>
      </div>
      <div className="activation-codes-upload-separator" />
    </Fragment>
  )
})

ActivationCodeCsvForm.propTypes = {
  isFileInputDisabled: PropTypes.bool.isRequired,
  submitThumbnail: PropTypes.func.isRequired,
}