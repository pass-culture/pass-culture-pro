const latitude = '48.83638'
const longitude = '2.40027'
export const FUTURE_PHYSICAL_VENUE_WITH_SIRET = {
  address: 'RUE DES POILUS',
  anchor: '#a-herbert-marcuse-entreprise',
  city: 'Drancy',
  latitude,
  longitude,
  marker: `${longitude}-${latitude}`,
  name: 'Le lieu magique de type fussoir',
  postalCode: '93700',
  siret: `22222222211111`,
}

export const FUTURE_PHYSICAL_VENUE_WITHOUT_SIRET = {
  address: '1 place du trocadéro',
  banAddress: '1 Place du Trocadero et du 11 Novembre 75016 Paris',
  city: 'Paris',
  comment: 'Test sans SIRET',
  latitude: '48.862923',
  longitude: '2.287896',
  name: 'Lieu sans SIRET',
  postalCode: '75016',
}

export const PHYSICAL_VENUE_WITH_SIRET = {
  name: 'Les Perruches Swing',
  siret: '22222222511111',
}

export const VENUE_FROM_OFFERER_WITH_PHYSICAL_VENUE_WITH_NO_IBAN = {
  name: 'Folie des anachorète',
}
