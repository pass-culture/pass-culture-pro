import { Icon } from 'pass-culture-shared'
import classnames from 'classnames'
import get from 'lodash.get'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { NavLink } from 'react-router-dom'
import { compose } from 'redux'

import SignoutButton from './SignoutButton'
import Logo from './Logo'

class Header extends Component {
  constructor() {
    super()
    this.state = {
      showMobileMenu: false,
    }
  }

  render() {
    const { location, name, whiteHeader } = this.props
    const { search } = location
    const { showMobileMenu } = this.state
    return (
      <header className={classnames('navbar', { 'is-primary': !whiteHeader })}>
        <div className="container">
          <div className="navbar-brand">
            <Logo className="navbar-item" whiteHeader={whiteHeader} />
            <span
              className="navbar-burger"
              onClick={e =>
                this.setState({
                  showMobileMenu: !showMobileMenu,
                })
              }>
              <span />
              <span />
              <span />
            </span>
          </div>
          <div
            className={classnames('navbar-menu', {
              'is-active': showMobileMenu,
            })}>
            <div className="navbar-end">
              <NavLink className="navbar-item" to={'/guichet'} key={0}>
                <span className="icon">
                  <Icon svg={'ico-guichet-w'} />
                </span>
                <span>Guichet</span>
              </NavLink>
              {!whiteHeader && (
                <NavLink
                  className="navbar-item"
                  to={`/offres${search}`}
                  key={1}>
                  <span className="icon">
                    <Icon svg={'ico-offres-w'} />
                  </span>
                  <span>Vos offres</span>
                </NavLink>
              )}
              <div className="navbar-item has-dropdown is-hoverable">
                <NavLink className="navbar-link" to="#">
                  <span className="icon">
                    <Icon svg={`ico-user-circled${whiteHeader ? '' : '-w'}`} />
                  </span>
                  <span>{name}</span>
                </NavLink>
                <div className="navbar-dropdown is-right">
                  <NavLink to={'/profil'} className="navbar-item">
                    <span className="icon">
                      <Icon svg={'ico-user'} />
                    </span>
                    <span>Profil</span>
                  </NavLink>
                  <NavLink to={'/structures'} className="navbar-item">
                    <span className="icon">
                      <Icon svg={'ico-structure-r'} />
                    </span>
                    <span>Structures</span>
                  </NavLink>
                  {false && (
                    <NavLink to={'/delegations'} className="navbar-item">
                      <span className="icon">
                        <Icon svg={'ico-delegation-r'} />
                      </span>
                      <span>Délégations</span>
                    </NavLink>
                  )}
                  <NavLink to={'/comptabilite'} className="navbar-item">
                    <span className="icon">
                      <Icon svg={'ico-compta'} />
                    </span>
                    <span>Comptabilité</span>
                  </NavLink>
                  <SignoutButton Tag="a" className="navbar-item">
                    <span className="icon">
                      <Icon svg={'ico-deconnect'} />
                    </span>
                    <span>Déconnexion</span>
                  </SignoutButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    )
  }
}

export default compose(
  withRouter,
  connect(state => ({
    name: get(state, 'user.publicName'),
  }))
)(Header)
