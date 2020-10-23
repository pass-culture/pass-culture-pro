import { connect } from 'react-redux'
import { requestData } from 'redux-saga-data'

import { selectIsFeatureActive } from 'store/selectors/data/featuresSelectors'

import FeaturedRoute from './FeaturedRoute'

export const mapStateToProps = (state, ownProps) => {
  const { features } = state.data
  const { featureName } = ownProps

  const isFeatureFlipped = featureName !== undefined

  let isRouteDisabled
  if (!isFeatureFlipped) {
    isRouteDisabled = false
  } else {
    isRouteDisabled = !selectIsFeatureActive(state, featureName)
  }

  return {
    areFeaturesLoaded: features.length > 0,
    isRouteDisabled,
  }
}

export const mapDispatchToProps = dispatch => ({
  requestGetFeatures: () => dispatch(requestData({ apiPath: '/features' })),
})

export default connect(mapStateToProps, mapDispatchToProps)(FeaturedRoute)
