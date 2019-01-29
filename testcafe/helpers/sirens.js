import { RequestMock } from 'testcafe'

import { OFFERER_WITH_NO_PHYSICAL_VENUE_WITH_NO_IBAN } from './offerers'
import {
  FUTURE_PHYSICAL_VENUE_WITH_SIRET_WITH_OFFERER_IBAN_WITH_NO_IBAN,
  PHYSICAL_VENUE_WITH_SIRET_WITH_OFFERER_IBAN_WITH_NO_IBAN,
} from './venues'

const siren = OFFERER_WITH_NO_PHYSICAL_VENUE_WITH_NO_IBAN.siren
export const SIREN_ALREADY_IN_DATABASE = RequestMock()
  .onRequestTo(`https://sirene.entreprise.api.gouv.fr/v1/siren/${siren}`)
  .respond(
    {
      siege_social: {
        siren,
        l1_normalisee: OFFERER_WITH_NO_PHYSICAL_VENUE_WITH_NO_IBAN.name,
        l4_normalisee: OFFERER_WITH_NO_PHYSICAL_VENUE_WITH_NO_IBAN.address,
        libelle_commune: OFFERER_WITH_NO_PHYSICAL_VENUE_WITH_NO_IBAN.city,
        latitude: OFFERER_WITH_NO_PHYSICAL_VENUE_WITH_NO_IBAN.latitude,
        longitude: OFFERER_WITH_NO_PHYSICAL_VENUE_WITH_NO_IBAN.longitude,
        code_postal: OFFERER_WITH_NO_PHYSICAL_VENUE_WITH_NO_IBAN.postalCode,
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

const futureSiret =
  FUTURE_PHYSICAL_VENUE_WITH_SIRET_WITH_OFFERER_IBAN_WITH_NO_IBAN.siret
export const FUTURE_SIRET = RequestMock()
  .onRequestTo(`https://sirene.entreprise.api.gouv.fr/v1/siret/${futureSiret}`)
  .respond(
    {
      etablissement: {
        siret: futureSiret,
        l1_normalisee:
          FUTURE_PHYSICAL_VENUE_WITH_SIRET_WITH_OFFERER_IBAN_WITH_NO_IBAN.name,
        l4_normalisee:
          FUTURE_PHYSICAL_VENUE_WITH_SIRET_WITH_OFFERER_IBAN_WITH_NO_IBAN.address,
        libelle_commune:
          FUTURE_PHYSICAL_VENUE_WITH_SIRET_WITH_OFFERER_IBAN_WITH_NO_IBAN.city,
        latitude:
          FUTURE_PHYSICAL_VENUE_WITH_SIRET_WITH_OFFERER_IBAN_WITH_NO_IBAN.latitude,
        longitude:
          FUTURE_PHYSICAL_VENUE_WITH_SIRET_WITH_OFFERER_IBAN_WITH_NO_IBAN.longitude,
        code_postal:
          FUTURE_PHYSICAL_VENUE_WITH_SIRET_WITH_OFFERER_IBAN_WITH_NO_IBAN.postalCode,
      },
    },
    200,
    { 'access-control-allow-origin': '*' }
  )

const alreadyInDatabaseSiret =
  PHYSICAL_VENUE_WITH_SIRET_WITH_OFFERER_IBAN_WITH_NO_IBAN.siret
export const SIRET_ALREADY_IN_DATABASE = RequestMock()
  .onRequestTo(
    `https://sirene.entreprise.api.gouv.fr/v1/siret/${alreadyInDatabaseSiret}`
  )
  .respond(
    {
      etablissement: {
        siret: alreadyInDatabaseSiret,
        l1_normalisee:
          PHYSICAL_VENUE_WITH_SIRET_WITH_OFFERER_IBAN_WITH_NO_IBAN.name,
        l4_normalisee:
          PHYSICAL_VENUE_WITH_SIRET_WITH_OFFERER_IBAN_WITH_NO_IBAN.address,
        libelle_commune:
          PHYSICAL_VENUE_WITH_SIRET_WITH_OFFERER_IBAN_WITH_NO_IBAN.city,
        latitude:
          PHYSICAL_VENUE_WITH_SIRET_WITH_OFFERER_IBAN_WITH_NO_IBAN.latitude,
        longitude:
          PHYSICAL_VENUE_WITH_SIRET_WITH_OFFERER_IBAN_WITH_NO_IBAN.longitude,
        code_postal:
          PHYSICAL_VENUE_WITH_SIRET_WITH_OFFERER_IBAN_WITH_NO_IBAN.postalCode,
      },
    },
    200,
    { 'access-control-allow-origin': '*' }
  )
