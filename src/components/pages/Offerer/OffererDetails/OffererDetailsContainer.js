import { connect } from 'react-redux'
import { compose } from 'redux'

import OffererDetails from './OffererDetails'
import { makeOffererComponentValueObject } from './OffererFactory'

import { withRequiredLogin } from '../../../hocs'
import withTracking from '../../../hocs/withTracking'
import { selectOffererById } from '../../../../selectors/data/offerersSelectors'
import { selectPhysicalVenuesByOffererId } from '../../../../selectors/data/venuesSelectors'
import { selectUserOffererByOffererIdAndUserIdAndRightsType } from '../../../../selectors/data/userOfferersSelectors'

export const mapStateToProps = (state, ownProps) => {
  const { currentUser, match } = ownProps
  const {
    params: { offererId },
  } = match
  const { id: currentUserId } = currentUser

  return {
    offerer: makeOffererComponentValueObject(
      selectUserOffererByOffererIdAndUserIdAndRightsType,
      selectOffererById,
      offererId,
      currentUserId,
      state
    ),
    venues: selectPhysicalVenuesByOffererId(state, offererId),
  }
}

export default compose(
  withTracking('Offerer'),
  withRequiredLogin,
  connect(mapStateToProps)
)(OffererDetails)
