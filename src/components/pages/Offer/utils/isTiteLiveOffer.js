const isTiteLiveOffer = offer => {
  if (offer == null) {
    return false
  }

  const { lastProvider } = offer
  if (lastProvider === null) {
    return false
  }

  return lastProvider.name.toLowerCase().includes('titelive')
}

export default isTiteLiveOffer
