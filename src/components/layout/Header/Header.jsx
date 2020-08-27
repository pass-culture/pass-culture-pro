import PropTypes from 'prop-types'
import classnames from 'classnames'
import { SignoutButton } from 'pass-culture-shared'
import React, { PureComponent } from 'react'
import { NavLink } from 'react-router-dom'

import Icon from '../Icon'
import Logo from '../Logo'
import { HELP_PAGE_URL, IS_DEV } from '../../../utils/config'

class Header extends PureComponent {
  constructor() {
    super()
    this.state = {
      showMobileMenu: false,
    }
  }

  onHandleSuccessRedirect = () => '/connexion'

  handleOnClick = showMobileMenu => () => {
    this.setState({
      showMobileMenu: !showMobileMenu,
    })
  }

  render() {
    const { isSmall, name, whiteHeader, offerers } = this.props
    const { showMobileMenu } = this.state

    return (
      <header
        className={classnames('navbar', {
          'is-primary': !whiteHeader,
          'is-small': isSmall,
        })}
      >
        <div className="container">
          <div className="navbar-brand">
            <Logo
              className="navbar-item"
              whiteHeader={whiteHeader}
            />
            <button
              className="navbar-burger"
              onClick={this.handleOnClick(showMobileMenu)}
              type="button"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
          <div
            className={classnames('navbar-menu', {
              'is-active': showMobileMenu,
            })}
          >
            <div className="navbar-end">
              <NavLink
                className="navbar-item"
                to="/guichet"
              >
                <span className="icon">
                  <Icon svg="ico-guichet-w" />
                </span>
                <span>
                  {'Guichet'}
                </span>
              </NavLink>
              {!whiteHeader && (
                <NavLink
                  className="navbar-item"
                  to="/offres"
                >
                  <span className="icon">
                    <Icon svg="ico-offres-w" />
                  </span>
                  <span>
                    {'Offres'}
                  </span>
                </NavLink>
              )}
              <a
                className="navbar-item"
                href={HELP_PAGE_URL}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="icon">
                  <Icon svg="ico-help-w" />
                </span>
                <span>
                  {'Aide'}
                </span>
              </a>
              <div className="navbar-item has-dropdown is-hoverable">
                <NavLink
                  className="navbar-link"
                  to="#"
                >
                  <span className="icon">
                    <Icon svg={`ico-user-circled${whiteHeader ? '' : '-w'}`} />
                  </span>
                  <span>
                    {name}
                  </span>
                </NavLink>
                <div className="navbar-dropdown is-right">
                  <NavLink
                    className="navbar-item"
                    to="/profil"
                  >
                    <span className="icon">
                      <Icon svg="ico-user" />
                    </span>
                    <span>
                      {'Profil'}
                    </span>
                  </NavLink>
                  <NavLink
                    className="navbar-item"
                    to="/structures"
                  >
                    <span className="icon">
                      <Icon svg="ico-structure-r" />
                    </span>
                    <span>
                      {offerers.length > 1 ? 'Structures juridiques' : 'Structure juridique'}
                    </span>
                  </NavLink>
                  {false && (
                    <NavLink
                      className="navbar-item"
                      to="/delegations"
                    >
                      <span className="icon">
                        <Icon svg="ico-delegation-r" />
                      </span>
                      <span>
                        {'Délégations'}
                      </span>
                    </NavLink>
                  )}
                  <NavLink
                    className="navbar-item"
                    to="/reservations"
                  >
                    <span className="icon">
                      <Icon svg="ico-bookings" />
                    </span>
                    <span>
                      {'Réservations'}
                    </span>
                  </NavLink>
                  <NavLink
                    className="navbar-item"
                    to="/remboursements"
                  >
                    <span className="icon">
                      <Icon svg="ico-compta" />
                    </span>
                    <span>
                      {'Remboursements'}
                    </span>
                  </NavLink>
                  {false && (
                    <NavLink
                      className="navbar-item"
                      to="/comptabilite"
                    >
                      <span className="icon">
                        <Icon svg="ico-compta" />
                      </span>
                      <span>
                        {'Comptabilité'}
                      </span>
                    </NavLink>
                  )}
                  {IS_DEV && (
                    <NavLink
                      className="navbar-item"
                      to="/styleguide"
                    >
                      <span className="icon">
                        <Icon svg="ico-stars" />
                      </span>
                      <span>
                        {'Styleguide'}
                      </span>
                    </NavLink>
                  )}
                  <SignoutButton
                    className="navbar-item"
                    handleSuccessRedirect={this.onHandleSuccessRedirect}
                    Tag="a"
                  >
                    <span className="icon">
                      <Icon svg="ico-deconnect" />
                    </span>
                    <span>
                      {'Déconnexion'}
                    </span>
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

Header.defaultProps = {
  isSmall: false,
  whiteHeader: false,
}

Header.propTypes = {
  isSmall: PropTypes.bool,
  name: PropTypes.string.isRequired,
  offerers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  whiteHeader: PropTypes.bool,
}

export default Header
