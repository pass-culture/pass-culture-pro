import React from 'react'
import { Redirect, matchPath } from 'react-router'

import BookingsRecapContainer from 'components/pages/Bookings/BookingsRecapContainer'
import CsvDetailViewContainer from 'components/layout/CsvTable/CsvTableContainer'
import DeskContainer from 'components/pages/Desk/DeskContainer'
import HomeContainer from 'components/pages/Home/HomeContainer'
import LostPasswordContainer from 'components/pages/LostPassword/LostPasswordContainer'
import Mediation from 'components/pages/Mediation/MediationContainer'
import Offers from 'components/pages/Offers/OffersContainer'
import OfferCreation from 'components/pages/Offer/OfferCreation/OfferCreationContainer'
import OfferEdition from 'components/pages/Offer/OfferEdition/OfferEditionContainer'
import Offerers from 'components/pages/Offerers/OfferersContainer'
import OffererCreationContainer from 'components/pages/Offerer/OffererCreation/OffererCreationContainer'
import OffererDetailsContainer from 'components/pages/Offerer/OffererDetails/OffererDetailsContainer'
import ProfilContainer from 'components/pages/Profil/ProfilContainer'
import ReimbursementsContainer from 'components/pages/Reimbursements/ReimbursementsContainer'
import SigninContainer from 'components/pages/Signin/SigninContainer'
import SignupContainer from 'components/pages/Signup/SignupContainer'
import SignupValidationContainer from 'components/pages/Signup/SignupValidation/SignupValidationContainer'
import VenueCreationContainer from 'components/pages/Venue/VenueCreation/VenueCreationContainer'
import VenueEditionContainer from 'components/pages/Venue/VenueEdition/VenueEditionContainer'
import Unavailable from 'components/pages/Errors/Unavailable/Unavailable'
import StyleguideContainer from 'components/pages/Styleguide/StyleguideContainer'

import { UNAVAILABLE_ERROR_PAGE } from './routes'

const RedirectToConnexionComponent = () => <Redirect to="/connexion" />

// NOTE: routes are sorted by PATH alphabetical order
// DEPRECATED: Pages are currently be rework to not use <Main> component
export const routesWithMain = [
  {
    component: RedirectToConnexionComponent,
    exact: true,
    path: '/',
  },
  {
    component: SigninContainer,
    exact: true,
    path: '/connexion',
    title: 'Connexion',
  },
  {
    component: DeskContainer,
    exact: true,
    path: '/guichet',
    title: 'Guichet',
  },
  {
    component: SignupContainer,
    exact: true,
    path: '/inscription/(confirmation)?',
    title: 'Inscription',
  },
  {
    component: SignupValidationContainer,
    exact: true,
    path: '/inscription/validation/:token',
    title: 'Validation de votre inscription',
  },
  {
    component: LostPasswordContainer,
    exact: true,
    path: '/mot-de-passe-perdu',
    title: 'Mot de passe perdu',
  },
  {
    component: Offerers,
    exact: true,
    path: '/structures',
    title: 'Structures',
  },
  {
    component: OffererCreationContainer,
    exact: true,
    path: '/structures/creation',
    title: 'Structure',
  },
  {
    component: OffererDetailsContainer,
    exact: true,
    path: '/structures/:offererId',
    title: 'Structure',
  },
  {
    component: VenueCreationContainer,
    exact: true,
    path: '/structures/:offererId/lieux/creation',
    title: 'Lieu',
  },
  {
    component: VenueEditionContainer,
    exact: true,
    path: '/structures/:offererId/lieux/:venueId/modification',
    title: 'Lieu',
  },
  {
    component: VenueEditionContainer,
    exact: true,
    path: '/structures/:offererId/lieux/:venueId',
    title: 'Lieu',
  },
  {
    component: Offers,
    exact: true,
    path: '/structures/:offererId/lieux/:venueId/offres',
    title: 'Offres',
  },
  {
    component: ReimbursementsContainer,
    exact: true,
    path: '/remboursements',
    title: 'Remboursements',
  },
  {
    component: BookingsRecapContainer,
    exact: true,
    path: '/reservations',
    title: 'Réservations',
  },
  {
    component: Offers,
    exact: true,
    path: '/offres',
    title: 'Offres',
  },
  {
    component: OfferCreation,
    exact: true,
    path: '/offres/:offerId',
    title: 'Offre',
  },
  {
    component: OfferEdition,
    exact: true,
    path: '/offres/:offerId/edition',
    title: "Edition d'une offre",
  },
  {
    component: Mediation,
    exact: true,
    path: '/offres/:offerId/accroches/:mediationId',
    title: 'Accroche',
  },
  {
    component: OfferCreation,
    exact: true,
    path: '/structures/:offererId/offres/:offerId',
    title: 'Offres',
  },
  {
    component: OfferCreation,
    exact: true,
    path: '/structures/:offererId/lieux/:venueId/offres/:offerId',
    title: 'Offres',
  },
  {
    component: ProfilContainer,
    exact: true,
    path: '/profil',
    title: 'Profil',
  },
  {
    component: CsvDetailViewContainer,
    exact: true,
    path: '/reservations/detail',
    title: 'Réservations',
  },
  {
    component: CsvDetailViewContainer,
    exact: true,
    path: '/remboursements/detail',
    title: 'Remboursements',
  },
  {
    component: StyleguideContainer,
    exact: true,
    path: '/styleguide',
    title: 'Styleguide',
  },
  {
    component: Unavailable,
    exact: true,
    path: UNAVAILABLE_ERROR_PAGE,
    title: 'Page indisponible',
  },
]

// Routes that does not use <Main> and are now functional components
const routes = [
  {
    component: HomeContainer,
    exact: true,
    path: '/accueil',
    title: 'Accueil',
    layoutConfig: {
      whiteHeader: true,
    },
  },
]

export const matchCurrentRoute = pathname => {
  let match = routes.find(route => {
    return !!matchPath(pathname, route)
  })
  if (match) {
    match = { ...match }
    match.layoutConfig.withLayout = true
    return match
  }

  return routesWithMain.find(route => {
    return !!matchPath(pathname, route)
  })
}

export default routes
