import React from 'react'
import ReactDOM from 'react-dom'

const PortalContext = React.createContext()

export const PortalRenderer = ({ children }) => {
  const container = React.useContext(PortalContext)

  return container ? ReactDOM.createPortal(children, container) : null
}

export default PortalContext.Provider
