import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import HeroSection from '../../layout/HeroSection/HeroSection'
import Main from '../../layout/Main'
import { Form } from 'react-final-form'
import Siren from './Siren/Siren'
import Name from './Name'
import Address from './Address'
import createDecorator from "final-form-calculate"
import { bindAddressAndDesignationFromSiren } from "./decorators/bindSirenFieldToDesignation"
import PostalCode from "./PostalCode"
import City from "./City"

class OffererCreation extends PureComponent {

  handleSubmit = (values) => {
    const { createNewOfferer } = this.props
    createNewOfferer(values, this.onHandleFail)
  }

  onHandleFail = () => {
    const { showNotification } = this.props
    showNotification('Vous étes déjà rattaché à cette structure.', 'danger')
  }

  onRender = ({ handleSubmit, submitting, pristine }) => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="section">
          <div className="field-group">

            <Siren />
            <Name />
            <Address />
            <PostalCode />
            <City />

            <button
              className="button is-primary is-medium"
              disabled={submitting || pristine}
              type="submit"
            >
              {'Valider'}
            </button>
          </div>
        </div>
      </form>
    )
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
          render={this.onRender}
        />
      </Main>
    )
  }
}

OffererCreation.propTypes = {
  createNewOfferer: PropTypes.func.isRequired,
  showNotification: PropTypes.func.isRequired,
}

export default OffererCreation
