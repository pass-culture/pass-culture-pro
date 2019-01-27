import { Selector } from 'testcafe'

import { navigateToOfferAs } from './helpers/navigations'
import { OFFER_WITH_NO_OFFERER_IBAN_WITH_NO_VENUE_IBAN } from './helpers/offers'
import { createUserRole } from './helpers/roles'
import { VALIDATED_UNREGISTERED_OFFERER_USER } from './helpers/users'

async function trimed(selector, lol) {
  return await selector.innerText.then(value => value.trim())
}

const offerListLink = Selector('.navbar-item').withText('Vos offres')
const offerActivSwitch = Selector('.offer-item .activ-switch')
const offerActivSwitchText = () => trimed(Selector('.offer-item .activ-switch'))

fixture`10_01 OffersList | Lister les offres`

test("Lorsque je cliques sur `Mes offres`, j'accès de à la liste des offres", async t => {
  await t
    .useRole(createUserRole(VALIDATED_UNREGISTERED_OFFERER_USER))
    .click(offerListLink)

  const location = await t.eval(() => window.location)

  await t.expect(location.pathname).eql('/offres')

  await t
    .expect(await offerActivSwitchText())
    .eql('Désactiver')
    .click(offerActivSwitch)

  await t
    .expect(await offerActivSwitchText())
    .eql('Activer')
    .click(offerActivSwitch)

  await t.expect(await offerActivSwitchText()).eql('Désactiver')
})

test('Je peux chercher une offre et aller sur sa page', async t => {
  await navigateToOfferAs(
    VALIDATED_UNREGISTERED_OFFERER_USER,
    OFFER_WITH_NO_OFFERER_IBAN_WITH_NO_VENUE_IBAN
  )(t)

  const location = await t.eval(() => window.location)
  await t.expect(location.pathname).match(/\/offres\/([A-Z0-9]*)/)
})
