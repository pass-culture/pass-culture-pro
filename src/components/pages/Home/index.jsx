import React from 'react'

import Card from './Card'
import { withRequiredLogin } from '../../hocs'
import Main from '../../layout/Main'

const Home = () => (
  <Main
    name="home"
    whiteHeader
  >
    <div className="home-cards columns">
      <Card
        navLink="/guichet"
        svg="ico-guichet-w"
        text="Enregistrez les codes de réservation des porteurs du Pass."
        title="Guichet"
      />
      <Card
        navLink="/offres"
        svg="ico-offres-w"
        text="Créez et mettez en avant vos offres présentes sur le Pass."
        title="Vos offres"
      />
    </div>
  </Main>
)

export default withRequiredLogin(Home)
