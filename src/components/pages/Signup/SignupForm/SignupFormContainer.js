import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import get from 'lodash.get'
import Signup from './Signup'

export const mapStateToProps = state => ({
  offererName: get(state, 'form.user.name'),
})

export default compose(
  withRouter,
  connect(mapStateToProps)
)(Signup)
