import { Selector } from 'testcafe'

import { OFFERER_WITH_NO_PHYSICAL_VENUE } from './helpers/offerers'
import {
  FUTURE_PHYSICAL_VENUE_WITH_SIRET,
  FUTURE_PHYSICAL_VENUE_WITHOUT_SIRET,
  PHYSICAL_VENUE_WITH_SIRET,
} from './helpers/venues'
import { createUserRole } from './helpers/roles'
import { VALIDATED_UNREGISTERED_OFFERER_USER } from './helpers/users'

const form = Selector('form#venue')
const mapMarker = Selector('.leaflet-marker-pane img')
const adressInput = Selector('#venue-address')
const backAnchor = Selector('a.back-button')
const cityInput = Selector('#venue-city')
const closeAnchor = Selector('button.close').withText('OK')

const latitudeInput = Selector('#venue-latitude')
const longitudeInput = Selector('#venue-longitude')
const nameInput = Selector('#venue-name')
const navbarAnchor = Selector(
  'a.navbar-link, span.navbar-burger'
).filterVisible()
const newVenueAnchor = Selector('a.button.is-secondary').withText(
  '+ Ajouter un lieu'
)
const postalCodeInput = Selector('#venue-postalCode')
const notificationError = Selector('.notification.is-danger')
const notificationSuccess = Selector('.notification.is-success')
const offererButton = Selector("a[href^='/structures/']").withText(
  OFFERER_WITH_NO_PHYSICAL_VENUE.name
)
const siretInput = Selector('#venue-siret')
const commentInput = Selector('#venue-comment')
const offerersNavbarAnchor = Selector("a.navbar-item[href='/structures']")
const siretInputError = Selector('#venue-siret-error')
const submitButton = Selector('button.button.is-primary') //créer un lieu
const updateAnchor = Selector('a.button.is-secondary') //modifier un lieu
const venueAnchor = Selector(FUTURE_PHYSICAL_VENUE_WITH_SIRET.anchor)
const venueMarker = Selector('img.leaflet-marker-icon')

async function endCreation(t) {
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

fixture`05_01 VenuePage | Créer un nouveau lieu avec succès`

test('Je rentre une nouveau lieu via son siret avec succès', async t => {
  await t.useRole(createUserRole(VALIDATED_UNREGISTERED_OFFERER_USER))

  // navigation
  await t
    .click(navbarAnchor)
    .click(offerersNavbarAnchor)
    .click(offererButton)
    .click(newVenueAnchor)

  const {
    address,
    city,
    latitude,
    longitude,
    marker,
    name,
    postalCode,
    siret,
  } = FUTURE_PHYSICAL_VENUE_WITH_SIRET

  // input
  await t.typeText(siretInput, siret)

  // check other completed fields
  await t.expect(nameInput.value).eql(name)
  await t.expect(adressInput.value).eql(address)
  await t.expect(postalCodeInput.value).eql(postalCode)
  await t.expect(cityInput.value).eql(city)
  await t.expect(latitudeInput.value).eql(latitude)
  await t.expect(longitudeInput.value).eql(longitude)
  await t.expect(venueMarker.getAttribute('alt')).eql(marker)

  await endCreation(t)
})

fixture`05_02 VenuePage | Je ne peux pas créer de lieu, j'ai des erreurs`.beforeEach(
  async t => {
    await t.useRole(createUserRole(VALIDATED_UNREGISTERED_OFFERER_USER))

    // navigation
    await t
      .click(navbarAnchor)
      .click(offerersNavbarAnchor)
      .click(offererButton)

      .click(newVenueAnchor)
  }
)

test('Une entrée avec cet identifiant existe déjà', async t => {
  // input
  await t.typeText(siretInput, PHYSICAL_VENUE_WITH_SIRET.siret)

  // create venue
  await t.click(submitButton)

  // error response
  await t
    .expect(siretInputError.innerText)
    .contains(
      'Une entrée avec cet identifiant existe déjà dans notre base de données'
    )
    .expect(notificationError.innerText)
    .contains('Formulaire non validé\nOK')

  // close notification div
  await t
    .click(closeAnchor)
    .wait(2000)
    .expect(notificationError.exists)
    .notOk()
})

test('Il est obligatoire de saisir Le code SIRET OU le commentaire', async t => {
  await t
    .expect(siretInput.hasAttribute('required'))
    .ok('SIRET doit être requis par défaut')
    .expect(commentInput.hasAttribute('required'))
    .ok('Comment doit être requis par défaut')

    .typeText(siretInput, '123')
    .expect(siretInput.hasAttribute('required'))
    .ok('SIRET doit rester requis même saisi')
    .expect(commentInput.hasAttribute('required'))
    .notOk('Comment ne devrait plus être requis quand SIRET est saisie')

    .selectText(siretInput)
    .pressKey('delete')
    .expect(siretInput.hasAttribute('required'))
    .ok('SIRET doit être requis par défaut')
    .expect(commentInput.hasAttribute('required'))
    .ok('Comment doit être requis à nouveau si SIRET est effacé')

    .typeText(commentInput, 'lorem ipsum dolor sit amet')
    .expect(commentInput.hasAttribute('required'))
    .ok('Comment doit rester requis même saisi')
    .expect(siretInput.hasAttribute('required'))
    .notOk('SIRET ne devrait plus être requis quand Comment est saisie')
})

test('Le code SIRET doit correspondre à un établissement de votre structure', async t => {
  // input
  await t.typeText(siretInput, '492475033 00022')

  // create venue
  await t.click(submitButton)

  // error response
  await t
    .expect(siretInputError.innerText)
    .contains(
      'Le code SIRET doit correspondre à un établissement de votre structure'
    )
    .expect(notificationError.innerText)
    .contains('Formulaire non validé\nOK')
})

test('La saisie de mauvaise coordonées géographique ne crash pas la page', async t => {
  await t
    .typeText(latitudeInput, '45')
    .expect(form.exists)
    .ok()
    .selectText(latitudeInput)
    .typeText(latitudeInput, '45.3')
    .expect(form.exists)
    .ok()
    .selectText(latitudeInput)
    .typeText(latitudeInput, '45,3')
    .expect(form.exists)
    .ok()
    .selectText(latitudeInput)
    .pressKey('delete')
    .typeText(latitudeInput, 'ABC')
    .expect(form.exists)
    .ok()
    .selectText(latitudeInput)
    .pressKey('delete')
    .typeText(latitudeInput, '---')
    .expect(form.exists)
    .ok()
    .selectText(latitudeInput)
    .pressKey('delete')
    .typeText(latitudeInput, ' ')
    .expect(form.exists)
    .ok()
})

test('La saisie de bonnes coordonées géographiques ajoute un marker', async t => {
  await t
    // Given
    .expect(mapMarker.exists)
    .notOk()
    // when
    .typeText(latitudeInput, '45')
    .typeText(longitudeInput, '3.5')
    // then
    .expect(form.exists)
    .ok()
    .expect(mapMarker.exists)
    .ok()
})

test("Le siret n'est pas valide", async t => {
  // TODO
})

fixture`05_03 VenuePage |  Component | Je suis sur la page de détail du lieu`.beforeEach(
  async t => {
    await t.useRole(createUserRole(VALIDATED_UNREGISTERED_OFFERER_USER))

    // navigation
    await t
      .click(navbarAnchor)
      .click(offerersNavbarAnchor)
      .click(offererButton)
      .click(venueAnchor)
  }
)

test('Je vois les détails du lieu', async t => {
  // Navigate to offerer Detail page and found venue added
  await t.click(backAnchor)

  const location = await t.eval(() => window.location)
  await t
    .expect(location.pathname)
    .match(/\/structures\/([A-Z0-9]*)$/)
    .expect(venueAnchor.innerText)
    .eql(OFFERER_WITH_NO_PHYSICAL_VENUE.name)
})

test('Je peux modifier le lieu', async t => {
  // Submit button should disapear
  // update
  await t.click(updateAnchor)
})

const addressInput = Selector('#venue-address')
const addressSuggestion = Selector('.geo-input .menu .item')
fixture`05_04 VenuePage | Créer un nouveau lieu sans SIRET`

test('Je rentre une nouveau lieu sans siret avec succès', async t => {
  await t.useRole(createUserRole(VALIDATED_UNREGISTERED_OFFERER_USER))
  // navigation
  await t
    .click(navbarAnchor)
    .click(offerersNavbarAnchor)
    .click(offererButton)
    .click(newVenueAnchor)

  const {
    address,
    banAddress,
    city,
    comment,
    latitude,
    longitude,
    name,
    postalCode,
  } = FUTURE_PHYSICAL_VENUE_WITHOUT_SIRET

  await t
    .typeText(nameInput, name)
    .typeText(commentInput, comment)
    .typeText(addressInput, address)
    .expect(addressSuggestion.innerText)
    .eql(banAddress)

    .click(addressSuggestion)

    .expect(postalCodeInput.value)
    .eql(postalCode)
    .expect(cityInput.value)
    .eql(city)
    .expect(latitudeInput.value)
    .eql(latitude)
    .expect(longitudeInput.value)
    .eql(longitude)

  await endCreation(t)
})
