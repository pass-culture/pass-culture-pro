import { Selector } from 'testcafe'

import { createUserRole } from './roles'

const navbarAnchor = Selector(
  'a.navbar-link, span.navbar-burger'
).filterVisible()
const offerersNavbarAnchor = Selector("a.navbar-item[href='/structures']")
export const navigateToOfferersAs = user => async t => {
  await t.useRole(createUserRole(user))
  await t.click(navbarAnchor).click(offerersNavbarAnchor)
}

const newOffererAnchor = Selector(
  "a.button.is-primary[href='/structures/nouveau']"
)
export const navigateToNewOffererAs = user => async t => {
  await navigateToOfferersAs(user)(t)
  await t.click(newOffererAnchor)
}

const newVenueAnchor = Selector('a.button.is-secondary').withText(
  '+ Ajouter un lieu'
)
export const navigateToNewVenueAs = (user, offerer) => async t => {
  await navigateToOfferersAs(user)(t)
  const offererButton = Selector("a[href^='/structures/']").withText(
    offerer.name
  )
  await t.click(offererButton).click(newVenueAnchor)
}

export const navigateToVenueAs = (user, offerer, venue) => async t => {
  await navigateToOfferersAs(user)(t)
  const offererButton = Selector("a[href^='/structures/']").withText(
    offerer.name
  )
  const venueAnchor = Selector(venue.anchor)
  await t.click(offererButton).click(venueAnchor)
}

const closeAnchor = Selector('button.close').withText('OK')
const notificationError = Selector('.notification.is-danger')
const notificationSuccess = Selector('.notification.is-success')
const submitButton = Selector('button.button.is-primary') //créer un lieu
export async function navigateAfterSubmit(t) {
  // create venue
  await t.click(submitButton)
  const location = await t.eval(() => window.location)
  await t
    .expect(location.pathname)
    .match(/\/structures\/([A-Z0-9]*)\/lieux\/([A-Z0-9]*)$/)
    .expect(notificationSuccess.innerText)
    .contains(
      'Lieu créé. Vous pouvez maintenant y créer une offre, ou en importer automatiquement.\n\nOK'
    )

  // close notification div
  await t
    .click(closeAnchor)
    .expect(notificationError.exists)
    .notOk()
}
