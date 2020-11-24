import { withRouter } from 'react-router'
import { compose } from 'redux'

import OfferDetails from './OfferDetails'

export default compose(
  withRouter,
)(OfferDetails)
