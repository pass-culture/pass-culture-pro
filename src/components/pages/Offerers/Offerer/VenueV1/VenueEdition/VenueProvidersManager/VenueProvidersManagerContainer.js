import { connect } from 'react-redux'

import * as pcapi from 'repository/pcapi/pcapi'
import { showNotification } from 'store/reducers/notificationReducer'

import { getRequestErrorStringFromErrors } from './utils/getRequestErrorStringFromErrors'
import VenueProvidersManager from './VenueProvidersManager'

const mapStateToProps = () => ({
  loadProviders: pcapi.loadProviders,
  loadVenueProviders: pcapi.loadVenueProviders,
  postVenueProvider: pcapi.createVenueProvider,
})

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

export default connect(mapStateToProps, mapDispatchToProps)(VenueProvidersManager)
