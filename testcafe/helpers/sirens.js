import { RequestMock } from 'testcafe'

import { OFFERER_WITH_NO_PHYSICAL_VENUE } from './offerers'

const { name, siren } = OFFERER_WITH_NO_PHYSICAL_VENUE
export const SIREN_ALREADY_IN_DATABASE = RequestMock()
  .onRequestTo(`https://sirene.entreprise.api.gouv.fr/v1/siren/${siren}`)
  .respond(
    {
      siege_social: {
        siren: siren,
        l1_normalisee: name,
      },
    },
    200,
    { 'access-control-allow-origin': '*' }
  )

export const SIREN_WITHOUT_ADDRESS = RequestMock()
  .onRequestTo('https://sirene.entreprise.api.gouv.fr/v1/siren/216701375')
  .respond(
    {
      siege_social: {
        siren: '216701375',
        l1_normalisee: 'Nom',
        l4_normalisee: null,
        libelle_commune: 'test',
        latitude: '12.98723',
        longitude: '87.01821',
        code_postal: '75000',
      },
    },
    200,
    { 'access-control-allow-origin': '*' }
  )
