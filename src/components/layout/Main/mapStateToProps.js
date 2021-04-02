function mapStateToProps(state) {
  return {
    currentUser: state.users.currentUser,
  }
}

export default mapStateToProps
