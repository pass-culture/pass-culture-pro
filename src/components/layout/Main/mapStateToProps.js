import { selectCurrentUser } from 'store/users/selectors'

function mapStateToProps(state) {
  return {
    currentUser: selectCurrentUser(state),
  }
}

export default mapStateToProps
