import React from 'react'

import withLogin from '../hocs/withLogin'
import PageWrapper from '../layout/PageWrapper'
import HomeCard from '../HomeCard'

const HomePage = ({ user }) => {
  return (
    <PageWrapper name='home' whiteBg>
      <div className='content'>
        <HomeCard svg='ico-guichet-w' title='Guichet' text='Enregistrez les codes de réservation des porteurs du Pass.' navLink='/guichet' />
        <HomeCard svg='ico-offres-w' title='Vos offres' text='Créez et mettez en avant vos offres présentes sur le Pass.' navLink='/offres' />
      </div>
    </PageWrapper>
  )
}

export default withLogin({ isRequired: true })(HomePage)
