import offerers from './offerers'
import offers from './offers'
import stocks from './stocks'
import types from './types'
import venues from './venues'
import users from './users'

export default {
  ...offers,
  ...offerers,
  ...stocks,
  ...users,
  ...types,
  ...venues,
}

