import React, { lazy } from 'react'
import { Redirect } from 'react-router'
import LostPasswordContainer from '../components/pages/LostPassword/LostPasswordContainer'
import SigninContainer from '../components/pages/Signin/SigninContainer'
import SignupContainer from '../components/pages/Signup/SignupContainer'
import SignupValidationContainer from '../components/pages/Signup/SignupValidation/SignupValidationContainer'
import Unavailable from '../components/pages/Errors/Unavailable/Unavailable'
import { UNAVAILABLE_ERROR_PAGE } from './routes'

const BookingsRecapContainer = lazy(() =>
  import('../components/pages/Bookings/BookingsRecapContainer')
)
const CsvDetailViewContainer = lazy(() => import('../components/layout/CsvTable/CsvTableContainer'))
const DeskContainer = lazy(() => import('../components/pages/Desk/DeskContainer'))
const HomeContainer = lazy(() => import('../components/pages/Home/HomeContainer'))
const Mediation = lazy(() => import('../components/pages/Mediation/MediationContainer'))
const Offers = lazy(() => import('../components/pages/Offers/OffersContainer'))
const OfferCreation = lazy(() =>
  import('../components/pages/Offer/OfferCreation/OfferCreationContainer')
)
const OfferEdition = lazy(() =>
  import('../components/pages/Offer/OfferEdition/OfferEditionContainer')
)
const Offerers = lazy(() => import('../components/pages/Offerers/OfferersContainer'))
const OffererCreationContainer = lazy(() =>
  import('../components/pages/Offerer/OffererCreation/OffererCreationContainer')
)
const OffererDetailsContainer = lazy(() =>
  import('../components/pages/Offerer/OffererDetails/OffererDetailsContainer')
)
const ProfilContainer = lazy(() => import('../components/pages/Profil/ProfilContainer'))
const ReimbursementsContainer = lazy(() =>
  import('../components/pages/Reimbursements/ReimbursementsContainer')
)
const VenueCreationContainer = lazy(() =>
  import('../components/pages/Venue/VenueCreation/VenueCreationContainer')
)
const VenueEditionContainer = lazy(() =>
  import('../components/pages/Venue/VenueEdition/VenueEditionContainer')
)
const StyleguideContainer = lazy(() => import('../components/pages/Styleguide/StyleguideContainer'))

const RedirectToConnexionComponent = () => <Redirect to="/connexion" />

// NOTE: routes are sorted by PATH alphabetical order
const routes = [
  {
    component: RedirectToConnexionComponent,
    path: '/',
  },
  {
    component: HomeContainer,
    path: '/accueil',
    title: 'Accueil',
  },
  {
    component: SigninContainer,
    path: '/connexion',
    title: 'Connexion',
  },
  {
    component: DeskContainer,
    path: '/guichet',
    title: 'Guichet',
  },
  {
    component: SignupContainer,
    path: '/inscription/(confirmation)?',
    title: 'Inscription',
  },
  {
    component: SignupValidationContainer,
    path: '/inscription/validation/:token',
    title: 'Validation de votre inscription',
  },
  {
    component: LostPasswordContainer,
    path: '/mot-de-passe-perdu',
    title: 'Mot de passe perdu',
  },
  {
    component: Offerers,
    path: '/structures',
    title: 'Structures',
  },
  {
    component: OffererCreationContainer,
    path: '/structures/creation',
    title: 'Structure',
  },
  {
    component: OffererDetailsContainer,
    path: '/structures/:offererId',
    title: 'Structure',
  },
  {
    component: VenueCreationContainer,
    path: '/structures/:offererId/lieux/creation',
    title: 'Lieu',
  },
  {
    component: VenueEditionContainer,
    path: '/structures/:offererId/lieux/:venueId/modification',
    title: 'Lieu',
  },
  {
    component: VenueEditionContainer,
    path: '/structures/:offererId/lieux/:venueId',
    title: 'Lieu',
  },
  {
    component: Offers,
    path: '/structures/:offererId/lieux/:venueId/offres',
    title: 'Offres',
  },
  {
    component: ReimbursementsContainer,
    path: '/remboursements',
    title: 'Remboursements',
  },
  {
    component: BookingsRecapContainer,
    path: '/reservations',
    title: 'Réservations',
  },
  {
    component: Offers,
    path: '/offres',
    title: 'Offres',
  },
  {
    component: OfferCreation,
    path: '/offres/:offerId',
    title: 'Offre',
  },
  {
    component: OfferEdition,
    path: '/offres/:offerId/edition',
    title: "Edition d'une offre",
  },
  {
    component: Mediation,
    path: '/offres/:offerId/accroches/:mediationId',
    title: 'Accroche',
  },
  {
    component: OfferCreation,
    path: '/structures/:offererId/offres/:offerId',
    title: 'Offres',
  },
  {
    component: OfferCreation,
    path: '/structures/:offererId/lieux/:venueId/offres/:offerId',
    title: 'Offres',
  },
  {
    component: ProfilContainer,
    path: '/profil',
    title: 'Profil',
  },
  {
    component: CsvDetailViewContainer,
    path: '/reservations/detail',
    title: 'Réservations',
  },
  {
    component: CsvDetailViewContainer,
    path: '/remboursements/detail',
    title: 'Remboursements',
  },
  {
    component: StyleguideContainer,
    path: '/styleguide',
    title: 'Styleguide',
  },
  {
    component: Unavailable,
    path: UNAVAILABLE_ERROR_PAGE,
    title: 'Page indisponible',
  },
]

export default routes
