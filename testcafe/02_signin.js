import { Selector } from 'testcafe'

import { fetchSandbox } from './helpers/sandboxes'
import { ROOT_PATH } from '../src/utils/config'

const inputUsersIdentifier = Selector('#user-identifier')
const inputUsersIdentifierError = Selector('#user-identifier-error')
const inputUsersPassword = Selector('#user-password')
const inputUsersPasswordError = Selector('#user-password-error')
const pageTitle = Selector('h1')
const signInButton = Selector('button.button.is-primary')
const signUpButton = Selector('.is-secondary')

let dataFromSandboxSigninA
fixture('Signin A | Je me connecte avec un compte validé')
  .page(`${ROOT_PATH + 'connexion'}`)
  .before(async () => {
    if (!dataFromSandboxSigninA) {
      dataFromSandboxSigninA = await fetchSandbox(
        'pro_02_signin',
        'get_existing_pro_validated_user'
      )
    }
  })

test('Je peux cliquer sur le lien "Créer un compte"', async t => {
  // when
  await t.click(signUpButton)

  // then
  const location = await t.eval(() => window.location)
  await t.expect(location.pathname).eql('/inscription')
})

test("Lorsque l'un des deux champs est manquant, le bouton connexion est désactivé", async t => {
  // given
  const { user } = dataFromSandboxSigninA
  const { email } = user

  // when
  await t.typeText(inputUsersIdentifier, email)

  // then
  await t.expect(signInButton.hasAttribute('disabled')).ok()
})

test("J'ai un compte valide, en cliquant sur 'se connecter' je suis redirigé·e vers la page /structures sans erreurs", async t => {
  // given
  const { user } = dataFromSandboxSigninA
  const { email, password } = user

  // when
  await t
    .typeText(inputUsersIdentifier, email)
    .typeText(inputUsersPassword, password)
    .click(signInButton)

  // then
  const location = await t.eval(() => window.location)
  await t.expect(location.pathname).eql('/structures')
  await t.expect(pageTitle.innerText).eql('Votre structure juridique')
})

test("J'ai un compte valide, en appuyant sur la touche 'Entrée' je suis redirigé·e vers la page /structures sans erreurs", async t => {
  // given
  const { user } = dataFromSandboxSigninA
  const { email, password } = user

  // when
  await t
    .typeText(inputUsersIdentifier, email)
    .typeText(inputUsersPassword, password)
    .pressKey('Enter')

  // then
  const location = await t.eval(() => window.location)
  await t.expect(location.pathname).eql('/structures')
  await t.expect(pageTitle.innerText).eql('Votre structure juridique')
})

test.only("J'ai un compte valide, j'ai déjà des offres, en cliquant sur 'se connecter' je suis redirigé·e vers la page /offres sans erreurs", async t => {
  debugger
  // given
  const { user } = await fetchSandbox(
    'pro_07_offer',
    'get_existing_pro_validated_user_with_validated_offerer_validated_user_offerer_with_physical_venue'
  )
  const { email, password } = user

  console.log('USER', user);
  // when
  await t
    .typeText(inputUsersIdentifier, email)
    .typeText(inputUsersPassword, password)
    .click(signInButton)

  // then
  const location = await t.eval(() => window.location)
  await t.expect(location.pathname).eql('/offres')
  await t.expect(pageTitle.innerText).eql('Vos offres')
})

test("J'ai un email incorrect, je vois un message d'erreur et je reste sur la page /connexion", async t => {
  // when
  await t
    .typeText(inputUsersIdentifier, 'email@email.test')
    .typeText(inputUsersPassword, 'Pa$$word')
    .click(signInButton)

  // then
  await t
    .expect(inputUsersIdentifierError.innerText)
    .contains('Identifiant incorrect')
  const location = await t.eval(() => window.location)
  await t.expect(location.pathname).eql('/connexion')
})

test("J'ai un mot de passe incorrect, je vois un message d'erreur et je reste sur la page /connexion", async t => {
  // given
  const { user } = dataFromSandboxSigninA
  const { email } = user

  // when
  await t
    .typeText(inputUsersIdentifier, email)
    .typeText(inputUsersPassword, 'Pa$$word')
    .click(signInButton)

  // then
  await t
    .expect(inputUsersPasswordError.innerText)
    .contains('Mot de passe incorrect')
  const location = await t.eval(() => window.location)
  await t.expect(location.pathname).eql('/connexion')
})

let dataFromSandboxSigninB
fixture('Signin B | Je me connecte avec un compte pas encore validé')
  .page(`${ROOT_PATH + 'connexion'}`)
  .before(async t => {
    if (!dataFromSandboxSigninB) {
      dataFromSandboxSigninB = await fetchSandbox(
        'pro_02_signin',
        'get_existing_pro_not_validated_user'
      )
    }
  })

test("Je vois un message d'erreur et je reste sur la page /connexion", async t => {
  // given
  const { user } = dataFromSandboxSigninB
  const { email, password } = user

  // when
  await t
    .typeText(inputUsersIdentifier, email)
    .typeText(inputUsersPassword, password)
    .click(signInButton)

  // then
  await t
    .expect(inputUsersIdentifierError.innerText)
    .contains("Ce compte n'est pas validé")
  const location = await t.eval(() => window.location)
  await t.expect(location.pathname).eql('/connexion')
})

fixture("Signin C | J'accède à une page sans être connecté·e").page(
  `${ROOT_PATH + 'offres'}`
)

test('Je suis redirigé·e vers la page connexion', async t => {
  await t
  const location = await t.eval(() => window.location)
  await t.expect(location.pathname).eql('/connexion')
})
