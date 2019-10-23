import createCachedSelector from 're-reselect'

const mapArgsToCacheKey = (state, featureName) => featureName || ''

const selectIsFeatureActive = createCachedSelector(
  state => state.data.features,
  (state, featureName) => featureName,
  (features, featureName) => {
    if (!features) {
      return false
    }
    const selectedFeature = features.find(feature => feature.nameKey === featureName)
    if (!selectedFeature) {
      return false
    }
    return selectedFeature.isActive
  }
)(mapArgsToCacheKey)

export default selectIsFeatureActive
