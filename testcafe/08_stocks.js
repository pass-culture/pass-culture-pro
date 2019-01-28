import { Selector } from 'testcafe'

import { navigateToOfferAs } from './helpers/navigations'
import {
  EVENT_OFFER_WITH_EVENT_OCCURRENCE_WITH_STOCK_WITH_OFFERER_IBAN_WITH_NO_VENUE_IBAN,
  EVENT_OFFER_WITH_NO_EVENT_OCCURRENCE_WITH_NO_STOCK_WITH_OFFERER_IBAN_WITH_NO_VENUE_IBAN,
  THING_OFFER_WITH_STOCK_WITH_OFFERER_IBAN_WITH_NO_IBAN,
  VIRTUAL_THING_OFFER_WITH_NO_STOCK_WITH_NO_OFFERER_IBAN_WITH_NO_IBAN,
} from './helpers/offers'
import { VALIDATED_UNREGISTERED_OFFERER_USER } from './helpers/users'

const addScheduleAnchor = Selector('#add-occurrence-or-stock')
const availableInput = Selector('#stock-available')
const manageStockAnchor = Selector('a.manage-stock')
const scheduleSubmitButton = Selector('button.button.submitStep')
const priceInput = Selector('#stock-price')

fixture`OfferPage Gestion A | Créer des dates et des stocks`

test.skip("Je peux créer une occurrence et un stock d'événement d'une offre vide", async t => {
  // given
  await navigateToOfferAs(
    VALIDATED_UNREGISTERED_OFFERER_USER,
    EVENT_OFFER_WITH_NO_EVENT_OCCURRENCE_WITH_NO_STOCK_WITH_OFFERER_IBAN_WITH_NO_VENUE_IBAN
  )(t)

  // when
  await t.click(manageStockAnchor).click(addScheduleAnchor)

  // then
  let location = await t.eval(() => window.location)
  await t.expect(location.search).eql('?gestion&date=nouvelle')

  // when
  await t.click(scheduleSubmitButton)

  // then
  location = await t.eval(() => window.location)
  await t
    .expect(location.search)
    .match(/\?gestion&date=([A-Z0-9]*)&stock=nouveau$/)

  // when
  await t.typeText(priceInput, '10').typeText(availableInput, '50')
  await t.click(scheduleSubmitButton)

  // then
  location = await t.eval(() => window.location)
  await t.expect(location.search).eql('?gestion')
})

test.skip('Je peux créer une autre occurrence et un autre stock', async t => {
  // given
  await navigateToOfferAs(
    VALIDATED_UNREGISTERED_OFFERER_USER,
    EVENT_OFFER_WITH_EVENT_OCCURRENCE_WITH_STOCK_WITH_OFFERER_IBAN_WITH_NO_VENUE_IBAN
  )(t)

  // when
  await t.click(manageStockAnchor).click(addScheduleAnchor)

  // then
  let location = await t.eval(() => window.location)
  await t.expect(location.search).eql('?gestion&date=nouvelle')

  // when
  await t.click(scheduleSubmitButton)

  // then
  location = await t.eval(() => window.location)
  await t
    .expect(location.search)
    .match(/\?gestion&date=([A-Z0-9]*)&stock=nouveau$/)

  // when
  await t.typeText(priceInput, '10').typeText(availableInput, '50')
  await t.click(scheduleSubmitButton)

  // then
  location = await t.eval(() => window.location)
  await t.expect(location.search).eql('?gestion')
})

test.skip('Je peux créer une occurrence en utilisant la touche Entrée', async t => {
  // given
  await navigateToOfferAs(
    VALIDATED_UNREGISTERED_OFFERER_USER,
    EVENT_OFFER_WITH_EVENT_OCCURRENCE_WITH_STOCK_WITH_OFFERER_IBAN_WITH_NO_VENUE_IBAN
  )(t)

  // when
  await t.click(manageStockAnchor).pressKey('Enter')

  // then
  let location = await t.eval(() => window.location)
  await t.expect(location.search).eql('?gestion&date=nouvelle')

  // when
  await t.pressKey('Enter')

  // then
  location = await t.eval(() => window.location)
  await t
    .expect(location.search)
    .match(/\?gestion&date=([A-Z0-9]*)&stock=nouveau$/)

  // when
  await t.pressKey('Enter')

  // then
  location = await t.eval(() => window.location)
  await t.expect(location.search).match(/\?gestion$/)
})

test.skip('Je peux femer la fenêtre en utilisant la touche Escape', async t => {
  // given
  await navigateToOfferAs(
    VALIDATED_UNREGISTERED_OFFERER_USER,
    EVENT_OFFER_WITH_EVENT_OCCURRENCE_WITH_STOCK_WITH_OFFERER_IBAN_WITH_NO_VENUE_IBAN
  )(t)

  // when
  await t.click(manageStockAnchor).pressKey('esc')

  // then
  let location = await t.eval(() => window.location)
  await t
    .expect(location.search)
    .eql('')
    .expect(location.href)
    .match(/offres\/[A-Z0-9]+/i)
})

test.skip('Je peux femer la fenêtre en cliquant sur le bouton', async t => {
  // given
  const scheduleCloseButton = Selector('button.button').withText('Fermer')
  await navigateToOfferAs(
    VALIDATED_UNREGISTERED_OFFERER_USER,
    EVENT_OFFER_WITH_EVENT_OCCURRENCE_WITH_STOCK_WITH_OFFERER_IBAN_WITH_NO_VENUE_IBAN
  )(t)

  // when
  await t.click(manageStockAnchor).click(scheduleCloseButton)

  // then
  let location = await t.eval(() => window.location)
  await t
    .expect(location.search)
    .eql('')
    .expect(location.href)
    .match(/offres\/[A-Z0-9]+/i)
})

test.skip('Je peux interrompre la saisie en utilisant la touche Escape', async t => {
  // given
  await navigateToOfferAs(
    VALIDATED_UNREGISTERED_OFFERER_USER,
    EVENT_OFFER_WITH_EVENT_OCCURRENCE_WITH_STOCK_WITH_OFFERER_IBAN_WITH_NO_VENUE_IBAN
  )(t)

  // when
  await t.click(manageStockAnchor).pressKey('Enter')
  // then
  let location = await t.eval(() => window.location)
  await t.expect(location.search).eql('?gestion&date=nouvelle')

  // when
  await t.pressKey('esc')
  // then
  location = await t.eval(() => window.location)
  await t
    .expect(location.search)
    .eql('?gestion')
    .expect(location.href)
    .match(/offres\/[A-Z0-9]+/i)
})

test('Je ne peux pas de rentrer un nouveau stock pour un objet avec déjà un stock', async t => {
  // given
  await navigateToOfferAs(
    VALIDATED_UNREGISTERED_OFFERER_USER,
    THING_OFFER_WITH_STOCK_WITH_OFFERER_IBAN_WITH_NO_IBAN
  )(t)

  // when
  await t.click(manageStockAnchor)

  // then
  await t.expect(addScheduleAnchor.exists).notOk()
})

test("J'ai une info quand je rentre un prix non nul pour l'objet d'une structure et un lieu sans iban", async t => {
  // given
  await navigateToOfferAs(
    VALIDATED_UNREGISTERED_OFFERER_USER,
    VIRTUAL_THING_OFFER_WITH_NO_STOCK_WITH_NO_OFFERER_IBAN_WITH_NO_IBAN
  )(t)
  await t.click(manageStockAnchor).click(addScheduleAnchor)

  // when
  await t.typeText(priceInput, '10')

  // then
  t.debug()
})

test.skip("J'ai une info quand je rentre un prix non nul pour l'évènement d'une structure et un lieu sans iban", async t => {
  // given
  await navigateToOfferAs(
    VALIDATED_UNREGISTERED_OFFERER_USER,
    EVENT_OFFER_WITH_NO_EVENT_OCCURRENCE_WITH_NO_STOCK_WITH_OFFERER_IBAN_WITH_NO_VENUE_IBAN
  )(t)
  await t.click(manageStockAnchor).click(addScheduleAnchor)
  await t.click(scheduleSubmitButton)

  // when
  await t.typeText(priceInput, '10')

  // then
  t.debug()
})

/*
fixture`OfferPage Gestion B | Modifier des dates et des stocks`

test('Je peux modifier une occurence', async t => {
  await t.useRole(createUserRole(VALIDATED_UNREGISTERED_OFFERER_USER))

  const editOfferAnchor = Selector('.event a.edit-link:first-child')
  const manageStockAnchor = Selector('a.manage-stock')
  const editScheduleAnchor = Selector('a.edit-stock:first-child')

  await t
    .click(editOfferAnchor)
    .click(manageStockAnchor)
    .click(editScheduleAnchor)

  let location = await t.eval(() => window.location)
  await t.expect(location.search).match(/\?gestion&date=([A-Z0-9]*)$/)

  const beginInput = Selector('input.date')
  const datePicker = Selector('.react-datepicker')
  const datePickerLastDay = Selector(
    '.react-datepicker__week:last-child .react-datepicker__day:last-child'
  )

  await t
    .expect(beginInput.exists)
    .ok()
    .expect(datePicker.exists)
    .notOk()
    .click(beginInput)
    .expect(datePicker.exists)
    .ok()
    .click(datePickerLastDay)
    .expect(datePicker.exists)
    .notOk()
    .click(scheduleSubmitButton)

  const availableInput = Selector('#stock-available')
  await t.typeText(priceInput, '15').click(scheduleSubmitButton)
})
*/
