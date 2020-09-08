import { OFFER_STATUS } from './offerStatus'

export const mapOfferStatus = (offer, stocks) => {
  if (!offer.isActive) return OFFER_STATUS.DEACTIVATED

  const hasNoStockYet = stocks.length === 0
  if (hasNoStockYet) return OFFER_STATUS.SOLD_OUT

  if (offer.hasBookingLimitDatetimesPassed) return OFFER_STATUS.EXPIRED

  if (offer.isFullyBooked) return OFFER_STATUS.SOLD_OUT

  return OFFER_STATUS.ACTIVE
}
