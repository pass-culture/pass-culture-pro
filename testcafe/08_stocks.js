import { Selector } from 'testcafe'

import { navigateToOfferAs } from './helpers/navigations'
import { EVENT_OFFER_WITH_OFFERER_IBAN_WITH_NO_VENUE_IBAN } from './helpers/offers'
import { VALIDATED_UNREGISTERED_OFFERER_USER } from './helpers/users'

const addScheduleAnchor = Selector('#add-occurrence-or-stock')
const availableInput = Selector('#stock-available')
const manageStockAnchor = Selector('a.manage-stock')
const scheduleCloseButton = Selector('button.button').withText('Fermer')
const scheduleSubmitButton = Selector('button.button.submitStep')
const priceInput = Selector('#stock-price')
const stockBookingLimitDatetimeInput = Selector('#stock-bookingLimitDatetime')

fixture`OfferPage Gestion A | Créer des dates et des stocks`

test("Je peux créer une occurence d'événement", async t => {
  // given
  await navigateToOfferAs(
    VALIDATED_UNREGISTERED_OFFERER_USER,
    EVENT_OFFER_WITH_OFFERER_IBAN_WITH_NO_VENUE_IBAN
  )(t)

  // when
  await t.click(manageStockAnchor).click(addScheduleAnchor)

  // then
  let location = await t.eval(() => window.location)
  await t.expect(location.search).eql('?gestion&date=nouvelle')

  await t.click(scheduleSubmitButton)
  location = await t.eval(() => window.location)
  await t
    .expect(location.search)
    .match(/\?gestion&date=([A-Z0-9]*)&stock=nouveau$/)

  await t.typeText(priceInput, '10').typeText(availableInput, '50')
  await t.click(scheduleSubmitButton)
  location = await t.eval(() => window.location)
  await t.expect(location.search).eql('?gestion')
})

/*
test('Je peux créer une autre occurence', async t => {

  await t.useRole(createUserRole(VALIDATED_UNREGISTERED_OFFERER_USER))

  const editOfferAnchor = Selector('a.edit-link:first-child')
  const manageStockAnchor = Selector('a.manage-stock')

  await t
    .click(editOfferAnchor)
    .click(manageStockAnchor)
    .click(addScheduleAnchor)
  let location = await t.eval(() => window.location)
  await t.expect(location.search).eql('?gestion&date=nouvelle')
  await t.click(scheduleSubmitButton)
  location = await t.eval(() => window.location)
  await t
    .expect(location.search)
    .match(/\?gestion&date=([A-Z0-9]*)&stock=nouveau$/)
})

test('Je peux créer une occurence en utilisant la touche Entrée', async t => {
  await t.useRole(createUserRole(VALIDATED_UNREGISTERED_OFFERER_USER))

  const editOfferAnchor = Selector('.event a.edit-link:first-child')
  const manageStockAnchor = Selector('a.manage-stock')

  await t
    .click(editOfferAnchor)
    .click(manageStockAnchor)
    .pressKey('Enter')
  let location = await t.eval(() => window.location)
  await t.expect(location.search).eql('?gestion&date=nouvelle')
  await t.pressKey('Enter')
  location = await t.eval(() => window.location)
  await t
    .expect(location.search)
    .match(/\?gestion&date=([A-Z0-9]*)&stock=nouveau$/)

  await t.pressKey('Enter')
  location = await t.eval(() => window.location)
  await t.expect(location.search).match(/\?gestion$/)
})

test('Je peux interrompre la saisie en utilisant la touche Escape', async t => {
  // Given
  await t.useRole(createUserRole(VALIDATED_UNREGISTERED_OFFERER_USER))
  const editOfferAnchor = Selector('.event a.edit-link:first-child')
  const manageStockAnchor = Selector('a.manage-stock')

  // When
  await t
    .click(editOfferAnchor)
    .click(manageStockAnchor)
    .pressKey('Enter')

  // Then
  let location = await t.eval(() => window.location)
  await t.expect(location.search).eql('?gestion&date=nouvelle')

  // When
  await t.pressKey('esc')

  // Then
  location = await t.eval(() => window.location)
  await t
    .expect(location.search)
    .eql('?gestion')
    .expect(location.href)
    .match(/offres\/[A-Z0-9]+/i)
})

test('Je peux femer la fenêtre en utilisant la touche Escape', async t => {
  // Given
  await t.useRole(createUserRole(VALIDATED_UNREGISTERED_OFFERER_USER))
  const editOfferAnchor = Selector('.event a.edit-link:first-child')
  const manageStockAnchor = Selector('a.manage-stock')

  // When
  await t
    .click(editOfferAnchor)
    .click(manageStockAnchor)
    .pressKey('esc')

  // Then
  let location = await t.eval(() => window.location)
  await t
    .expect(location.search)
    .eql('')
    .expect(location.href)
    .match(/offres\/[A-Z0-9]+/i)
})


/*
const closeInput = Selector('button').withText('Fermer')
// ADD AN EVENT OCCURENCE AND A STOCK
const offerGoToGestionButton = Selector('.nb-dates')
await t.click(addScheduleAnchor)
location = await t.eval(() => window.location)
await t.expect(location.search).eql('?gestion&stock=nouveau')
await t.typeText(priceInput, '20')
// await t.typeText(stockBookingLimitDatetimeInput, 20)
await t.click(scheduleSubmitButton)
location = await t.eval(() => window.location)
await t.expect(location.search).match(/\?gestion$/)

const offerId = location.pathname.replace('/offres/', '')

if (await !addScheduleAnchor.exists) {
  t.expect(true).eql(false)
}

await t.click(closeInput)
await t.expect(offerGoToGestionButton.innerText).eql('1 stock')

// await t.click()

// Check price quantity on list page
// TODO Should probably be deported in offers test
await t.click('a.back-button')
const listGoToGestionButton = Selector(`a[href="/offres/${offerId}?gestion"]`)
await t.expect(listGoToGestionButton.innerText).eql('1 prix')
*/

test('Je ne peux pas de rentrer de prix pour une structure et un lieu sans iban', async t => {
  // given
  await navigateToOfferAs(
    VALIDATED_UNREGISTERED_OFFERER_USER,
    EVENT_OFFER_WITH_OFFERER_IBAN_WITH_NO_VENUE_IBAN
  )(t)
  await t.click(manageStockAnchor).click(addScheduleAnchor)
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
