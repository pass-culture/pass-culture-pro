export const ADD_OFFER = 'ADD_OFFER'
export const ADD_OFFERS = 'ADD_OFFERS'
export const RESET_OFFERS = 'RESET_OFFERS'


export const resetOffers = () => {
  return {
    type: RESET_OFFERS,
  }
}

export const addOffer = (offer) => {
  return {
    type: SET_OFFER_LIST,
    offerId: offer.id,
    offer,
  }
}

export const addOffers = (offers) => {
  return {
    type: SET_OFFER_LIST,
    offerIds: offers.map((offer) => offer.id),
    offers,
  }
}
