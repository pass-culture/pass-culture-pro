import { Selector } from 'testcafe'

import { validatedOffererUserRole } from './helpers/roles'
import { OFFERER_WITH_NO_PHYSICAL_VENUE } from './helpers/offerers'

const adressInput = Selector('input#offerer-address')
const nameInput = Selector('input#offerer-name')
const navbarAnchor = Selector(
  'a.navbar-link, span.navbar-burger'
).filterVisible()
const newOffererAnchor = Selector(
  "a.button.is-primary[href='/structures/nouveau']"
)
const offerersNavbarLink = Selector("a.navbar-item[href='/structures']")
const sirenInput = Selector('#offerer-siren')
const ibanInput = Selector('#offerer-iban')
const bicInput = Selector('#offerer-bic')
const sirenErrorInput = Selector('#offerer-siren-error')
const submitButton = Selector('button.button.is-primary') //connexion

fixture`04_01 OffererPage | Créer une nouvelle structure`.beforeEach(
  async t => {
    await t
      .useRole(validatedOffererUserRole)
      // le userRole a l'option preserveUrl: true donc le test commence sur la page /offres
      .click(navbarAnchor)
      .click(offerersNavbarLink)
      .click(newOffererAnchor)
  }
)

test('Je ne peux pas ajouter de nouvelle structure avec un siren faux', async t => {
  // navigation
  let location = await t.eval(() => window.location)
  await t
    .expect(location.pathname)
    .eql('/structures/nouveau')

    // input
    .typeText(sirenInput, '69256356275794356243264')

  // submit
  await t.click(submitButton)

  // api return an error message
  await t.expect(sirenErrorInput.innerText).contains('Siren invalide')
})

test('Je ne peux pas ajouter de nouvelle structure ayant un siren déjà existant dans la base', async t => {
  // navigation
  let location = await t.eval(() => window.location)
  await t
    .expect(location.pathname)
    .eql('/structures/nouveau')

    // input
    .typeText(sirenInput, OFFERER_WITH_NO_PHYSICAL_VENUE.siren)

  // submit
  await t.click(submitButton)

  // api return an error message
  await t
    .expect(sirenErrorInput.innerText)
    .contains(
      'Une entrée avec cet identifiant existe déjà dans notre base de données'
    )
})

test('Je rentre une nouvelle structure via son siren', async t => {
  // navigation
  let location = await t.eval(() => window.location)
  await t
    .expect(location.pathname)
    .eql('/structures/nouveau')

    // input
    .typeText(sirenInput, '492 475 033')

  // check other completed fields
  await t.expect(nameInput.value).eql('NASKA PROD')
  await t.expect(adressInput.value).eql('167 QUAI DE VALMY')

  // submit
  await t.click(submitButton)

  // check location success change
  location = await t.eval(() => window.location)
  await t.expect(location.pathname).eql('/structures')
})

test.skip('J edit une structure pour lui ajouter ses coordonnées bancaires car je suis admin', async t => {
  // navigation
  let location = await t.eval(() => window.location)
  await t.expect(location.pathname).eql('/structures')

  // form
  // t.typeText(bicInput, 'BNPAFRPP')
  // t.typeText(ibanInput, 'FR7630004000031234567890143')
})
