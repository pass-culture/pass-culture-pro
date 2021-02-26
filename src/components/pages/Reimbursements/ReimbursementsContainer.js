import { connect } from 'react-redux'

import Reimbursements from './Reimbursements'

export function mapStateToProps(state) {
  return {
    currentUser: state.users.currentUser,
  }
}

export default connect(mapStateToProps)(Reimbursements)
