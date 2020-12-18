import offerers from './offerers'
import offers from './offers'
import stocks from './stocks'
import thumbnails from './thumbnails'
import types from './types'
import users from './users'
import venues from './venues'

export default {
  ...offers,
  ...offerers,
  ...stocks,
  ...users,
  ...thumbnails,
  ...types,
  ...venues,
}
