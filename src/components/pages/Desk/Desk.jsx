import React from 'react'
import { getRequestErrorStringFromErrors } from 'pass-culture-shared'
import { NavLink } from 'react-router-dom'
import { requestData } from 'redux-saga-data'
import DeskState from './DeskState/DeskState'
import Main from '../../layout/Main'

const CODE_MAX_LENGTH = 6
const CODE_REGEX_VALIDATION = /[^a-z0-9]/i

const CODE_ENTER = 'CODE_ENTER'
const CODE_TYPING = 'CODE_TYPING'

const CODE_SYNTAX_INVALID = 'CODE_SYNTAX_INVALID'
const CODE_ALREADY_USED = 'CODE_ALREADY_USED'
const CODE_VERIFICATION_IN_PROGRESS = 'CODE_VERIFICATION_IN_PROGRESS'
const CODE_VERIFICATION_SUCCESS = 'CODE_VERIFICATION_SUCCESS'
const CODE_VERIFICATION_FAILED = 'CODE_VERIFICATION_FAILED'
const CODE_REGISTERING_IN_PROGRESS = 'CODE_REGISTERING_IN_PROGRESS'
const CODE_REGISTERING_SUCCESS = 'CODE_REGISTERING_SUCCESS'
const CODE_REGISTERING_FAILED = 'CODE_REGISTERING_FAILED'

class Desk extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      booking: null,
      code: '',
      status: CODE_ENTER,
    }
  }

  getBookingFromCode = code => {
    const { dispatch } = this.props
    dispatch(
      requestData({
        apiPath: `/bookings/token/${code}`,
        handleSuccess: this.handleSuccessWhenGetBookingFromCode(),
        handleFail: this.handleFailWhenGetBookingFromCode(),
        stateKey: 'deskBookings',
      })
    )
  }

  handleSuccessWhenGetBookingFromCode = () => (state, action) => {
    const { payload } = action
    const booking = payload.datum

    const status = booking.isValidated
      ? CODE_ALREADY_USED
      : CODE_VERIFICATION_SUCCESS

    this.setState({ booking, status })
  }

  handleFailWhenGetBookingFromCode = () => (state, action) => {
    const {
      payload: { errors },
    } = action

    this.setState({
      status: CODE_VERIFICATION_FAILED,
      message: getRequestErrorStringFromErrors(errors),
    })
  }

  validateBooking = code => {
    const { dispatch } = this.props
    dispatch(
      requestData({
        apiPath: `/bookings/token/${code}`,
        handleFail: this.handleFailWhenValidateBooking(),
        handleSuccess: this.handleSuccessWhenValidateBooking(),
        method: 'PATCH',
      })
    )
  }

  handleSuccessWhenValidateBooking = () => () => {
    this.setState({ status: CODE_REGISTERING_SUCCESS })
  }

  handleFailWhenValidateBooking = () => (state, action) => {
    const {
      payload: { errors },
    } = action

    this.setState({
      status: CODE_REGISTERING_FAILED,
      message: getRequestErrorStringFromErrors(errors),
    })
  }

  handleCodeChange = event => {
    const code = event.target.value.toUpperCase()
    const status = this.getStatusFromCode(code)
    this.setState({ code, status })

    if (status === CODE_VERIFICATION_IN_PROGRESS) {
      return this.getBookingFromCode(code)
    }
  }

  getStatusFromCode = code => {
    if (code === '') {
      return CODE_ENTER
    }

    if (code.match(CODE_REGEX_VALIDATION) !== null) {
      return CODE_SYNTAX_INVALID
    }

    if (code.length < CODE_MAX_LENGTH) {
      return CODE_TYPING
    }

    return CODE_VERIFICATION_IN_PROGRESS
  }

  handleCodeRegistration = code => {
    this.setState({ status: CODE_REGISTERING_IN_PROGRESS, code: '' })
    this.validateBooking(code)
    this.input.focus()
  }

  getValuesFromStatus = status => {
    let { booking, message } = this.state
    let level

    switch (status) {
      case CODE_TYPING:
        message = `Caractères restants: ${CODE_MAX_LENGTH -
          this.state.code.length}/${CODE_MAX_LENGTH}`
        level = 'pending'
        break
      case CODE_SYNTAX_INVALID:
        message = 'Caractères valides : de A à Z et de 0 à 9'
        level = 'error'
        break
      case CODE_VERIFICATION_IN_PROGRESS:
        message = 'Vérification...'
        level = 'pending'
        break
      case CODE_ALREADY_USED:
        message = 'Ce coupon est déjà enregistré'
        level = 'error'
        break
      case CODE_VERIFICATION_SUCCESS:
        message = 'Coupon vérifié, cliquez sur OK pour enregistrer'
        level = 'pending'
        break
      case CODE_REGISTERING_IN_PROGRESS:
        message = 'Enregistrement en cours...'
        level = 'pending'
        break
      case CODE_REGISTERING_SUCCESS:
        message = 'Enregistrement réussi!'
        level = 'success'
        break
      case CODE_VERIFICATION_FAILED:
        level = 'error'
        break
      case CODE_REGISTERING_FAILED:
        level = 'error'
        break
      default:
        message = 'Saisissez un code'
        level = 'pending'
    }

    return {
      booking,
      level,
      message,
    }
  }

  renderChildComponent = () => {
    const { booking, level, message } = this.getValuesFromStatus(
      this.state.status
    )
    return <DeskState booking={booking} level={level} message={message} />
  }

  componentDidMount() {
    this.input.focus()
  }

  getRef() {
    return element => (this.input = element)
  }

  render() {
    return (
      <Main name="desk">
        <div className="section hero">
          <h1 className="main-title">Guichet</h1>
          <p className="subtitle">
            Enregistrez les codes de réservations présentés par les porteurs du
            Pass.
          </p>
        </div>

        <div className="section form">
          <p className="subtitle is-medium has-text-weight-bold">
            Scannez un code-barres ou saisissez-le ci-dessous:
          </p>

          <input
            className="input is-undefined"
            type="text"
            ref={this.getRef()}
            name="code"
            onChange={this.handleCodeChange}
            maxLength={CODE_MAX_LENGTH}
            value={this.state.code}
          />

          <button
            disabled={this.state.status !== CODE_VERIFICATION_SUCCESS}
            className="button"
            type="submit"
            onClick={() => this.handleCodeRegistration(this.state.code)}>
            Valider
          </button>

          {this.renderChildComponent()}

          <NavLink
            id="exitlink"
            className="button is-primary is-medium is-pulled-right"
            to="/accueil">
            Terminer
          </NavLink>
        </div>
      </Main>
    )
  }
}

export default Desk
