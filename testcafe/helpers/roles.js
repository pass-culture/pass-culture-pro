import { Role, Selector } from 'testcafe'

import { ROOT_PATH } from '../../src/utils/config'

const signInButton = Selector('#signin-submit-button')

export const signinAs = user => async t => {
  await t
    .typeText('#user-identifier', user.email)
    .wait(100)
    .typeText('#user-password', user.password)
    .wait(100)
    .click(signInButton)
    .wait(1000)
}

export const createUserRole = user =>
  Role(`${ROOT_PATH}connexion`, signinAs(user), { preserveUrl: true })

/*
export const VALIDATED_UNREGISTERED_OFFERER_USERRole = Role(
  ROOT_PATH + 'connexion',
  async t => {
    await t
      .typeText('#user-identifier', VALIDATED_UNREGISTERED_OFFERER_USER.email)
      .typeText('#user-password', VALIDATED_UNREGISTERED_OFFERER_USER.password)

      .click('button.button.is-primary')

    const location = await t.eval(() => window.location)
    await t.expect(location.pathname).eql('/offres')
  },
  {
    preserveUrl: true,
  }
)

export const admin = Role(
  ROOT_PATH + 'connexion',
  async t => {
    await t
      .typeText('#user-identifier', ADMIN_0_USER.email)
      .typeText('#user-password', ADMIN_0_USER.password)
      .click('button.button.is-primary')
    const location = await t.eval(() => window.location)
    await t.expect(location.pathname).eql('/offres')
  },
  {
    preserveUrl: true,
  }
)
*/
