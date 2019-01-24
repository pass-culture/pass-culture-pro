import { Selector } from 'testcafe'

import { ROOT_PATH } from '../src/utils/config'
import { SIREN_ALREADY_IN_DATABASE } from './helpers/sirens'
import {
  FUTURE_USER_WITH_REGISTERED_OFFERER_USER,
  FUTURE_USER_WITH_UNREGISTERED_OFFERER,
  REAL_VALIDATION_USER,
  VALIDATED_UNREGISTERED_OFFERER_USER,
} from './helpers/users'

const contactOkInput = Selector('#user-contact_ok')
const emailInput = Selector('#user-email')
const emailInputError = Selector('#user-email-error')
const firstNameInput = Selector('#user-firstName')
const lastNameInput = Selector('#user-lastName')
const newsletterOkInput = Selector('#user-newsletter_ok')
const passwordInput = Selector('#user-password')
const passwordInputError = Selector('#user-password-error')
const signInButton = Selector('.is-secondary').withText("J'ai déjà un compte")
const signUpButton = Selector('button.button.is-primary')
const sirenInput = Selector('#user-siren')
const notificationSuccess = Selector('.notification.is-success')

fixture.skip(
  `01_01 SignupPage |  Component | Je crée un compte utilisateur·ice`
).page`${ROOT_PATH + 'inscription'}`

test("Je peux cliquer sur lien pour me connecter si j'ai déja un compte", async t => {
  await t.click(signInButton)
  const location = await t.eval(() => window.location)
  await t.expect(location.pathname).eql('/connexion')
})

test("Lorsque l'un des champs obligatoire est manquant, le bouton créer est desactivé", async t => {
  await t.typeText(emailInput, 'email@email.test')
  await t.expect(signUpButton.innerText).eql('Créer')
  await t.expect(signUpButton.hasAttribute('disabled')).ok()
})

test('Je créé un compte avec un nouveau siren, je suis redirigé·e vers la page /inscription/confirmation', async t => {
  const {
    email,
    firstName,
    lastName,
    password,
    siren,
  } = FUTURE_USER_WITH_UNREGISTERED_OFFERER

  await t
    .typeText(emailInput, email)
    .typeText(passwordInput, password)
    .typeText(lastNameInput, lastName)
    .typeText(firstNameInput, firstName)
    .typeText(sirenInput, siren)

    .expect(signUpButton.hasAttribute('disabled'))
    .ok()
    .click(contactOkInput)
    .click(newsletterOkInput)

  await t.click(signUpButton)

  const location = await t.eval(() => window.location)
  await t.expect(location.pathname).eql('/inscription/confirmation')
})

fixture.skip(
  `01_02 SignupPage | Création d'un compte utilisateur | Messages d'erreur lorsque les champs ne sont pas correctement remplis`
).page`${ROOT_PATH + 'inscription'}`

test.requestHooks(SIREN_ALREADY_IN_DATABASE)(
  'E-mail déjà présent dans la base',
  async t => {
    const {
      email,
      firstName,
      lastName,
      password,
      siren,
    } = VALIDATED_UNREGISTERED_OFFERER_USER

    await t
      .typeText(emailInput, email)
      .typeText(passwordInput, password)
      .typeText(lastNameInput, lastName)
      .typeText(firstNameInput, firstName)
      .typeText(sirenInput, siren)
      .click(contactOkInput)
    await t.click(signUpButton).wait(5000)

    await t.expect(emailInputError.innerText).match(/.*\S.*/)
  }
)

test.requestHooks(SIREN_ALREADY_IN_DATABASE)(
  'Mot de passe invalide',
  async t => {
    const {
      email,
      firstName,
      lastName,
      siren,
    } = VALIDATED_UNREGISTERED_OFFERER_USER

    await t
      .typeText(emailInput, email)
      .typeText(passwordInput, 'pas')
      .typeText(lastNameInput, lastName)
      .typeText(firstNameInput, firstName)
      .typeText(sirenInput, siren)
      .click(contactOkInput)

    await t.click(signUpButton)

    await t.expect(passwordInputError.innerText).match(/.*\S.*/)
  }
)

fixture.skip(
  `01_03 SignupPage | Création d'un compte pour rattachement à une structure existante`
).page`${ROOT_PATH + 'inscription'}`

test.requestHooks(SIREN_ALREADY_IN_DATABASE)(
  'Je créé un compte avec un siren déjà dans la base, je suis redirigé·e vers la page /inscription/confirmation',
  async t => {
    const {
      email,
      firstName,
      lastName,
      password,
      siren,
    } = FUTURE_USER_WITH_REGISTERED_OFFERER_USER

    await t
      .typeText(emailInput, email)
      .typeText(passwordInput, password)
      .typeText(lastNameInput, lastName)
      .typeText(firstNameInput, firstName)
      .typeText(sirenInput, siren)

      .expect(signUpButton.hasAttribute('disabled'))
      .ok()
      .click(contactOkInput)
      .click(newsletterOkInput)

    await t.click(signUpButton)

    const location = await t.eval(() => window.location)
    await t.expect(location.pathname).eql('/inscription/confirmation')
  }
)

fixture`01_04 SignupPage | Clique sur le lien de validation de compte reçu par email`
  .page`${ROOT_PATH + 'inscription'}`

test('Je suis redirigé sur la page de connexion avec un message de confirmation', async t => {
  // given
  const { validationToken } = REAL_VALIDATION_USER

  // when
  await t.navigateTo(`/inscription/validation/${validationToken}`).wait(500)

  // then
  const location = await t.eval(() => window.location)
  await t.expect(location.pathname).eql('/connexion')
  await t.expect(notificationSuccess.exists).ok()
})
