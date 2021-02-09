import withQueryRouter from 'with-query-router'

import { mapBrowserToApi } from 'utils/translate'

import SubmitAndCancelControl from './SubmitAndCancelControl'

export default withQueryRouter({ mapper: mapBrowserToApi })(SubmitAndCancelControl)
