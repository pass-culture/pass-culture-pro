export function getOfferTypeLabel(event, thing) {
  const offerType = event ? event.offerType : thing.offerType
  return offerType && offerType.label
}

export function getRemainingStock(availableStock, bookings) {
  if (!availableStock && availableStock !== 0) {
    return 'Illimité'
  }

  const validBookings = bookings.filter(
    booking => booking.isCancelled === false
  )

  return availableStock - validBookings.length
}
