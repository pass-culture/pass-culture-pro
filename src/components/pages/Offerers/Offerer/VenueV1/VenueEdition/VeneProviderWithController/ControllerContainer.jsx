import { connect } from 'react-redux'

import { showNotification } from 'store/reducers/notificationReducer'

import Controller from './Controller'

const getRequestErrorStringFromErrors = errors => {
  if (errors instanceof Array) {
    return errors
      .map(error =>
        Object.keys(error)
          .map(key => error[key])
          .join(' ')
      )
      .join(' ')
  }

  if (errors instanceof Object) {
    return Object.keys(errors)
      .map(key => errors[key].map(error => error).join(' '))
      .join(' ')
  }

  return ''
}

const mapDispatchToProps = dispatch => ({
  notifyError: errors => {
    dispatch(
      showNotification({
        text: getRequestErrorStringFromErrors(errors),
        type: 'error',
      })
    )
  },
  notifySuccess: () => {
    dispatch(
      showNotification({
        text: 'La synchronisation a bien été initiée.',
        type: 'success',
      })
    )
  },
})

export default connect(null, mapDispatchToProps)(Controller)
