import { connect } from 'react-redux'
import { compose } from 'redux'

import { withQueryRouter } from 'components/hocs/with-query-router/withQueryRouter'
import * as pcapi from 'repository/pcapi/pcapi'
import { loadOffers } from 'store/offers/thunks'
import { selectCurrentUser } from 'store/selectors/data/usersSelectors'

import Offers from './Offers'

export const mapStateToProps = state => {
  return {
    currentUser: selectCurrentUser(state),
    getOfferer: pcapi.getOfferer,
  }
}

export const mapDispatchToProps = dispatch => ({
  loadOffers: filters => dispatch(loadOffers(filters)),
})

export default compose(withQueryRouter(), connect(mapStateToProps, mapDispatchToProps))(Offers)
