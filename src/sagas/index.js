import { all } from 'redux-saga/effects'
import { watchDataActions } from 'redux-thunk-data'

import { watchErrorsActions } from './errors'
import { watchFormActions } from './form'
import { watchModalActions } from './modal'

import { API_URL } from '../utils/config'

function* rootSaga() {
  yield all([
    watchDataActions({
      rootUrl: API_URL,
      timeout: 50000,
    }),
    watchErrorsActions(),
    watchFormActions(),
    watchModalActions(),
  ])
}

export default rootSaga
