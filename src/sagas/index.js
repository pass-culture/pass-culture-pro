import {
  watchDataActions,
  watchErrorsActions,
  watchUserActions,
} from 'pass-culture-shared'
import { watchModalActions } from 'redux-react-modals'
import { all } from 'redux-saga/effects'

import { watchFormActions } from './form'
import { API_URL } from '../utils/config'

function* rootSaga() {
  yield all([
    watchDataActions({
      timeout: 50000,
      url: API_URL,
    }),
    watchErrorsActions(),
    watchFormActions(),
    watchModalActions(),
    watchUserActions(),
  ])
}

export default rootSaga
