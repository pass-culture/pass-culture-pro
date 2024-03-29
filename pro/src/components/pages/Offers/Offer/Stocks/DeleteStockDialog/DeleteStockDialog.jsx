/*
* @debt complexity "Gaël: file nested too deep in directory structure"
* @debt directory "Gaël: this file should be migrated within the new directory structure"
*/

import PropTypes from 'prop-types'
import React, { useCallback, useRef } from 'react'

import { DialogBox } from 'components/layout/DialogBox/DialogBox'
import * as pcapi from 'repository/pcapi/pcapi'

import { ReactComponent as DeletionIcon } from './assets/deletion.svg'

const DeleteStockDialog = ({
  notifyDeletionError,
  notifyDeletionSuccess,
  onDelete,
  setIsDeleting,
  stockId,
}) => {
  const DIALOG_LABEL_ID = 'DIALOG_LABEL_ID'
  const deleteButtonRef = useRef()

  const confirmStockDeletion = useCallback(() => {
    pcapi
      .deleteStock(stockId)
      .then(() => {
        notifyDeletionSuccess()
        onDelete()
      })
      .catch(() => notifyDeletionError())
  }, [notifyDeletionError, notifyDeletionSuccess, onDelete, stockId])

  const abortStockDeletion = useCallback(() => setIsDeleting(false), [setIsDeleting])

  return (
    <DialogBox
      extraClassNames="delete-stock-dialog"
      labelledBy={DIALOG_LABEL_ID}
      onDismiss={abortStockDeletion}
      ref={deleteButtonRef}
    >
      <DeletionIcon />
      <h1 id={DIALOG_LABEL_ID}>
        Voulez-vous supprimer ce stock ?
      </h1>
      <p>
        {'Ce stock ne sera plus disponible à la réservation et '}
        <strong>
          entraînera l’annulation des réservations en cours !
        </strong>
      </p>
      <p>
        L’ensemble des utilisateurs concernés sera automatiquement averti par e-mail.
      </p>
      <div className="action-buttons">
        <button
          className="secondary-button"
          onClick={abortStockDeletion}
          type="button"
        >
          Annuler
        </button>
        <button
          className="primary-button"
          onClick={confirmStockDeletion}
          ref={deleteButtonRef}
          type="button"
        >
          Supprimer
        </button>
      </div>
    </DialogBox>
  )
}

DeleteStockDialog.propTypes = {
  notifyDeletionError: PropTypes.func.isRequired,
  notifyDeletionSuccess: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  setIsDeleting: PropTypes.func.isRequired,
  stockId: PropTypes.string.isRequired,
}

export default DeleteStockDialog
