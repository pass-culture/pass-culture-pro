/*
* @debt rtl "Gaël: bad use of act in testing library"
*/

import '@testing-library/jest-dom'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { createBrowserHistory } from 'history'
import React from 'react'
import { Route, Router, Switch } from 'react-router'
import { Link } from 'react-router-dom'

import RouteLeavingGuard from '../RouteLeavingGuard'

const MiniAppTest = () => (
  <div>
    <Link to="/">
      Home
    </Link>
    <Link to="/about">
      About
    </Link>
    <Link to="/contact">
      Contact
    </Link>
    <Switch>
      <Route
        exact
        path="/"
      >
        <div>
          Home page
        </div>
      </Route>
      <Route path="/about">
        <div>
          About page
        </div>
      </Route>
      <Route path="/contact">
        <div>
          Contact page
        </div>
      </Route>
    </Switch>
  </div>
)

const renderRouteLeavingGuard = async (props, history) => {
  await act(async () => {
    await render(
      <Router history={history}>
        <MiniAppTest />
        <RouteLeavingGuard {...props}>
          {props.children}
        </RouteLeavingGuard>
      </Router>
    )
  })
}

describe('src | components | layout | RouteLeavingGuard', () => {
  let props
  let history = createBrowserHistory()

  beforeEach(() => {
    history.push('/')
    props = {
      shouldBlockNavigation: () => true,
      when: true,
      children: 'Voulez-vous quitter la page actuelle ?',
    }
  })

  it('should always display the confirmation modal before redirection', async () => {
    // Given
    await renderRouteLeavingGuard(props, history)

    // When
    const aboutPageLink = screen.getByText('About')
    await fireEvent.click(aboutPageLink)

    // Then
    expect(screen.getByText('Voulez-vous quitter la page actuelle ?')).toBeInTheDocument()
  })

  it("should not display the confirmation model before redirection when it's not activated", async () => {
    // Given
    props.when = false

    //When
    await renderRouteLeavingGuard(props, history)
    const aboutPageLink = screen.getByText('About')
    await fireEvent.click(aboutPageLink)

    //Then
    expect(screen.queryByText('Voulez-vous quitter la page actuelle ?')).not.toBeInTheDocument()
    expect(screen.getByText('About page')).toBeInTheDocument()
  })

  it('should be redirected after confirm on dialog', async () => {
    //Given
    await renderRouteLeavingGuard(props, history)

    // When
    const aboutPageLink = screen.getByText('About')
    await fireEvent.click(aboutPageLink)
    const confirmRedirectionButton = screen.getByText('Quitter')
    await fireEvent.click(confirmRedirectionButton)

    // Then
    expect(screen.queryByText('Home page')).not.toBeInTheDocument()
    expect(screen.getByText('About page')).toBeInTheDocument()
  })

  it('should not be redirected after cancel on dialog', async () => {
    //Given
    await renderRouteLeavingGuard(props, history)
    // When
    const aboutPageLink = screen.getByText('About')
    await fireEvent.click(aboutPageLink)
    const cancelRedirectionButton = screen.getByText('Annuler')
    await fireEvent.click(cancelRedirectionButton)

    // Then
    expect(screen.queryByText('Home page')).toBeInTheDocument()
    expect(screen.queryByText('About page')).not.toBeInTheDocument()
  })

  it('should display the redirection confirmation modal only when the next location is About page', async () => {
    // Given
    props.shouldBlockNavigation = nextLocation => {
      if (nextLocation.pathname === '/about') {
        return true
      }
      return false
    }

    // When
    await renderRouteLeavingGuard(props, history)
    const contactPageLink = screen.getByText('Contact')
    await fireEvent.click(contactPageLink)

    // Then
    expect(screen.queryByText('Home page')).not.toBeInTheDocument()
    expect(screen.getByText('Contact page')).toBeInTheDocument()

    // When
    const aboutPageLink = screen.getByText('About')
    await fireEvent.click(aboutPageLink)

    // Then
    expect(screen.getByText('Voulez-vous quitter la page actuelle ?')).toBeInTheDocument()
  })
})
