import PropTypes from 'prop-types'
import React from 'react'

import { ROOT_PATH } from '../../utils/config'

export const Block = ({
  cancelText,
  confirmText,
  text,
  onConfirmation,
  onCancel,
}) => {
  return (
    <div className="confirm-change">
      <ul>
        <li>
          <img
            src={`${ROOT_PATH}/icons/picto-warning-orange.png`}
            title="picto-warning-orange"
            alt="picto-warning-orange"
          />
        </li>
        <li>{text}</li>
      </ul>
      <div className="level">
        <button
          className="button is-secondary level-item"
          onClick={onConfirmation}
          type="button">
          {confirmText}
        </button>
        <button
          className="button is-secondary level-item"
          onClick={onCancel}
          type="button">
          {cancelText}
        </button>
      </div>
    </div>
  )
}

Block.defaultProps = {
  cancelText: 'Non',
  confirmText: 'Oui',
  text: (
    <div className="m12">
      Êtes-vous sûr de vouloir quitter cette page ? <br />
      Les modifications ne seront pas enregistrées.
    </div>
  ),
}

Block.propTypes = {
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  text: PropTypes.string,
  onConfirmation: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default Block
