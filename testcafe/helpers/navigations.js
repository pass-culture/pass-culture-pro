import { Selector } from 'testcafe'

import { createUserRole } from './roles'
import { getElementIdFromName } from '../../src/utils/identifiers'

export const navigateToOfferersAs = user => async t => {
  const navbarAnchor = Selector(
    'a.navbar-link, span.navbar-burger'
  ).filterVisible()
  const offerersNavbarAnchor = Selector("a.navbar-item[href='/structures']")

  await t.useRole(createUserRole(user))
  await t.click(navbarAnchor).click(offerersNavbarAnchor)
}

export const navigateToNewOffererAs = user => async t => {
  const newOffererAnchor = Selector(
    "a.button.is-primary[href='/structures/nouveau']"
  )

  await navigateToOfferersAs(user)(t)

  await t.click(newOffererAnchor)
}

export const navigateToNewVenueAs = (user, offerer) => async t => {
  const newVenueAnchor = Selector('a.button.is-secondary').withText(
    '+ Ajouter un lieu'
  )
  const offererButton = Selector("a[href^='/structures/']").withText(
    offerer.name
  )

  await navigateToOfferersAs(user)(t)

  await t.click(offererButton).click(newVenueAnchor)
}

export const navigateToVenueAs = (user, offerer, venue) => async t => {
  const offererButton = Selector("a[href^='/structures/']").withText(
    offerer.name
  )
  const venueAnchor = Selector(`#${getElementIdFromName(venue.name)}`)

  await navigateToOfferersAs(user)(t)

  await t.click(offererButton).click(venueAnchor)
}

export async function navigateAfterSubmit(t) {
  const closeAnchor = Selector('button.close').withText('OK')
  const notificationError = Selector('.notification.is-danger')
  const notificationSuccess = Selector('.notification.is-success')
  const submitButton = Selector('button.button.is-primary') //créer un lieu

  await t.click(submitButton)
  const location = await t.eval(() => window.location)
  await t
    .expect(location.pathname)
    .match(/\/structures\/([A-Z0-9]*)\/lieux\/([A-Z0-9]*)$/)
    .expect(notificationSuccess.innerText)
    .contains(
      'Lieu créé. Vous pouvez maintenant y créer une offre, ou en importer automatiquement.\n\nOK'
    )

  await t
    .click(closeAnchor)
    .expect(notificationError.exists)
    .notOk()
}

export const navigateToNewOfferAs = (user, offerer, venue) => async t => {
  if (venue) {
    const newOfferAnchor = Selector(
      `#${getElementIdFromName(venue.name)}`
    ).parent.parent.find("a[href^='/offres/nouveau?lieu=']")

    await navigateToVenueAs(user, offerer, venue)

    await t.click(newOfferAnchor)
    return
  }
  if (offerer) {
    const newOfferAnchor = Selector(venue.name)
      .withText(offerer.name)
      .parent.parent.parent.find("a[href^='/offres/nouveau?structure=']")

    await navigateToNewOffererAs(user, offerer)

    await t.click(newOfferAnchor)
    return
  }
  const newOfferAnchor = Selector("a[href^='/offres/nouveau']")
  await t.useRole(createUserRole(user)).click(newOfferAnchor)
}

export const navigateToOfferAs = (user, offer) => async t => {
  const searchInput = Selector('#search')
  const submitButton = Selector('button[type="submit"]')
  const offerAnchor = Selector('.name').nth(0)

  await t.useRole(createUserRole(user))

  await t
    .typeText(searchInput, offer.keywordsString)
    .click(submitButton)
    .click(offerAnchor)
}
