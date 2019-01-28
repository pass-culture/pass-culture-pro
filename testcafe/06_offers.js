import { Selector } from 'testcafe'

import { navigateToOfferAs } from './helpers/navigations'
import { OFFER_WITH_NO_OFFERER_IBAN_WITH_NO_VENUE_IBAN } from './helpers/offers'
import { createUserRole } from './helpers/roles'
import { VALIDATED_UNREGISTERED_OFFERER_USER } from './helpers/users'

async function trimed(selector, lol) {
  return await selector.innerText.then(value => value.trim())
}

const offerListLink = Selector('.navbar-item').withText('Vos offres')
const offerActivSwitchText = () => trimed(Selector('.offer-item .activ-switch'))

fixture`OffersList A | Lister les offres`

test("Lorsque je cliques sur `Mes offres`, j'accès de à la liste des offres", async t => {
  // given
  await t
    .useRole(createUserRole(VALIDATED_UNREGISTERED_OFFERER_USER))
    .click(offerListLink)

  // then
  const location = await t.eval(() => window.location)
  await t.expect(location.pathname).eql('/offres')
  await t.expect(await offerActivSwitchText()).eql('Désactiver')
})

test('Je peux désactiver ou activer des offres', async t => {
  // given
  const offerActivSwitch = Selector('.offer-item .activ-switch')
  await t
    .useRole(createUserRole(VALIDATED_UNREGISTERED_OFFERER_USER))
    .click(offerListLink)

  // when
  await t.click(offerActivSwitch)

  // then
  await t.expect(await offerActivSwitchText()).eql('Activer')

  // when
  await t.click(offerActivSwitch)

  // then
  await t.expect(await offerActivSwitchText()).eql('Désactiver')
})

test('Je peux chercher une offre et aller sur sa page', async t => {
  // when
  await navigateToOfferAs(
    VALIDATED_UNREGISTERED_OFFERER_USER,
    OFFER_WITH_NO_OFFERER_IBAN_WITH_NO_VENUE_IBAN
  )(t)

  // then
  const location = await t.eval(() => window.location)
  await t.expect(location.pathname).match(/\/offres\/([A-Z0-9]*)/)
})
