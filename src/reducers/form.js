import { form } from 'pass-culture-shared'
import { getSirenInformation } from '../components/pages/Offerer/OffererCreation/decorators/getSirenInformation'

export default (state, action) => {
  console.log(getSirenInformation(action.patch.siren))
  const offererInformations = getSirenInformation(action.patch.siren)
  let newForm = form(state, action)
  newForm.user = offererInformations
  return newForm
}
