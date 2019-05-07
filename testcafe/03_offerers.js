import { Selector } from 'testcafe'

import { fetchSandbox } from './helpers/sandboxes'
import {
  navigateToOffererAs,
  navigateToOfferersAs,
} from './helpers/navigations'

const subTitleHeader = Selector('h2')

fixture(`Offerers A | Voir la liste de mes structures`)

test("L'utilisateur a au moins une structure validé, on peut aller dessus", async t => {
  // given
  const { offerer, user } = await fetchSandbox(
    'pro_03_offerers',
    'get_existing_pro_validated_user_with_validated_offerer_validated_user_offerer'
  )
  const { id: offererId } = offerer
  const activationOffererItem = Selector('.offerer-item')
    .find(`a[href="/structures/${offererId}"]`)
    .parent('.offerer-item')
  const arrow = activationOffererItem.find('div.caret').find('a')

  // when
  await navigateToOfferersAs(user)(t)

  // then
  await t.expect(activationOffererItem.exists).ok()

  // when
  await t.click(arrow)

  // then
  const location = await t.eval(() => window.location)
  await t.expect(location.pathname).match(/\/structures\/([A-Z0-9]*)$/)
  await t.expect(subTitleHeader.exists).ok()
})

test("L'utilisateur a au moins une structure en cours de validation, mais on peut aller dessus", async t => {
  // given
  const { offerer, user } = await fetchSandbox(
    'pro_03_offerers',
    'get_existing_pro_validated_user_with_not_validated_offerer_validated_user_offerer'
  )
  const { id: offererId } = offerer
  const activationOffererItem = Selector('.offerer-item')
    .find(`a[href="/structures/${offererId}"]`)
    .parent('.offerer-item')
  const activationOffererItemValidation = activationOffererItem.find(
    '#offerer-item-validation'
  )
  const arrow = activationOffererItem.find('div.caret').find('a')

  // when
  await navigateToOfferersAs(user)(t)

  // then
  await t.expect(activationOffererItemValidation.exists).ok()

  // when
  await t.click(arrow)

  // then
  const location = await t.eval(() => window.location)
  await t.expect(location.pathname).match(/\/structures\/([A-Z0-9]*)$/)
  await t.expect(subTitleHeader.exists).ok()
})

test("L'utilisateur a au moins un rattachement à une structure en cours de validation, on ne peut pas aller dessus", async t => {
  // given
  const { offerer, user } = await fetchSandbox(
    'pro_03_offerers',
    'get_existing_pro_validated_user_with_validated_offerer_not_validated_user_offerer'
  )
  const { name: offererName } = offerer
  const pendingOffererItem = Selector('.offerer-item.pending').withText(
    offererName
  )
  const arrow = pendingOffererItem.find('div.caret').find('a')

  // when
  await navigateToOfferersAs(user)(t)

  // then
  await t.expect(pendingOffererItem.exists).ok()

  // when
  await t.expect(arrow.exists).notOk()
})

test("L'utilisateur a au moins un rattachement à une structure en cours de validation, une validée avec un rattachement en cours de validation et une validé avec un rattachement validé", async t => {
  // given
  const {
    notValidatedOfferer,
    user,
    offerersCount,
    validatedOffererWithNotValidatedUserOfferer,
    validatedOffererWithValidatedUserOfferer,
  } = await fetchSandbox(
    'pro_03_offerers',
    'get_existing_pro_validated_user_with_not_validated_offerer_validated_user_offerer_and_validated_offerer_not_validated_user_offerer_and_validated_offerer_validated_user_offerer'
  )
  const pendingOffererItem = Selector('.offerer-item.pending').withText(
    validatedOffererWithNotValidatedUserOfferer.name
  )
  const notValidatedOffererItem = Selector('.offerer-item')
    .find(`a[href="/structures/${notValidatedOfferer.id}"]`)
    .parent('.offerer-item')
    .find('#offerer-item-validation')
  const validatedOffererItem = Selector('.offerer-item')
    .find(
      `a[href="/structures/${validatedOffererWithValidatedUserOfferer.id}"]`
    )
    .parent('.offerer-item')

  // when
  await navigateToOfferersAs(user)(t)

  // then
  await t.expect(pendingOffererItem.exists).ok()
  await t.expect(notValidatedOffererItem.exists).ok()
  await t.expect(validatedOffererItem.exists).ok()
  await t.expect(Selector('.offerer-item').count).eql(offerersCount)

  // when
  await t.click(
    validatedOffererItem.find(
      `a[href="/structures/${
        validatedOffererWithValidatedUserOfferer.id
      }/lieux/creation"]`
    )
  )
  await t.navigateTo('/structures')

  // then
  await t.expect(Selector('.offerer-item').count).eql(offerersCount)
})

fixture('Offerers B | Recherche')

test('Je peux chercher une structure avec des mots-clés et naviguer sur sa page', async t => {
  // given
  const { offerer, user } = await fetchSandbox(
    'pro_03_offerers',
    'get_existing_pro_validated_user_with_validated_offerer_validated_user_offerer'
  )
  await navigateToOffererAs(user, offerer)(t)

  // then
  const location = await t.eval(() => window.location)
  await t.expect(location.pathname).match(/\/structures\/([A-Z0-9]*)/)
})

test('Quand je cherche, je filtre sur les structures en cours de rattachement ET celles déjà rattachées', async t => {
  // given
  const {
    notValidatedOfferer,
    user,
    validatedOffererWithNotValidatedUserOfferer,
    validatedOffererWithValidatedUserOfferer,
  } = await fetchSandbox(
    'pro_03_offerers',
    'get_existing_pro_validated_user_with_not_validated_offerer_validated_user_offerer_and_validated_offerer_not_validated_user_offerer_and_validated_offerer_validated_user_offerer'
  )
  const pendingOffererItem = Selector('.offerer-item.pending').withText(
    validatedOffererWithNotValidatedUserOfferer.name
  )
  const notValidatedOffererItem = Selector('.offerer-item')
    .find(`a[href="/structures/${notValidatedOfferer.id}"]`)
    .parent('.offerer-item')
    .find('#offerer-item-validation')
  const validatedOffererItem = Selector('.offerer-item')
    .find(
      `a[href="/structures/${validatedOffererWithValidatedUserOfferer.id}"]`
    )
    .parent('.offerer-item')
  const searchInput = Selector('#search').find('input')
  const submitButton = Selector('button[type="submit"]')
  await navigateToOfferersAs(user)(t)

  // when
  await t
    .typeText(
      searchInput,
      validatedOffererWithNotValidatedUserOfferer.keywordsString
    )
    .click(submitButton)

  // then
  await t.expect(pendingOffererItem.exists).ok()

  // when
  await t
    .typeText(searchInput, notValidatedOfferer.keywordsString, {
      replace: true,
    })
    .click(submitButton)

  // then
  await t.expect(notValidatedOffererItem.exists).ok()

  // when
  await t
    .typeText(
      searchInput,
      validatedOffererWithValidatedUserOfferer.keywordsString,
      { replace: true }
    )
    .click(submitButton)

  // then
  await t.expect(validatedOffererItem.exists).ok()
})
