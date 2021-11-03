
export const sortByOfferName: SortFunction = (firstRow, secondRow) => {  
  const offerNameOne = firstRow.original.offer.name
  const offerNameTwo = secondRow.original.offer.name
  return offerNameOne.localeCompare(offerNameTwo, 'fr', { sensitivity: 'base' })
}

export const sortByBeneficiaryName: SortFunction = (firstRow, secondRow) => {
  let beneficiaryOne = firstRow.original.beneficiary.lastname
  let beneficiaryTwo = secondRow.original.beneficiary.lastname
  const lastNamesAreTheSame =
    beneficiaryOne.localeCompare(beneficiaryTwo, 'fr', { sensitivity: 'base' }) === 0
  if (lastNamesAreTheSame) {
    beneficiaryOne = firstRow.original.beneficiary.firstname
    beneficiaryTwo = secondRow.original.beneficiary.firstname
  }
  return beneficiaryOne.localeCompare(beneficiaryTwo, 'fr', { sensitivity: 'base' })
}

export const sortByBookingDate: SortFunction = (firstRow, secondRow) => {
  const bookingDateOne = new Date(firstRow.original.date)
  const bookingDateTwo = new Date(secondRow.original.date)
  if (bookingDateOne > bookingDateTwo) {
    return 1
  }
  
  if (bookingDateOne < bookingDateTwo) {
    return -1
  }
  
  return 0
}
