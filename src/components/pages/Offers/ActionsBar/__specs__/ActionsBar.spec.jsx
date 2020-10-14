import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

import ActionsBar from '../ActionsBar'

const renderActionsBar = props => {
  return render(<ActionsBar {...props} />)
}

describe('src | components | pages | Offers | ActionsBar', () => {
  let props
  beforeEach(() => {
    props = {
      selectedOfferIds: [],
      setActionsBarVisibility: jest.fn(),
      setSelectedOfferIds: jest.fn(),
    }
  })

  it('should contain "Activer" clickable button', () => {
    renderActionsBar(props)
    const activateButton = screen.queryByText('Activer')
    expect(activateButton).not.toBeNull()
    // TODO expect dispatch to have been called
    // fireEvent.click(activateButton)
  })

  it('should contain "Désactiver" clickable button', () => {
    renderActionsBar(props)
    const desactivateButton = screen.queryByText('Désactiver')
    expect(desactivateButton).not.toBeNull()
    // TODO expect dispatch to have been called
    // fireEvent.click(desactivateButton)
  })

  it('should contain "Annuler" clickable button', () => {
    renderActionsBar(props)
    const cancelButton = screen.queryByText('Annuler')
    expect(cancelButton).not.toBeNull()
    fireEvent.click(cancelButton)
    expect(props.setSelectedOfferIds).toHaveBeenNthCalledWith(1, [])
    expect(props.setActionsBarVisibility).toHaveBeenNthCalledWith(1, false)
  })
})
