import { connect } from 'react-redux'

import Profil from './Profil'

export const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
})

export default connect(mapStateToProps)(Profil)
