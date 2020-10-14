import classnames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

const ActionsBar = ({ actionsBarVisibility, children }) => {
  return (
    <div className={classnames('actions-bar', { 'actions-bar-visible': actionsBarVisibility })}>
      <div className="container">
        <div className="actions-bar-content">
          {children}
        </div>
      </div>
    </div>
  )
}

ActionsBar.defaultProps = {
  actionsBarVisibility: false,
}

ActionsBar.propTypes = {
  actionsBarVisibility: PropTypes.bool,
  children: PropTypes.shape().isRequired,
}

export default ActionsBar
