import { connect } from 'react-redux'
import { compose } from 'redux'

import LostPassword from './LostPassword'

export const mapStateToProps = (state, ownProps) => {
  const userErrors = state.errors.user || []
  const { change, envoye, token } = Object.fromEntries(
    new URLSearchParams(ownProps.location.search)
  )
  return {
    change,
    errors: userErrors,
    envoye,
    token,
  }
}

export default compose(connect(mapStateToProps))(LostPassword)
