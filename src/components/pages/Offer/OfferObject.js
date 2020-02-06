export class OfferObject {
  constructor(offer = {}) {
    this.id = offer.id || undefined
    this.lastProvider = offer.lastProvider || null
  }

  get hasBeenProvidedByAllocine() {
    return this.lastProvider.name === 'Allociné'
  }
}
