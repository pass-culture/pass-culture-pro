import { client } from 'repository/pcapi/pcapiClient'

// src/components/layout/Header/Signout/SignoutButton.jsx:        apiPath: '/users/signout',
// src/components/pages/LostPassword/LostPasswordContainer.js:          apiPath: '/users/reset-password',
// src/components/pages/LostPassword/LostPasswordContainer.js:        apiPath: '/users/new-password',
// src/components/pages/Profil/Profil.jsx:      apiPath: '/users/current',
// src/components/pages/Profil/tests/Profil.spec.jsx:        apiPath: '/users/current',
// src/components/pages/Signin/SigninContainer.js:        apiPath: '/users/signin',
// src/components/pages/Signup/SignupForm/SignupFormContainer.js:        apiPath: '/users/signup/pro',
// src/components/pages/Signup/SignupForm/__specs__/SignupFormContainer.spec.js:            apiPath: '/users/signup/pro',
// src/components/pages/Signup/SignupForm/__specs__/SignupFormContainer.spec.js:            apiPath: '/users/signup/pro',
// src/components/pages/Signup/SignupForm/__specs__/SignupFormContainer.spec.js:            apiPath: '/users/signup/pro',

export default {
  getCurrentUser: () => {
    return client.get('/users/current')
  },
  signOut: () => {
    return Promise.resolve('TODO: api call signOut')
  },
  resetPassword: () => {
    return Promise.resolve('TODO: api call resetPassword')
  },
  newPassword: () => {
    return Promise.resolve('TODO: api call newPassword')
  },
  signIn: () => {
    return Promise.resolve('TODO: api call signIn')
  },
  signUpPro: () => {
    return Promise.resolve('TODO: api call signUpPro')
  },
}
