import { Selector } from 'testcafe'

import { createUserRole } from './helpers/roles'
import { VALIDATED_UNREGISTERED_OFFERER_USER } from './helpers/users'

const priceInput = Selector('#stock-price')
const stockBookingLimitDatetimeInput = Selector('#stock-bookingLimitDatetime')
const scheduleCloseButton = Selector('button.button').withText('Fermer')
const scheduleSubmitButton = Selector('button.button.submitStep')

fixture`07_01 OfferPage_Manager | Créer un stock`

test("Je peux créer une occurence d'événement", async t => {
  await t.useRole(createUserRole(VALIDATED_UNREGISTERED_OFFERER_USER))

  const editOfferAnchor = Selector('.event a.edit-link:first-child')
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

  const availableInput = Selector('#stock-available')
  await t.typeText(priceInput, '10').typeText(availableInput, '50')
  await t.click(scheduleSubmitButton)
  location = await t.eval(() => window.location)
  await t.expect(location.search).eql('?gestion')
})

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
