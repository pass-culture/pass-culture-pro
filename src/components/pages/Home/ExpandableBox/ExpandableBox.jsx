import PropTypes from 'prop-types'
import React, { useCallback, useState } from 'react'

import Icon from 'components/layout/Icon'

const ExpandableBox = ({ children, tabIndex, title, initialIsExpanded }) => {
  const [isExpanded, setIsExpanded] = useState(initialIsExpanded)

  const toggleExpand = useCallback(() => {
    setIsExpanded(!isExpanded)
  }, [isExpanded, setIsExpanded])

  const onKeypressToggleExpand = useCallback(
    event => {
      if (event.key === 'Enter') toggleExpand()
    },
    [toggleExpand]
  )

  return (
    <div className={`expandable-box${isExpanded ? ' expanded' : ''}`}>
      <div
        className="eb-title-container"
        onClick={toggleExpand}
        onKeyPress={onKeypressToggleExpand}
        role="button"
        tabIndex={tabIndex}
      >
        <h4 className="eb-title">
          {title}
        </h4>

        <Icon
          className="eb-arrow"
          svg="dropdown-disclosure-down-b"
        />
      </div>

      <div className="eb-content">
        {children}
      </div>
    </div>
  )
}

ExpandableBox.defaultProps = {
  initialIsExpanded: false,
}

ExpandableBox.propTypes = {
  children: PropTypes.node.isRequired,
  initialIsExpanded: PropTypes.bool,
  tabIndex: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
}

export default ExpandableBox
