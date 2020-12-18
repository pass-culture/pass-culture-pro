import { selectCurrentUser } from 'store/selectors/data/usersSelectors'

function mapStateToProps(state) {
  return {
    currentUser: state.users.currentUser,
  }
}

export default mapStateToProps
