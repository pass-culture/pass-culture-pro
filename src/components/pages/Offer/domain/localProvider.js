const doesLastProviderExists = offer => offer !== null && offer.lastProvider

export const localProvidersNames = [
  'fnac',
  'leslibraires.fr',
  'praxiel/inférence',
  'titelive (epagine / place des libraires.com)',
  'titelive stocks (epagine / place des libraires.com)',
]

export const isSyncronizableProvider = (offer = null) => {
  return isOfferFromStockProvider(offer) || isAllocineOffer(offer)
}

export const isOfferFromStockProvider = (offer = null) => {
  return doesLastProviderExists(offer)
    ? localProvidersNames.includes(offer.lastProvider.name.toLowerCase())
    : false
}

export const isAllocineOffer = (offer = null) => {
  return doesLastProviderExists(offer)
    ? offer.lastProvider.name.toLowerCase() === 'allociné'
    : false
}
