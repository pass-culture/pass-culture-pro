const selectNonVirtualVenues = state => {
  const { venues } = state.data || []
  return venues.filter(venue => venue.isVirtual === false)
}

export default selectNonVirtualVenues
