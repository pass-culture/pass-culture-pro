import { Selector } from 'testcafe'

import { ROOT_PATH } from '../src/utils/config'
import { offererUser } from './helpers/users'

const inputUsersIdentifier = Selector('#user-identifier')
const inputUsersIdentifierError = Selector('#user-identifier-error')
const inputUsersPassword = Selector('#user-password')
const inputUsersPasswordError = Selector('#user-password-error')
const pageTitle = Selector('h1')
const signInButton = Selector('button.button.is-primary') //connexion
const signUpButton = Selector('.is-secondary') // inscription

fixture`02_01 SignInPage Component | J'ai un compte et je me connecte`
  .page`${ROOT_PATH + 'connexion'}`

test('Je peux cliquer sur lien Créer un compte', async t => {
  await t.click(signUpButton).wait(500)
  const location = await t.eval(() => window.location)
  await t.expect(location.pathname).eql('/inscription')
})

test("Lorsque l'un des deux champs est manquant, le bouton connexion est desactivé", async t => {
  await t.typeText(inputUsersIdentifier, offererUser.email).wait(1000)
  await t.expect(signInButton.hasAttribute('disabled')).ok()
})

test("J'ai un compte valide, je suis redirigé·e vers la page /offres sans erreurs", async t => {
  await t
    .typeText(inputUsersIdentifier, offererUser.email)
    .typeText(inputUsersPassword, offererUser.password)
    .wait(1000)
    .click(signInButton)
    .wait(1000)

  const location = await t.eval(() => window.location)
  await t.expect(location.pathname).eql('/offres')
  await t.expect(pageTitle.innerText).eql('Vos offres')
})

test("J'ai un compte Identifiant invalide, je vois un messages d'erreur et je reste sur la page /connection", async t => {
  await t
    .typeText(inputUsersIdentifier, 'email@email.test')
    .typeText(inputUsersPassword, 'Pa$$word')
    .wait(1000)
    .click(signInButton)
    .wait(1000)

    .expect(inputUsersIdentifierError.innerText)
    .eql('\nIdentifiant incorrect\n\n')

  const location = await t.eval(() => window.location)
  await t.expect(location.pathname).eql('/connexion')
})

test("J'ai un mot de passe invalide, je vois un messages d'erreur et je reste sur la page /connection", async t => {
  await t
    .typeText(inputUsersIdentifier, offererUser.email)
    .typeText(inputUsersPassword, 'Pa$$word')
    .wait(1000)
    .click(signInButton)
    .wait(1000)

    .expect(inputUsersPasswordError.innerText)
    .eql('\nMot de passe incorrect\n\n')

  const location = await t.eval(() => window.location)
  await t.expect(location.pathname).eql('/connexion')
})

fixture`02_02 SignInPage Component | J'accède à une page sans être connecté·e`
  .page`${ROOT_PATH + 'offres'}`

test('Je suis redirigé·e vers la page connexion', async t => {
  await t
  const location = await t.eval(() => window.location)
  await t.expect(location.pathname).eql('/connexion')
})
