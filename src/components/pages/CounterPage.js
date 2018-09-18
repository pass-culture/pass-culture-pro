import { requestData, withLogin } from 'pass-culture-shared'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Main from '../layout/Main'

const COUNTER_WAIT = 'COUNTER_WAIT'
const COUNTER_TYPE = 'COUNTER_TYPE'
const COUNTER_INVALID = 'COUNTER_INVALID'
const COUNTER_GET_VERIFICATION = 'COUNTER_GET_VERIFICATION'
const COUNTER_RECEIVE_VERIFICATION = 'COUNTER_RECEIVE_VERIFICATION'
const COUNTER_FAIL_VERIFICATION = 'COUNTER_FAIL_VERIFICATION'
const COUNTER_POST_REGISTER = 'COUNTER_POST_REGISTER'
const COUNTER_RECEIVE_REGISTER = 'COUNTER_RECEIVE_REGISTER'
const COUNTER_FAIL_REGISTER = 'COUNTER_FAIL_REGISTER'

const CounterState = ({ message, level, booking }) => (
  <div>
    <span className={level}>{message}</span>

    {booking && (
      <ul>
        <li>Identifiant : xxx</li>
        <li>Offre: {booking.token}</li>
        <li>Date de l'offre: xxx</li>
      </ul>
    )}
  </div>
)

CounterState.defaultProps = {
  level: 'Success',
}

CounterState.propTypes = {
  message: PropTypes.string.isRequired,
  level: PropTypes.string,
  booking: PropTypes.object,
}

class CounterPage extends Component {
  constructor(props) {
    super(props)

    this.actions = bindActionCreators({ requestData }, props.dispatch)
    this.state = { state: COUNTER_WAIT, code: '', booking: null }
  }

  getBookingDataFor(code) {
    // @TODO : Fix url with real endpoint
    this.actions.requestData('GET', `/bookings/AE`, {
      key: 'bookings',
      handleSuccess: (state, request) => {
        this.setState({
          state: COUNTER_RECEIVE_VERIFICATION,
          booking: request.data,
        })
      },
      handleFail: (state, request) => {
        this.setState({ state: COUNTER_FAIL_VERIFICATION })
        console.log(request.errors) // @TODO something more usefull...
      },
    })
  }

  postRegistrationFor(code) {
    // @TODO : Fix url with real endpoint
    this.actions.requestData('POST', '/some/url', {
      body: { code },
      handleSuccess: (state, request) => {
        this.setState({ state: COUNTER_RECEIVE_REGISTER })
      },
      handleFail: (state, request) => {
        this.setState({ state: COUNTER_FAIL_REGISTER })
        console.log(request.errors) // @TODO something more usefull...
      },
    })
  }

  handleCodeChange(event) {
    const code = event.target.value
    this.setState({ code })

    if (code === '') {
      return this.setState({ state: COUNTER_WAIT })
    }

    if (code.match(/[^a-z0-9]/i) !== null) {
      return this.setState({ state: COUNTER_INVALID })
    }

    if (code.length < 6) {
      return this.setState({ state: COUNTER_TYPE })
    }

    this.setState({ state: COUNTER_GET_VERIFICATION })
    return this.getBookingDataFor(code)
  }

  handleCodeRegistration(code) {
    this.setState({ state: COUNTER_POST_REGISTER })
    this.postRegistrationFor(code)
  }

  componentDidMount() {
    this.input.focus()
  }

  render() {
    return (
      <Main name="counter">
        <div className="section hero">
          <h1 className="main-title">Guichet</h1>
          <p className="subtitle">
            Enregistrez les codes de réservations présentés par les porteurs du
            Pass.
          </p>
        </div>

        <div className="section">
          <p className="subtitle is-medium has-text-weight-bold">
            Scannez un code-barres, ou saisissez-le ci-dessous:
          </p>
          <input
            className="input is-undefined"
            type="text"
            ref={element => (this.input = element)}
            name="code"
            onChange={this.handleCodeChange.bind(this)}
            maxLength="6"
          />

          {this.state.state === COUNTER_RECEIVE_VERIFICATION && (
            <button
              type="submit"
              onClick={() => this.handleCodeRegistration(this.state.code)}>
              OK
            </button>
          )}

          {this.state.state === COUNTER_WAIT && (
            <CounterState message="Saissez un code" />
          )}

          {this.state.state === COUNTER_TYPE && (
            <CounterState
              message={`caractères restants: ${6 - this.state.code.length}/6`}
            />
          )}

          {this.state.state === COUNTER_INVALID && (
            <CounterState
              level="error"
              message="Caractères valides : de A à Z et de 0 à 9"
            />
          )}

          {this.state.state === COUNTER_GET_VERIFICATION && (
            <CounterState message="Vérification..." />
          )}

          {this.state.state === COUNTER_RECEIVE_VERIFICATION && (
            <CounterState
              booking={this.state.booking}
              message="Booking vérifié !"
            />
          )}

          {this.state.state === COUNTER_POST_REGISTER && (
            <CounterState
              booking={this.state.booking}
              message="Enregistrement en cours..."
            />
          )}

          {this.state.state === COUNTER_RECEIVE_REGISTER && (
            <CounterState
              booking={this.state.booking}
              message="Enregistrement réussi!"
            />
          )}

          {this.state.state === COUNTER_FAIL_REGISTER && (
            <CounterState
              booking={this.state.booking}
              message="Echec de l'enregistrement (problème technique)"
            />
          )}
        </div>

        <NavLink
          className="button is-primary is-medium is-pulled-right"
          to="/offres">
          Terminer
        </NavLink>
      </Main>
    )
  }
}

export default withLogin({ failRedirect: '/connexion' })(connect()(CounterPage))
