import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Form } from 'react-final-form'
import createDecorator from 'final-form-calculate'

import HeroSection from '../../../layout/HeroSection/HeroSection'
import Main from '../../../layout/Main'
import { bindAddressAndDesignationFromSiren } from './decorators/bindSirenFieldToDesignation'
import OffererCreationForm from './OffererCreationForm/OffererCreationForm'

class OffererCreation extends PureComponent {

  handleSubmit = (values) => {
    const { createNewOfferer } = this.props
    createNewOfferer(values, this.onHandleFail)
  }

  onHandleSuccess = (_, action) => {
    const { trackCreateOfferer } = this.props
    const { payload } = action
    const createdOffererId = payload.datum.id

    trackCreateOfferer(createdOffererId)
  }

  onHandleFail = () => {
    const { showNotification } = this.props
    showNotification('Vous étes déjà rattaché à cette structure.', 'danger')
  }

  createDecorators = () => {
    const addressAndDesignationFromSirenDecorator = createDecorator({
      field: 'siren',
      updates: bindAddressAndDesignationFromSiren,
    })

    return [ addressAndDesignationFromSirenDecorator ]
  }

  render() {
    return (
      <Main
        backTo={{ label: 'Vos structures juridiques', path: '/structures' }}
        name="offerer"
      >
        <HeroSection
          title="Structure"
        >
          <p className="subtitle">
            {'Détails de la structure rattachée, des lieux et des fournisseurs de ses offres.'}
          </p>
        </HeroSection>

        <Form
          decorators={this.createDecorators()}
          onSubmit={this.handleSubmit}
          render={OffererCreationForm}
        />
      </Main>
    )
  }
}

OffererCreation.propTypes = {
  createNewOfferer: PropTypes.func.isRequired,
  showNotification: PropTypes.func.isRequired,
  trackCreateOfferer: PropTypes.func.isRequired,
}

export default OffererCreation
