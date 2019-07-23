import React from 'react'
import { Redirect } from 'react-router'

import BookingsContainer from '../components/pages/Bookings/BookingsContainer'
import DeskContainer from '../components/pages/Desk/DeskContainer'
import HomeContainer from '../components/pages/Home/HomeContainer'
import LostPassword from '../components/pages/LostPassword'
import Mediation from '../components/pages/Mediation/MediationContainer'
import Offers from '../components/pages/Offers'
import Offer from '../components/pages/Offer/OfferContainer'
import OffererContainer from '../components/pages/Offerer/OffererContainer'
import Offerers from '../components/pages/Offerers/OfferersContainer'
import ProfilContainer from '../components/pages/Profil/ProfilContainer'
import ReimbursementsContainer from '../components/pages/Reimbursements/ReimbursementsContainer'
import SigninContainer from '../components/pages/Signin/SigninContainer'
import SignupContainer from '../components/pages/Signup/SignupContainer'
import SignupValidationContainer from '../components/pages/Signup/SignupValidation/SignupValidationContainer'
import Terms from '../components/pages/Terms'
import VenueContainer from '../components/pages/Venue/VenueContainer'
import CsvDetailViewContainer from '../components/layout/CsvDetailView/CsvDetailViewContainer'

// NOTE: routes are sorted by PATH alphabetical order
const routes = [
  {
    path: '/',
    render: () => <Redirect to="/connexion" />,
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
    component: Terms,
    path: '/mentions-legales',
    title: 'Mentions Légales',
  },
  {
    component: LostPassword,
    path: '/mot-de-passe-perdu',
    title: 'Mot de passe perdu',
  },
  {
    component: Offerers,
    path: '/structures',
    title: 'Structures',
  },
  {
    component: OffererContainer,
    path: '/structures/:offererId',
    title: 'Structure',
  },
  {
    component: VenueContainer,
    path: '/structures/:offererId/lieux/:venueId',
    title: 'Lieu',
  },
  {
    component: VenueContainer,
    path: '/structures/:offererId/lieux/:venueId/fournisseurs/:venueProviderId',
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
    component: BookingsContainer,
    path: '/reservations',
    title: 'Réservations',
  },
  {
    component: Offers,
    path: '/offres',
    title: 'Offres',
  },
  {
    component: Offer,
    path: '/offres/:offerId',
    title: 'Offre',
  },
  {
    component: Mediation,
    path: '/offres/:offerId/accroches/:mediationId',
    title: 'Accroche',
  },
  {
    component: Offer,
    path: '/structures/:offererId/offres/:offerId',
    title: 'Offres',
  },
  {
    component: Offer,
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
    title: 'reservations',
  },
  {
    component: CsvDetailViewContainer,
    path: '/remboursements/detail',
    title: 'remboursements',
  },
]

export default routes
