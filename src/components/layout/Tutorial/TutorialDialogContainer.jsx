import { connect } from 'react-redux'

import TutorialDialog from 'components/layout/Tutorial/TutorialDialog'
import { setUsers } from 'store/reducers/data'

const mapDispatchToProps = dispatch => ({
  setUserHasSeenTuto: currentUser => {
    const updatedUser = { ...currentUser, hasSeenProTutorials: true }
    dispatch(setUsers([updatedUser]))
  },
})

export default connect(null, mapDispatchToProps)(TutorialDialog)
