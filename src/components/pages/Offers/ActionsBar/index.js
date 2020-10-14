import { connect } from 'react-redux'

import { SET_ACTIONS_BAR_VISIBILITY } from 'store/reducers/actionsBar'
import { SET_SELECTED_OFFER_IDS } from 'store/reducers/offers'

import ActionsBar  from './ActionsBar'

export const mapStateToProps = state => {
  return {
    selectedOfferIds: state.offers.selectedOfferIds,
  }
}

export const mapDispatchToProps = dispatch => {
  return {
    setActionsBarVisibility: (actionsBarVisibility) => {
      dispatch({
        actionsBarVisibility,
        type: SET_ACTIONS_BAR_VISIBILITY,
      })
    },
    setSelectedOfferIds: (selectedOfferIds) => {
      dispatch({
        selectedOfferIds,
        type: SET_SELECTED_OFFER_IDS,
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionsBar)
