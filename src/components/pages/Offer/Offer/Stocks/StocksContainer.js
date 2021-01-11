import { connect } from 'react-redux'

import { showNotificationV2 } from 'store/reducers/notificationReducer'

import Stock from './Stocks'

const mapDispatchToProps = dispatch => ({
  notifySuccess: extraMsg => {
    let successMessage = 'Les stocks ont bien été ajouté.'
    if (extraMsg) {
      successMessage += `\n${extraMsg}`
    }
    return dispatch(
      showNotificationV2({
        type: 'success',
        text: successMessage,
      })
    )
  },
  notifyErrors: errors => {
    return dispatch(
      showNotificationV2({
        type: 'error',
        text: errors.join('\n'),
      })
    )
  },
})

export default connect(null, mapDispatchToProps)(Stock)
