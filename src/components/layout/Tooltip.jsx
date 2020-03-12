import React from 'react'
import PropTypes from 'prop-types'
import Icon from './Icon'

function Tooltip({ children }) {
  return (
    <div className="tooltip">
      <Icon svg="picto-info" />
      <span className="tooltip-content">
        {children}
      </span>
    </div>
  )
}

Tooltip.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Tooltip
