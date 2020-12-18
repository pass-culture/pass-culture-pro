import { connect } from 'react-redux'

import { selectCurrentUser } from 'store/selectors/data/usersSelectors'

import Reimbursements from './Reimbursements'

export function mapStateToProps(state) {
  return {
    currentUser: state.users.currentUser,
  }
}

export default connect(mapStateToProps)(Reimbursements)
